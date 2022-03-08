const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 8080;

const io = require("socket.io")(server, {
   cors: {
     origin: "http://localhost:3000",
     methods: ["GET", "POST"]
   }
 });


app.use(express.static(path.join(__dirname, '../../build')));

app.get('/', (req, res) => { 
   res.status(200).send('Server listening')
});

//app.get('/', (req, res) => res.sendFile(__dirname + '../../public/index.html'));

server.listen(port, () => {
   console.log('Listening on port '+port);
});

function getRandomGameCode() {
   const code = Math.random().toString(36).slice(2);
   if(code in games) {
      return getRandomGameCode(); 
   }

   return code; 
}

function validUsername(name) {
   const specialChars = /[` !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
   return name.length > 0
       && !specialChars.test(name);
}

const games = {}; 

io.on('connection', (socket) => {
   console.log("player connected");
   var player = "";
   var gameID = ""; 

   socket.on("joinGame", (data) => { 
      gameID = data.gameID; 
      player = data.player; 

      if(gameID in games) {
         if(games[gameID].players.includes(player)) {
            socket.emit("error", "Username already taken");
         } else if(validUsername(player)) {
            socket.join(gameID);
            games[gameID].players.push(player); 
            socket.emit("join", {
               player: player, 
               gid: gameID, 
               players: games[gameID].players, 
               editions: games[gameID].editions,
            });
            socket.to(gameID).emit("addPlayer", player); 
            console.log(`${player} joined game ${gameID}`);
         } else {
            socket.emit("error", "Username cannot contain special characters");
         }
      } else { 
         socket.emit("error", "Game does not exist");
      }
   })

   socket.on("createGame", (data) => { 
      gameID = getRandomGameCode(); 
      player = data.player; 

      if(validUsername(player)) {
         games[gameID] = {
            players: [player],
            editions: data.editions
         }

         socket.join(gameID);
         socket.emit("join", {
            player: player, 
            gid: gameID, 
            players: games[gameID].players,
            editions: games[gameID].editions, 
         });
         console.log(`${player} created game ${gameID} with ${data.editions}`);
      } else {
         socket.emit("error", "Username cannot contain special characters")
      }      
   })

   socket.on("endTurn", () => {
      io.to(gameID).emit("endTurn");
   })

   socket.on("startGame", (data) => {   
      console.log(`Game ${gameID}  started`);
      io.to(gameID).emit("startGame", data); 
   })


   socket.on("moveCard", (card, src, dest) => {
      io.to(gameID).emit("moveCard", card, src, dest);
   })

   socket.on("dragCard", (card, src, dest) => {
      socket.to(gameID).emit("moveCard", card, src, dest); 
   })

   socket.on("leaveRoom", () => {
      socket.leave(gameID); 
      if(gameID in games && games[gameID].players.length == 0) {
         delete games[gameID]; 
      }

      console.log(`${player} left room`);
   })

   socket.on('disconnect', () => {
      if(gameID in games) {
         games[gameID].players.filter(name => name != player); 
         io.to(gameID).emit("removePlayer", player);
         if(games[gameID].player && games[gameID].players.length == 0) {
            delete games[gameID]; 
         } 
      }
      console.log(`${player} disconnected`);

   });
});



