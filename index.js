var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile('C:/Users/Grainne/Documents/serverex' + '/index.html');
});

io.on('connection', function(socket){
    console.log('user connected');
  socket.on('chat message', function(msg){
      console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

function upMove() {
    var elem = document.getElementById("p1");
    var id = setInterval(frame, 1);
    function frame() {
        elem.style.top -= 10 + 'px';
    }
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});