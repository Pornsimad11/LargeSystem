//pong clone
//mouse to control both paddles

var osc = require("node-osc");

var oscClient;
var oscServer;

var otherMouseX = 0;
var otherMouseY = 0;

var ourPortInput;
var theirPortInput;
var theirHostInput;
var startButton;

var paddleA, paddleB, ball, wallTop, wallBottom;
var MAX_SPEED = 7;

var ballPos;
function setup() {

    ourPortInput = createInput();
    theirPortInput = createInput();
    theirHostInput = createInput();
    startButton = createButton("Start");

    startButton.mouseClicked(function() {
        //1. start an osc listener that
        // updates otherMouseX and otherMouseY
        var theirPortNumber = parseInt(theirPortInput.value());
        oscClient = new osc.Client(theirHostInput.value(), theirPortNumber);

        var ourPortNumber = parseInt(ourPortInput.value());
        oscServer = new osc.Server(ourPortNumber, 'localhost');
        oscServer.on("message", function(msg, rinfo) {
            console.log("got some data: ");
            console.log(msg);


            if (msg[0] == "/mouseY") {
                otherMouseY = parseInt(msg[1]);
            }
            if (msg[0] == "/ball") {
                ballPos = parseInt(msg[1]);
            }
           
        });

        console.log(ourPortInput.value());
        console.log(theirPortInput.value());
        console.log(theirHostInput.value());

    });

    createCanvas(600, 600);
    //frameRate(6);

    paddleA = createSprite(30, height / 2, 10, 100);
    paddleA.immovable = true;

    paddleB = createSprite(width - 28, height / 2, 10, 100);
    paddleB.immovable = true;

    wallTop = createSprite(width / 2, -30 / 2, width, 30);
    wallTop.immovable = true;

    wallBottom = createSprite(width / 2, height + 30 / 2, width, 30);
    wallBottom.immovable = true;

    ball = createSprite(width / 2, height / 2, 20, 20);
    ball.maxSpeed = MAX_SPEED;

    paddleA.shapeColor = color(160, 170, 255);
    paddleB.shapeColor = color(160, 255, 170);
    ball.shapeColor = color(160, 255, 255);

    ball.setSpeed(MAX_SPEED, -180);
    ball.draw = function(){
        ellipse(0,0,20,20);
    
    }
}

function draw() {
    background(255,149,918);

    paddleA.position.y = constrain(mouseY, paddleA.height / 2, height - paddleA.height / 2);
    paddleB.position.y = constrain(otherMouseY, paddleA.height / 2, height - paddleA.height / 2);

    ball.bounce(wallTop);
    ball.bounce(wallBottom);

    if (ball.bounce(paddleA)) {
        var swing = (ball.position.y - paddleA.position.y) / 3;
        ball.setSpeed(MAX_SPEED, ball.getDirection() + swing);
    }

    if (ball.bounce(paddleB)) {
        var swing = (ball.position.y - paddleB.position.y) / 3;
        ball.setSpeed(MAX_SPEED, ball.getDirection() - swing);
    }

    if (ball.position.x < 0) {
        ball.position.x = width / 2;
        ball.position.y = height / 2;
        ball.setSpeed(MAX_SPEED, 0);
    }

    if (ball.position.x > width) {
        ball.position.x = width / 2;
        ball.position.y = height / 2;
        ball.setSpeed(MAX_SPEED, 180);
    }



        if (oscClient != undefined) {
        // oscClient.send('/mouseX', mouseX);
        oscClient.send('/mouseY', mouseY);
        oscClient.send('/ball', -ball)

    }

        drawSprites();

}
