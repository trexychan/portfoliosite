const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

var frameNumber = 0;

const ballRadius = 15;

var playerHeight = 20;
var playerWidth = 20;
var playerX = (canvas.width - playerWidth) / 2;
var playerY = (canvas.height - playerHeight) / 2;
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
const playerSpeed = 7;
var burdenLevel = 0;

var pickupX = canvas.width / 2;
var pickupY = canvas.width / 2;
const radDX = 0.1;
var direction = true;
var pickupRadius = 15;
var pickupColor = "#efab19";
var ballCount = 1;

var balls = [];

var score = 0;
var oldScore = 0;
var dframe = 0;
var fade = 0;

let music = new Audio('assets/GameOver.mp3');
music.autoplay = true;
music.play();

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function drawPlayer() {
    ctx.beginPath();
    ctx.rect(playerX, playerY, playerWidth, playerHeight);
    ctx.fillStyle = "#f28282";
    ctx.fill();
    ctx.closePath();
}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    } else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = true;
    } else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    } else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    } else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = false;
    }
}

function addNewBalls() {
    if (balls.length == 0) {
        balls.push({x: Math.floor((Math.random() * canvas.width) + 1), y: Math.floor((Math.random() * canvas.height) + 1), ballDX: Math.random() > 0.5 ? 2 : -2, ballDY: Math.random() > 0.5 ? 2 : -2});
    } else {
        ballCount++;
        for(var c = balls.length; c < ballCount; c++) {
            var x = Math.min(Math.max(canvas.width * Math.random(), ballRadius), canvas.width - ballRadius);
            var y = Math.min(Math.max(canvas.height * Math.random(), ballRadius), canvas.height - ballRadius);
            while(x + ballRadius > playerX && x - ballRadius < playerX + playerWidth && y + ballRadius > playerY && y - ballRadius < playerY + playerHeight) {
                x = Math.min(Math.max(canvas.width * Math.random(), ballRadius), canvas.width - ballRadius);
                y = Math.min(Math.max(canvas.height * Math.random(), ballRadius), canvas.height - ballRadius);
            }
            balls.push({x: Math.floor((Math.random() * canvas.width) + 1), y: Math.floor((Math.random() * canvas.height) + 1), ballDX: Math.random() > 0.5 ? 2 : -2, ballDY: Math.random() > 0.5 ? 2 : -2});
        }
    }

}
//draws a bouncing ball
function drawBalls() {
    for(var i = 0; i < balls.length; i++) {
        ctx.beginPath();
        //draws a circle
        ctx.arc(balls[i].x, balls[i].y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "#ff0b9f";
        //fills the circle
        ctx.fill();
        ctx.closePath();
    }
}


function draw() {
    //clears the canvas so we can draw a new frame
    dframe++;
    frameNumber++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBalls();
    drawPlayer();
    drawPickup(pickupColor);
    drawScore();

    if(pickupX + pickupRadius > playerX && pickupX - pickupRadius < (playerX + playerWidth) && pickupY + pickupRadius > playerY && pickupY - pickupRadius < (playerY + playerHeight)) {
        pickup();
    }
    for(var c = 0; c < balls.length; c++) {
        if(balls[c].x + balls[c].ballDX > canvas.width - ballRadius || balls[c].x + balls[c].ballDX < ballRadius) {
            balls[c].ballDX = -balls[c].ballDX;
        }
        if(balls[c].y + balls[c].ballDY > canvas.height - ballRadius || balls[c].y + balls[c].ballDY < ballRadius) {
            balls[c].ballDY = -balls[c].ballDY;
        } else if(balls[c].x + ballRadius > playerX && balls[c].x - ballRadius < playerX + playerWidth && balls[c].y +ballRadius > playerY && balls[c].y - ballRadius < playerY + playerHeight) {
            gameOver();
        }
    }

    if(rightPressed) {
        playerX += (playerSpeed - (burdenLevel));
        if (playerX + playerWidth > canvas.width){
            playerX = canvas.width - playerWidth;
        }
    }
    if(leftPressed) {
        playerX -= (playerSpeed - (burdenLevel));
        if (playerX < 0){
            playerX = 0;
        }
    }
    if(upPressed) {
        playerY -= (playerSpeed - (burdenLevel));
        if (playerY < 0) {
            playerY = 0;
        }
    }
    if(downPressed) {
        playerY += (playerSpeed - (burdenLevel));
        if (playerY + playerHeight > canvas.height){
            playerY = canvas.height - playerHeight;
        }
    }

    for(var i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].ballDX;
        balls[i].y += balls[i].ballDY;
    }
    //ballX += ballDX;
    //ballY += ballDY;
}

function gameOver() {
    let audio = new Audio('assets/death.mp3');
    audio.play().then(r => {
        alert("GAME OVER \n Your final score is: " + score);
        clearInterval(interval); // Needed for Chrome to end game
        window.location.href = "GameOver.html";
        //document.location.reload();
    });

    window.location.href = "GameOver.html";
}

function drawPickup(color) {
    ctx.beginPath();
    ctx.arc(pickupX, pickupY, calculateRadius(), 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();

    if(fade > 0) {
        ctx.fillStyle="#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText("+" + (score-oldScore), playerX + (playerWidth/2), playerY - 16);
        fade--;
    }
}

function calculateRadius() {
    if (frameNumber % 50 === 0) {
        if (direction) {
            direction = false;
        } else {
            direction = true;
        }
    }

    if(direction) {
        pickupRadius += radDX;
    } else {
        pickupRadius -= radDX;
    }
    return pickupRadius;
}

function drawScore() {
    ctx.font = "1em consolas";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 16, 32);
    ctx.textAlign = "right";
    ctx.fillText("Burden: " + burdenLevel, canvas.width - 16, 32);
}

function pickup() {
    oldScore = score;

    burdenLevel += 1;
    pickupY = Math.min(Math.max(canvas.height * Math.random(), pickupRadius), canvas.height - pickupRadius);
    pickupX = Math.min(Math.max(canvas.width * Math.random(), pickupRadius), canvas.width - pickupRadius);
    if(burdenLevel === 4) {
        pickupColor = "#FFFFFF";
    } else {
        pickupColor = "#efab19";
    }

    if(burdenLevel === 5) {
        fade = 45;
        let audio = new Audio('assets/blop.mp3');
        audio.play();
        addNewBalls();
        score += Math.ceil((10 * burdenLevel) - dframe/60);
        dframe = 0;
        burdenLevel = 0;
    } else {
        let audio = new Audio('assets/blip.mp3');
        audio.play();
    }
}

var interval = setInterval(draw, 10);
