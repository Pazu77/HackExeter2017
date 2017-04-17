var fs = require ('fs');
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var players = [];
var id = 0;
var dots;

app.use(express.static('Client'))
setInterval(function() {
 		dots = {
 			x : Math.floor((Math.random() * 1200) + 1),
 			y : Math.floor((Math.random() * 800) + 1)
 		};
}, 5000);

io.on('connection', function(socket)
{
  	console.log('A user connected');
  	socket.emit('id', id);
  	++id;

  	socket.on('myGamePiece', function(myGamePiece)
  	{
  		players[myGamePiece.myId] = myGamePiece;
  		//console.log(players)

  	})

  	socket.on('disconnect', function() 
  	{
    	console.log('A user disconnected');
 	});

 	setInterval(function() {
 		socket.emit('players', players);
 		socket.emit('dots', dots);
 	}, 20);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});