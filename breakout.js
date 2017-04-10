

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

/* set canvas width */
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

/* define ball size and movement*/
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;

/* define paddle parameters*/
var paddleHeight = 10;
var paddleWidth = 75;
var paddleOffsetY = 10;
var paddleX = (canvas.width-paddleWidth)/2;

/* define brick parameters*/
var brickRowCount = 3;
var brickColumnCount = 5;
var brickPadding = 10;
var brickOffsetY = 30;
var brickOffsetX = 30;
var brickWidth = (canvas.width-(brickOffsetX*2)
	-(brickPadding*(brickColumnCount-1)))/brickColumnCount;
var brickHeight = ((canvas.height*0.4)-(brickOffsetY)
	-(brickPadding*(brickRowCount-1)))/brickRowCount;
/* add bricks to array */
var bricks = [];
for(c=0; c<brickColumnCount; c++) {
	bricks[c] = [];
	for(r=0; r<brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: 1}
	}
}

/* score and lives */
var score = 0;
var lives = 3;

/* define and initialize button press variables */
var rightPressed = false;
var leftPressed = false;

/* add event listeners*/
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

/* move the paddle with the mouse */
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
} 

/* detect if right or lect keys are pressed */
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

/* detect if right or lect keys are released */
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

/* detect if the ball is colliding with the bricks*/
function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(x > b.x && 
            	x < b.x+brickWidth && 
            	y > b.y && 
            	y < b.y+brickHeight &&
            	b.status == 1) {
                	dy = -dy;
                	b.status = 0;
                	score++;
                	if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
            	}
        }
    }
}

/* draw the score */
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

/* draw the number of lives */
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

/* draw the bricks */
function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
        	if(bricks[c][r].status == 1) {
        		var brickX = (c*(brickWidth+brickPadding)+brickOffsetX);
			var brickY = (r*(brickHeight+brickPadding)+brickOffsetY);
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        	}
        }
    }
}


/* draw the ball */
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

/* draw the paddle */
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight - paddleOffsetY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    /* detect if the ball is hitting the walls or paddle, 
    change direction if necessary*/
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    	dx = -dx;
	}
	if(y + dy < ballRadius || 
		(y + dy > canvas.height - paddleOffsetY - ballRadius && 
			x > paddleX && 
			x < paddleX + paddleWidth)) {
	    dy = -dy;
	} else if (y + dy > canvas.height - ballRadius) {
		lives--;
		if(lives == 0) {
			alert("GAME OVER");
			document.loaction.reload()
		}
		else {
			x = canvas.width/2;
			y = canvas.height-30;
			dx = 2;
			dy = -2;
			paddleX = (canvas.width-paddleWidth)/2;
		}
	}

	/* detect if the left / right keys are held, move paddle if necessary */
	if(rightPressed && paddleX < canvas.width-paddleWidth) {
    	paddleX += 7;
	}
	else if(leftPressed && paddleX > 0) {
	    paddleX -= 7;
	}

	x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();
