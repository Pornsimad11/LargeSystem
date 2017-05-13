var app = app || {};

app.main = (function() {
	console.log('Your code starts here!');

	var socket;
	var col = { 
		r:255,
		g:0,
		b:0
	};
 
	var sketch = function(p) {

		p.setup = function() {
			p.createCanvas(p.windowWidth, p.windowHeight);
			p.background(255);
			socket = io.connect();
			col.r=Math.random()*255;
			col.g=Math.random()*255;
			col.b=Math.random()*255;
			console.log(col.r,col.g,col.b)
			socket.on('mouse',
			// Receive data
				function(data) {
				  console.log("Got: " + data.x + " " + data.y);
				  // Draw a circle in random color
			
				  p.fill(data.color.r,data.color.g,data.color.b);
				  p.noStroke();
				  p.ellipse(data.x,data.y,10,10);
				  console.log("color set to: " + col)
				}
			);
		};

		p.draw = function() {
			
		    // Nothing
		};

		p.mouseDragged = function() {
		
			p.fill(col.r,col.g,col.b);
			p.noStroke();
			p.ellipse(p.mouseX,p.mouseY,10,10);

			// console.log("sendmouse: " + p.mouseX + " " + p.mouseY);

			// Store the mouse coordinates
			var data = {
				x: p.mouseX,
				y: p.mouseY,
				color:col
			};

			// And send that object to the socket
			socket.emit('mouse',data);
		};

	};

	var init = function(){
		console.log('Initializing app.');

	
		var myp5 = new p5(sketch);

	};

	return {
		init: init
	};

})();

window.addEventListener('DOMContentLoaded', app.main.init);