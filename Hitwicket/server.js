const http = require("http"); //https is the nodejs in built module for creating http servers
const express = require("express");//express is the web framework for nodejs for server creation
const app = express();

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html")); //connecting it with the client side code
app.listen(9091, () => console.log("Listening on http port 9091"));//i am using port 9091 for server and client connection and for incoming http requests

const websocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("Listening on WebSocket port 9090"));//uses 9090 for real time communication

const clients = {};
const games = {};

const wsServer = new websocketServer({
    "httpServer": httpServer
});
//checks the incoming websocket requests and establishes the connection
wsServer.on("request", request => {
    const connection = request.accept(null, request.origin);

    connection.on("open", () => console.log("opened!"));
    connection.on("close", () => console.log("closed!"));
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data);

        if (result.method === "create") {
            const clientId = result.clientId;
            const gameId = guid();
            const state = initializeBoard();
            games[gameId] = {
                "id": gameId,
                "clients": [],
                "state": state,
                "currentPlayer": "A"
            };

            const payLoad = {
                "method": "create",
                "game": games[gameId]
            };

            const con = clients[clientId].connection;
            con.send(JSON.stringify(payLoad));
        }

        if (result.method === "join") {
            const clientId = result.clientId;
            const gameId = result.gameId;
            const game = games[gameId];
            game.clients.push(clientId);

            const payLoad = {
                "method": "join",
                "game": game
            };

            game.clients.forEach(cId => {
                clients[cId].connection.send(JSON.stringify(payLoad));
            });

            if (game.clients.length === 2) {
                notifyTurn(gameId);
                updateGameState(gameId);
            }
        }

        if (result.method === "play") {
            const gameId = result.gameId;
            const game = games[gameId];
            const move = result.move;

            if (validateMove(move, game)) {
                applyMove(move, game);
                if (checkWinCondition(game)) {
                    const payLoad = {
                        "method": "win",
                        "winner": game.currentPlayer
                    };

                    game.clients.forEach(cId => {
                        clients[cId].connection.send(JSON.stringify(payLoad));
                    });
                } else {
                    game.currentPlayer = game.currentPlayer === "A" ? "B" : "A";
                    notifyTurn(gameId);
                    updateGameState(gameId);
                }
            } else {
                const payLoad = {
                    "method": "invalidMove"
                };

                const con = clients[game.clients[0]].connection;
                con.send(JSON.stringify(payLoad));
            }
        }
    });
//assigns the unique id to each connected client and it will store their connection
    const clientId = guid();
    clients[clientId] = {
        "connection": connection
    };

    const payLoad = {
        "method": "connect",
        "clientId": clientId
    };
    connection.send(JSON.stringify(payLoad));
});
//it will initialize the board that to be displayed to play
function initializeBoard() {
    return [
        ["A-P1", "A-H1", "A-H2", "A-P2", "A-P3"],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        ["B-P1", "B-H1", "B-H2", "B-P2", "B-P3"]
    ];
}
//updates the states of the game simantaneously in both the tabs we open
function updateGameState(gameId) {
    const game = games[gameId];
    const payLoad = {
        "method": "update",
        "game": game
    };

    game.clients.forEach(cId => {
        clients[cId].connection.send(JSON.stringify(payLoad));
    });
}

function notifyTurn(gameId) {
    const game = games[gameId];
    const payLoad = {
        "method": "turn",
        "currentPlayer": game.currentPlayer
    };

    game.clients.forEach(cId => {
        clients[cId].connection.send(JSON.stringify(payLoad));
    });
}
//this function is the main by which our block moves
function validateMove(move, game) {
    const [piece, direction] = move.split(":");
    const state = game.state;

    //first it finds the position of the block on the game board
    let pieceRow = -1;
    let pieceCol = -1;
    for (let row = 0; row < state.length; row++) {
        for (let col = 0; col < state[row].length; col++) {
            if (state[row][col] === `${game.currentPlayer}-${piece}`) {
                pieceRow = row;
                pieceCol = col;
                break;
            }
        }
        if (pieceRow !== -1) break; //exits if the block is found
    }

    if (pieceRow === -1 || pieceCol === -1) {
        console.log("Piece not found on the board.");
        return false; //returns false if the block is not found
    }

    //determines the target location of target row and target column based on the direction
    let targetRow = pieceRow;
    let targetCol = pieceCol;

    //pawn can only move one step in any direction that are left,right,forward and backward
    const moveDistance = (piece.startsWith("P")) ? 1 : 2;
    //creating the switch case to check the input given in the prompt and do the following actions 
    switch (direction) {
        //for left
        case "L":
            targetCol = pieceCol - moveDistance;
            break;
        //for right
        case "R":
            targetCol = pieceCol + moveDistance;
            break;
        //for forward
        case "F":
            targetRow = pieceRow - moveDistance;
            break;
        //for backward
        case "B":
            targetRow = pieceRow + moveDistance;
            break;
        //for forward left this is only for hero2 
        case "FL":
            targetRow = pieceRow - moveDistance;
            targetCol = pieceCol - moveDistance;
            break;
        //for forward right this is only for hero2
        case "FR":
            targetRow = pieceRow - moveDistance;
            targetCol = pieceCol + moveDistance;
            break;
        //for backward left this is only for hero2
        case "BL":
            targetRow = pieceRow + moveDistance;
            targetCol = pieceCol - moveDistance;
            break;
        //for backward right this is only for hero2
        case "BR":
            targetRow = pieceRow + moveDistance;
            targetCol = pieceCol + moveDistance;
            break;
        default:
            console.log("Invalid direction.");
            return false; //returns invalid direction if all the cases go false
    }

    //check if the target position of row and column is within the bounds of the game board
    if (targetRow < 0 || targetRow >= state.length || targetCol < 0 || targetCol >= state[0].length) {
        console.log("Move out of bounds.");
        return false; //it results that the move is out of bounds
    }

    //check if the target position of the row and column is occupied by the current player's piece
    if (state[targetRow][targetCol] && state[targetRow][targetCol].startsWith(game.currentPlayer)) {
        console.log("Move blocked by own piece.");
        return false; //target position is now occupied by the current players own piece
    }

    //rules for each piece and the piece movement
    switch (piece) {
        //this is for all the pawns as all the pawns have the same rules
        case "P1":
        case "P2":
        case "P3":
            if (Math.abs(targetRow - pieceRow) > 1 || Math.abs(targetCol - pieceCol) > 1) {
                console.log("Invalid move for Pawn.");
                return false;
            }
            break;
        //this is for hero-1
        case "H1":
            if ((direction === "L" || direction === "R") && Math.abs(targetCol - pieceCol) !== 2) {
                console.log("Invalid move for Hero1.");
                return false;
            }
            if ((direction === "F" || direction === "B") && Math.abs(targetRow - pieceRow) !== 2) {
                console.log("Invalid move for Hero1.");
                return false;
            }
            break;
        //this is for hero-2
        case "H2":
            if (Math.abs(targetRow - pieceRow) !== 2 || Math.abs(targetCol - pieceCol) !== 2) {
                console.log("Invalid move for Hero2.");
                return false;
            }
            break;
        default:
            console.log("Invalid piece.");
            return false; //invalid piece
    }

    return true;
}
//moves of the block gets applied
function applyMove(move, game) {
    const [piece, direction] = move.split(":");
    const state = game.state;

    let found = false;
    for (let row = 0; row < state.length; row++) {
        for (let col = 0; col < state[row].length; col++) {
            if (state[row][col] === `${game.currentPlayer}-${piece}`) {
                found = true;
                state[row][col] = null;

                //updates the position of the based on directions
                const moveDistance = piece.startsWith("P") ? 1 : 2;
                switch (direction) {
                    case "L": col = Math.max(col - moveDistance, 0); break;
                    case "R": col = Math.min(col + moveDistance, state[row].length - 1); break;
                    case "F": row = Math.max(row - moveDistance, 0); break;
                    case "B": row = Math.min(row + moveDistance, state.length - 1); break;
                    case "FL": row = Math.max(row - moveDistance, 0); col = Math.max(col - moveDistance, 0); break;
                    case "FR": row = Math.max(row - moveDistance, 0); col = Math.min(col + moveDistance, state[row].length - 1); break;
                    case "BL": row = Math.min(row + moveDistance, state.length - 1); col = Math.max(col - moveDistance, 0); break;
                    case "BR": row = Math.min(row + moveDistance, state.length - 1); col = Math.min(col + moveDistance, state[row].length - 1); break;
                }

                state[row][col] = `${game.currentPlayer}-${piece}`;
                break;
            }
        }
        if (found) break;
    }
}

//this function checks whether any of the player won the game
function checkWinCondition(game) {
    const state = game.state;
    let playerAWon = true;
    let playerBWon = true;

    for (let row = 0; row < state.length; row++) {
        for (let col = 0; col < state[row].length; col++) {
            if (state[row][col] && state[row][col].startsWith("B")) {
                playerAWon = false;
            }
            if (state[row][col] && state[row][col].startsWith("A")) {
                playerBWon = false;
            }
        }
    }

    return playerAWon || playerBWon;
}

function guid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
