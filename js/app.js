//GLOBAL VARIABLES

var playerWidth = 150;
var playerHeight = 25;
var speedupAfterPlayerContact = 1.14;

var keys = {};  //used to detect keyboard input

function Player(x, y){
  this.posX = x;
  this.posY = y;
  this.moveX = function(incVal){
    this.posX += incVal;
  }
  this.speed = 10;

  return this;
}

function Ball(x, y){
  this.posX = x;
  this.posY = y;
  this.speedX = 2;
  this.speedY = 4;
  this.maxSpeed = 6;
  this.radius = 10;

  return this;
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var player1= new Player(canvas.width/2 - playerWidth/2 , 50);
var player2= new Player(canvas.width/2 - playerWidth/2, 525);
var ball = new Ball(canvas.width/2, canvas.height/2);

var xAxisDeflection = (ball.posX - player1.posX)*5/playerWidth;

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

  return true;
}


function draw(){
  ctx.fillStyle = "red";
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.clearRect(10,10,canvas.width-20, canvas.height-20);
  ctx.fillStyle = "black";
  ctx.fillRect(player1.posX, player1.posY, playerWidth, playerHeight);
  ctx.fillRect(player2.posX, player2.posY, playerWidth, playerHeight);
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(ball.posX,ball.posY,ball.radius,0,2*Math.PI);
  ctx.closePath();
  ctx.fill();
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
  if(keys[32]){  //when spacebar is pressed reset the ball
    ball = new Ball(canvas.width/2, canvas.height/2);
  }

  if(collides(ball, player1)){
    if(ball.posX - player1.posX > playerWidth/2){
      if(ball.speedX <= Ball.maxSpeed){
      ball.speedX += xAxisDeflection;
    }
    }

    if(ball.posX - player1.posX <= playerWidth/2){
      if(ball.speedX <= Ball.maxSpeed){
      ball.speedX -= xAxisDeflection;
    }
    }

    //Speed Up

    if(ball.speedY <= Ball.maxSpeed){
      ball.speedY *= -(speedupAfterPlayerContact);
    }
    else{
      ball.speedY *= (-1);
    }
  }

  if(collides(ball, player2)){

    if(ball.posX - player2.posX > playerWidth/2){
      if(ball.speedX <= Ball.maxSpeed){
      ball.speedX += xAxisDeflection;
    }
    }

    if(ball.posX - player2.posX <= playerWidth/2){
      if(ball.speedX <= Ball.maxSpeed){
      ball.speedX -= xAxisDeflection;
    }
    }

    if(ball.speedY <= Ball.maxSpeed){
      ball.speedY *= -(speedupAfterPlayerContact);
    }
    else{
      ball.speedY *= (-1);
    }
  }

  if(ball.posX <= 10 + ball.radius || ball.posX >= 790 - ball.radius){            //ball collides with wall
    ball.speedX *= (-1);
  }

  draw();
}


setInterval(update, 1000/80);
