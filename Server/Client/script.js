var canvas = document.getElementById("main");
var ctx = canvas.getContext('2d');

var iw = window.innerWidth;
var ih = window.innerHeight;
canvas.setAttribute("width", iw);
canvas.setAttribute("height", ih);

var socket = io.connect("/");

var myGamePiece;

var myId = 0;
var tempId = 0;
var sizeScale = 500;
var moveSpeed = 10;
var playersC = [];
var dotsC;


function startGame() {
    
    myGamePiece = {
        myId : tempId,
        xPos : 100,
        yPos : 100,
        xSize : 100,
        ySize : 100
    };

    setInterval(function(){
    
        ctx.clearRect(0,0,iw,ih);    
        
        draw(myGamePiece.xPos, myGamePiece.yPos, myGamePiece.xSize, myGamePiece.ySize);
        for (var i = 0; i < playersC.length; i++) {
            if(playersC[i] != null){
                draw(playersC[i].xPos, playersC[i].yPos, playersC[i].xSize, playersC[i].ySize);    
            }
        }
        if(dotsC != null)
        {
            drawEgg(dotsC.x, dotsC.y, 30, 45);
        }
       
        
        document.getElementById('p1').innerHTML = "";
    
        socket.emit("myGamePiece", myGamePiece);
    },20);
    
}

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        myGamePiece.xPos -= moveSpeed;
    }
    else if(event.keyCode == 39) {
        myGamePiece.xPos += moveSpeed;
    }
    
    if(event.keyCode == 38) {
        myGamePiece.yPos -= moveSpeed;
    }
    else if(event.keyCode == 40) {
        myGamePiece.yPos += moveSpeed;
    }
});

socket.on("id", function(id) {
    myGamePiece.myId = id;
});

socket.on('players', function(players) {
    //console.log(servPlayers)
    //console.log(players);
    playersC = players;
});

socket.on('dots', function(dots){
    dotsC = dots;
})

function draw(x, y, xsize, ysize) {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(x, y, xsize, ysize);
}

function drawEgg(x, y, xsize, ysize)
{
    var color;
    switch(Math.floor((Math.random() * 5) + 1))
    {
        case 1:
        color = "#FF0000"
            break;
        case 2:
        color = "#1ac6ff"
            break;
        case 3:
        color = "#ffff00"
            break;
        case 4: 
        color = "#ff33cc"
            break;
        case 5:
        color = "#66ff66"
            break;
        default:
        color = "#bf8040"
            break;
    }
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.ellipse(x, y, xsize, ysize, 0, 0, 2 * Math.PI);
    ctx.stroke();
}