# 21BCE5840_Mandava-Nidhish

## Turn_Based Chess Game
This is a simple web-based game, turn-based chess game where two players can play against each other in real-time using WebSockets. The game allows players to create or join a game session and then take their resoective turns and making moves on the board to win the game.

## Set up instructions

### Setting up the server
1. First we need to install the node.js in our system.
2. Creating a new directory for my project named Hitwicket using the command "mkdir Hitwicket".
3. Next we need to execute the command "npm init -y", this will install the node modules in the repository we have created and package.json file will be generated.
4. Then we need to install "npm install express websocket", this package will create a webserver and handle the websocket connection between client and the server.
5. Now create file name "server.js" in the directory and the code is written in that and the logic is also written in that. This code sets up an HTTP server using server to combine an html file and an websocket server to manage real time communication between the clients.
6. We can run this file using the command 'node server.js' in the terminal.
7. Then the server starts listening on HTTP port 9091 for serving the HTML request and websocket port 9090 for the game communication.

### Setting up the client
1. For the client, first create an file "client.html" in the same position where "server.js" file is created.
2. This HTML code file will serve as the user interface for my game.
3. When start debugging this code the web page is opened where players can create and join game sessions.

### Running the game
1. First open the same link in two tabs because two players are going to play in their individual tabs.
2. To start a new game, first click New Game button in the client interface. Once we press that button then unique Game ID is generated so we can copy and paste in the other tab and press Join Game button.
3. Now both the members can play the game according to their turns.
4. Once both the players have joined, they can start playing the game by entering their moves in the prompt given in the client page.
5. The input move format should be in the format "Piece:Direction". For example 'P1:F' this means pawn-1 moves 1 step forward or 'H2:BL' this means Hero-2 moves 2 steps diagonally backward left and press "Submit" button for submitting the move.
6. The board updates in real time as player make their moves, and in the prompt box where we enter the moves  it displays whose turn it is.
7. Once all the blocks of the player got smashed by the other players block then we get message that 'Player-? won the game and you can start the next (or) new game'.

### Sample photos for the process:

1. Press New Game button for getting the unique Game ID.

![WhatsApp Image 2024-08-27 at 01 35 16_8160c53d](https://github.com/user-attachments/assets/8795ec26-86b3-475f-8531-f796b7604402)

2. Join the game from another tab copy pasting the Game ID which we got in the previous step.

![WhatsApp Image 2024-08-27 at 01 36 21_8343487c](https://github.com/user-attachments/assets/5e475f38-9885-4c95-9f01-cbbb94f5a1c8)

3. Let's split the screen into two tabs to play the game simultaneously.

![WhatsApp Image 2024-08-27 at 01 37 25_4aff6d2a](https://github.com/user-attachments/assets/a60c0c28-4051-4a23-8db7-9c5b9d2b20c5)

4. Now let's start with the pawn move 'P1:B'. The 'A-P1' moves in the below way.

![WhatsApp Image 2024-08-27 at 01 37 54_2a6f1f7a](https://github.com/user-attachments/assets/2d7fef09-94ca-499c-bbb9-24c0dd79f57d)

5. Next let's see Hero-1 move 'H1:F'. The 'B-H1' moves in the below way.

![WhatsApp Image 2024-08-27 at 01 38 37_3e2602c0](https://github.com/user-attachments/assets/0cf9d738-bc23-43b5-879b-69fb48114d8e)

6. Let's see pawn move again 'P1:B'. The 'A-P1' moves in the below way.

![WhatsApp Image 2024-08-27 at 01 39 24_c9149e1e](https://github.com/user-attachments/assets/c9eda262-41c1-4df4-af7b-4f878514bc2f)

7. This is the Hero-2 move 'H2:FR'. The 'B-H2' moves in the below way.

![WhatsApp Image 2024-08-27 at 01 40 19_617683f4](https://github.com/user-attachments/assets/516b32c7-3c7f-4ee7-afe0-73923fc68bd8)

8. Finally the winner one, this comes when any of the player kills other player blocks using theirs and it results that Player-? won the game and you can start the next (or) new game.

![WhatsApp Image 2024-08-27 at 02 01 30_8e453b34](https://github.com/user-attachments/assets/ae1d6015-9110-4fb0-abb1-247ae95262a3)





