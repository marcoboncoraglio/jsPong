//GLOBAL VARIABLES

var playerWidth = 150;
var playerHeight = 25;
var speedupAfterPlayerContact = 1.1;

var keys = {};  //used to detect keyboard input

function Player(x, y){
  this.posX = x;
  this.posY = y;
  this.moveX = function(incVal){
    this.posX += incVal;
  }
  this.speed = 10;
  this.score = 0;

  return this;
}

function Ball(x, y){
  this.posX = x;
  this.posY = y;
  this.startPosX = canvas.width/2;
  this.startPosY = canvas.height/2;
  this.radius = 10;


  this.init = function(){
    this.speedX = Math.floor(Math.random() * 6) - 3;
    this.speedY = (Math.floor(Math.random() * 6) - 3);

    if(this.speedY == 0) {
      this.speedY = 3;
    }

    this.posX = this.startPosX;
    this.posY = this.startPosY;
  }

  return this;
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";

    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var player1= new Player(canvas.width/2 - playerWidth/2 , 50);
var player2= new Player(canvas.width/2 - playerWidth/2, 525);
var ball = new Ball();
var tickSound = new sound("sounds/tick.mp3");
var cheerSound = new sound("sounds/cheering.mp3");
ball.init();

var xAxisDeflection = (ball.posX - player1.posX)*4/playerWidth;

window.addEventListener("keydown", function(event){
  keys[event.keyCode] = true;
});

window.addEventListener("keyup", function(event){
  keys[event.keyCode] = false;
});

function collides(ball, player){
  if(ball.posX + ball.radius > player.posX + playerWidth)
    return false;
  if(ball.posY > player.posY + playerHeight + ball.radius)
    return false;
  if(ball.posX + ball.radius < player.posX)
    return false;
  if(ball.posY + ball.radius < player.posY)
    return false;

  tickSound.play();
  return true;
}

function drawBall(){
  ctx.beginPath();
  ctx.arc(ball.posX,ball.posY,ball.radius,0,2*Math.PI);
  ctx.closePath();
  ctx.fill();
}

function startGame(){

  ctx.fillStyle = "red";
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.clearRect(10,10,canvas.width-20, canvas.height-20);
  ctx.fillStyle = "black";
  ctx.fillRect(player1.posX, player1.posY, playerWidth, playerHeight);
  ctx.fillRect(player2.posX, player2.posY, playerWidth, playerHeight);
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("Ready?",canvas.width/2 - 50,canvas.height/2);

  setTimeout(function () {
        var updateGame = setInterval(update, 1000/80);
    }, 1500);

}

function stopGame(){
    clearInterval(updateGame);
}

function draw(){
  ctx.fillStyle = "red";
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.clearRect(10,10,canvas.width-20, canvas.height-20);
  ctx.fillStyle = "black";
  ctx.fillRect(player1.posX, player1.posY, playerWidth, playerHeight);
  ctx.fillRect(player2.posX, player2.posY, playerWidth, playerHeight);
  ctx.fillStyle = "black";
  drawBall();
  ctx.font = "12px Arial";
  ctx.fillText("Player 1: " + player1.score, 20, 20);
  ctx.fillText("Player 2: " + player2.score, 700, 570);
}

function scored(player){
  cheerSound.play();
    //setTimeout(function(){  //after score pause for a few seconds for the players to be able to recompose?
    //  stopGame();
    //}, 2500);
  ball.init();
  player.score++;
  //startGame();
}


function update(){  //Way too long function

  ball.posX += ball.speedX;
  ball.posY += ball.speedY;

  //ascii values for d, a, left key, right key and spacebar respectively

  if(keys[68]){
    if(player1.posX < 640){
    player1.posX += player1.speed;
    }
  }
  if(keys[65]){
    if(player1.posX > 10){
    player1.posX -= player1.speed;
    }
  }
  if(keys[37]){
    if(player2.posX > 10){
    player2.posX -= player2.speed;
    }
  }
  if(keys[39]){
    if(player2.posX < 640){
    player2.posX += player2.speed;
    }
  }
  if(keys[32]){
    stopGame(); //doesnt work yet
  }



  if(collides(ball, player1)){  //X-Axis Speedup
    if(ball.posX - player1.posX > playerWidth/2){
      ball.speedX += xAxisDeflection;
    }

    if(ball.posX - player1.posX <= playerWidth/2){
      ball.speedX -= xAxisDeflection;
    }

    ball.speedY *= -(speedupAfterPlayerContact);  //Y-Axis Speedup
  }

  if(collides(ball, player2)){  //X-Axis Speedup

    if(ball.posX - player2.posX > playerWidth/2){
      ball.speedX += xAxisDeflection;
    }

    if(ball.posX - player2.posX <= playerWidth/2){
      ball.speedX -= xAxisDeflection;
    }

    ball.speedY *= -(speedupAfterPlayerContact);  //Y-Axis Speedup

  }

  if(ball.posX <= 10 + ball.radius || ball.posX >= 790 - ball.radius){            //ball collides with wall
    ball.speedX *= (-1);
  }

  if(ball.posY > canvas.height){
    scored(player1);
    console.log("player 1 score: " + player1.score);
  }
  if(ball.posY < 0){
    scored(player2);
    console.log("player 2 score: " + player2.score);
  }

  draw();
}

startGame();
