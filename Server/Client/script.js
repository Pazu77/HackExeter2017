/* ----------------------------------------------------------
 * HackExeter Project
 * Name: Egg Hunt Client Side
 * ----------------------------------------------------------
 * Changelog:
 * 4/15/2017 = Initial creation of project
 * ES - 4/17/2017 = Fixes, comments, and collision added
 * ----------------------------------------------------------
 * Bugs:
 * drawEgg not coloring in
 * ----------------------------------------------------------
 * Planned Features: 
 * • Better game mechanics
 * • Make it look nicer
 * • Integrate leaderboard
 * • Change collision so smoother and makes more sense
 * ----------------------------------------------------------
 * Notes: 
 * ----------------------------------------------------------
 */

// Mass Variables
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

// Game Loop
function startGame() {
    // Stores player's info and sents to server
    myGamePiece = {
        myId : tempId, // Gives it an ID just in case
        xPos : 100,
        yPos : 100,
        xSize : 100,
        ySize : 100,
        points: 0
    };

    // Creates objects on screen
    setInterval(function() {
        ctx.clearRect(0,0,iw,ih); // Clears unused off from screen to prevent trailing/phantom
        draw(myGamePiece.xPos, myGamePiece.yPos, myGamePiece.xSize, myGamePiece.ySize); // Draws the player's gamepiece
        for (var i = 0; i < playersC.length; i++) {
            if(playersC[i] != null) { // Ignores if the index
                draw(playersC[i].xPos, playersC[i].yPos, playersC[i].xSize, playersC[i].ySize); // Draws game pieces     
            }
        }
        if(dotsC != null) // Make sure it doesn't crash on server startup due to no dot not created yet
        {
            drawEgg(dotsC.x, dotsC.y, 10, 15); // Draws the egg at the given location of the dot
            checkCollision(myGamePiece.xPos, myGamePiece.yPos, myGamePiece.xSize, myGamePiece.ySize, dotsC.x, dotsC.y);
            document.getElementById('points').innerHTML = "Points: " + myGamePiece.points;
        }
        socket.emit("myGamePiece", myGamePiece); // Sends the player info to the server
    },5); // Game tick
    
}

// Player Control
document.addEventListener('keydown', function(event) {
    if([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) { // Prevents from scrolling
        event.preventDefault();
    }
    if(event.keyCode == 37) { // Down
        myGamePiece.xPos -= moveSpeed;
    }
    else if(event.keyCode == 39) { // Up
        myGamePiece.xPos += moveSpeed;
    }
    if(event.keyCode == 38) { // Left
        myGamePiece.yPos -= moveSpeed;
    }
    else if(event.keyCode == 40) { // Right
        myGamePiece.yPos += moveSpeed;
    }
});

// Info from server
socket.on("id", function(id) {
    myGamePiece.myId = id; // Grabs ID generated from server
});
socket.on('players', function(players) {
    playersC = players; // Grabs info of other players
});
socket.on('dots', function(dots) {
    dotsC = dots; // Gives location of the egg
})
socket.on('points', function(pointsS) {
    myGamePiece.points = pointsS; // Recieves info back from server adding points
})

// Draws red rectangle based of given dimension
function draw(x, y, xsize, ysize) {
    ctx.fillStyle = "#FF0000"; // Red
    ctx.fillRect(x, y, xsize, ysize);
}

// Draws randomly colored ellipse
function drawEgg(x, y, xsize, ysize) {
    var color;
    // Chooses random color
    switch(Math.floor((Math.random() * 5) + 1)) 
    {
        case 1:
        color = "#FF0000" // Red
            break;
        case 2:
        color = "#1ac6ff" // Light blue
            break;
        case 3:
        color = "#ffff00" // Yellow
            break;
        case 4: 
        color = "#ff33cc" // Pinkish
            break;
        case 5:
        color = "#66ff66" // Light green
            break;
        default:
        color = "#bf8040" // Default gray
            break;
    }
    ctx.beginPath();
    ctx.fillStyle = color; // Doesnt work
    ctx.ellipse(x, y, xsize, ysize, 0, 0, 2 * Math.PI); // Draws egg
    ctx.stroke();
}

// Checks for collision between box and egg top left corner
function checkCollision(pX, pY, pXSize, pYSize, eX, eY) {
    if((pX + pXSize > eX && pX < eX) && // Checks collision in X-dir
       (pY + pYSize > eY && pY < eY)) { // Checks in Y-dir
        socket.emit('resetEgg', myGamePiece); // Request to server to reset egg position
    }
}