/* ----------------------------------------------------------
 * HackExeter Project
 * Name: Egg Hunt Server Side
 * ----------------------------------------------------------
 * Changelog:
 * 4/15/2017 = Initial creation of project
 * ES - 4/17/2017 = Fixes, comments, and collision added
 * ----------------------------------------------------------
 * Bugs:
 * ----------------------------------------------------------
 * Planned Features: 
 * • Better game mechanics
 * • Make it look nicer
 * • Work on leaderboard
 * • Wipe user data when they disconnect
 * ----------------------------------------------------------
 * Notes: 
 * ----------------------------------------------------------
 */

// Initialization
var fs = require ('fs');
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Mass Variables
var players = [];
var id = 0;
var dots;

// Grabs files from client
app.use(express.static('Client'))

// Sets new dot location every 5 seconds
setInterval(function() {
    dots = {
      x : Math.floor((Math.random() * 1200) + 150),
      y : Math.floor((Math.random() * 800) + 150)
    };
}, 5000);

// Activates when server recieves connection from new user
io.on('connection', function(socket)
{
    console.log('A user connected');
    
    socket.emit('id', id); // Gives ID to user
    ++id; // Generates new ID for next user

    // When user disconnects/logs off/closes
    socket.on('disconnect', function() 
    {
      console.log('A user disconnected');
    });

    // Updates 'players' array when user sends update
    socket.on('myGamePiece', function(myGamePiece)
    {
      players[myGamePiece.myId] = myGamePiece;
    });

    // When user collides, give new egg location and give the user a point
    socket.on('resetEgg', function(myGamePiece)
    {
      players[myGamePiece.myId].points++;
      //console.log(players[myGamePiece.myId].points);
      socket.emit('points', players[myGamePiece.myId].points);
      dots = {
        x : Math.floor((Math.random() * 800) + 150),
        y : Math.floor((Math.random() * 600) + 150)
      };
      //requestLead();
    });
    
    // Server sending info loop
    setInterval(function() {
      socket.emit('players', players);
      socket.emit('dots', dots);
    }, 20);
});

// Creating server on localhost:3000 and recieving info from there
http.listen(3000, function() {
  console.log('listening on localhost:3000');
});

/*function requestLead() {
  socket.emit('leader', leaderboard)
}*/