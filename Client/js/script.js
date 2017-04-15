window.onload = function() {
    
	var canvas = document.getElementById("main");
	var ctx = canvas.getContext("2d");

	var iw = window.innerWidth;
	var ih = window.innerHeight;

	canvas.setAttribute("width",iw);
	canvas.setAttribute("height",ih);
    
    running = true;
    
    var size = 50;

    toggleRunning = function() {
        if(!running) {
            running = true;
            document.getElementById("toggle").innerHTML = "Stop";
        }
        else {
            running = false;
            document.getElementById("toggle").innerHTML = "Start";
        }
    }
    
    step = function() {
        
    }
    
    draw(x,y) {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(size*x,size*y,size,size);
    }
    
    setInterval(function(){
        
		iw = window.innerWidth;
		ih = window.innerHeight;

		canvas.setAttribute("width",iw);
		canvas.setAttribute("height",ih);
        
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(size*1,size*1,size,size);
        draw(5, 5);
        
        if(running) {
            step();
        }
                
     },1);

    
}