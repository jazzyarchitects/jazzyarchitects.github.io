window.onload = init;
/************************************/
/*      Variable Declarations       */
/************************************/

const DEBUG = false;

/* Containers */
let statusContainer,
    canvas;

/* Mathematical Values for gameplay */
let x,
    y,
    dx = 4,
    dy = -4,
    initialDx, 
    ballRadius = 10,
    paddleHeight = 10,
    paddleWidth = 75,
    paddleX,
    score = 0,
    speed = 5,
    paddleSpeed = 5,
    lives = 3;

let brickRowCount = 4,
    brickColumnCount = 5,
    brickWidth = 75,
    brickHeight = 20,
    brickPadding = 10,
    brickOffsetTop = 30,
    brickOffsetLeft = 30;

/* States */
let rightPressed = false,
    leftPressed = false,
    isGameOver = false,
    bricks = [],
    isPaused = true,
    ballDirection = {vertical: 0, horizontal: 0};

let ctx;

/* Styling */
let ballColor = '#f0f';
let brickColor = '#0095DD';
let hexaDecimals = '0123456789abcdef';

/*============================================================================*/

/************************************/
/*      Function Declarations       */
/************************************/

/* Initialize game environment */
function init(){
  canvas = document.querySelector("#myCanvas");
  statusContainer = document.querySelector("#status");
  ctx = canvas.getContext('2d');

  document.addEventListener('mouseup', (e)=>{
    if (document.activeElement != document.body) document.activeElement.blur();
  });
  

  document.addEventListener('keydown', function(e){
    if(e.keyCode === 39){
      rightPressed = true;
    }
    if(e.keyCode === 37){
      leftPressed = true;
    }
  }, false);

  document.addEventListener('keyup', function(e){
    if(e.keyCode === 39){
      rightPressed = false;
    }
    if(e.keyCode === 37){
      leftPressed = false;
    }
    if(e.keyCode === 32){
      isPaused = !isPaused;
      draw();
    }
  }, false);
  start();
}

/* Setup initial position and horizontal, vertical velocities for the ball on respawn*/
function setupPositionSpeed(){
  x = Math.floor(Math.random() * (canvas.width - ballRadius * 2)) + ballRadius;
  y = canvas.height - brickHeight - 30; 
  let s = (-2 +Math.random() * 4)
  dx = 2 + Math.floor(Math.random() * 2);
  dx = s/Math.abs(s) * dx;
  dy = - Math.sqrt(speed*speed - dx*dx);
  initialDx = dx;
  isPaused = true;
}

/* Setting inital values for gameplay parameters */
function start(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setupPositionSpeed();
  brickWidth = (canvas.width - brickPadding * brickColumnCount - 2*brickOffsetLeft)/brickColumnCount;

  for(let c = 0; c < brickColumnCount; c++){
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++){
      bricks[c][r] = {x: 0, y: 0, status: 1};
    }
  }

  lives = 3;
  score = 0;
  speed = 5;
  isGameOver = false;

  paddleX = (canvas.width - paddleWidth) / 2;

  draw();
}

/* To draw the ball on canvas */
function drawBall(){
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

/* To draw the paddle on canvas */
function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

/* Write score on top left */
function drawScore(){
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Score: ${score}`, 8, 20);
}

/* Write remaining lives on top right */
function drawLives(){
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

/* To draw the bricks onto canvas */
function drawBricks(){
  for(let c = 0; c < brickColumnCount; c++){
    for(let r = 0; r < brickRowCount; r++){
      ctx.beginPath();
      let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
      let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;

      bricks[c][r].x = brickX;
      bricks[c][r].y = brickY;
      
      ctx.rect(brickX, brickY, brickWidth, brickHeight);

      if(bricks[c][r].status){
        ctx.fillStyle = brickColor;
        ctx.fill(); 
      }
      if(DEBUG){
        ctx.strokeStyle = '#f00';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.closePath();
    }
  }
}

/* To determine if the ball has collided with a brick */
function collisionDetection(){
  for(let c = 0; c<brickColumnCount; c++){
    for(let r = 0; r<brickRowCount; r++){
      let b = bricks[c][r];

      if(b.status){
        if(y >= b.y - ballRadius && y <= b.y + brickHeight + ballRadius && x > b.x - ballRadius && x < b.x + brickWidth + ballRadius){
          // If ball hits from side, then reverse x-velocity else reverse y-velocity
          if((x > b.x - ballRadius && x < b.x) || (x <= b.x + brickWidth + ballRadius && x >= b.x + brickWidth)){
            dx = -dx;
          }else{
            dy = -dy;
          }
          b.status = 0;
          score ++ ;
          if(score >= brickColumnCount * brickRowCount){
            win();
          }
        return;
        }
      }
    }
  }
}

/* Function to execute when game is over*/
function gameOver(){
  isGameOver = true;
  statusContainer.innerHTML = "GAME OVER";
}

/* Action to execute when the user wins */
function win(){
  isGameOver = true;
  statusContainer.innerHTML = "YOU WIN";
}

/* To generate random colors */
function getRandomColor(){
  let a = [];
  for(let i = 0;i < 6; i++){
    a[i] = hexaDecimals[Math.floor(Math.random() * hexaDecimals.length)];    
  }
  return '#'+a.join('');
}

function roundNumber(num){
  return Math.floor(num * 100) / 100;
}
let speedChangeFactor = 0;
/* Function to debug stats */
function drawDebugStats(){
  ctx.font = '10px Arial';
  ctx.fillStyle = '#000';
  ctx.strokeStyle = '#f00';
  ctx.lineWidth = 1;
  let drawLeft = x + ballRadius;
  if(x > canvas.width - 200){
    drawLeft = x - ballRadius - 80;
  }
  ctx.fillText(JSON.stringify({dx: roundNumber(dx), dy: roundNumber(dy)}), drawLeft, y, 120);
  ctx.fillText(JSON.stringify({x: roundNumber(x), y: roundNumber(y)}), drawLeft, y + 12, 120);

  ctx.fillText(JSON.stringify({paddleX: roundNumber(paddleX)}), paddleX, canvas.height - paddleHeight - 2);

  ctx.fillText(JSON.stringify({speedChangeFactor: roundNumber(speedChangeFactor)}), paddleX, canvas.height - 2);
}

let hitStats = {};
function drawHit(x, dx, xFactor, middle){
  if(x){
    hitStats.x = x;
    hitStats.dx = dx;
    hitStats.xFactor = xFactor;
    hitStats.middle = middle;
  }
  if(!hitStats.x){
    return;
  }
  ctx.font = '10px Arial';
  ctx.fillStyle = '#000';
  ctx.strokeStyle = '#f00';
  ctx.lineWidth = 1;

  ctx.fillText(JSON.stringify({x: roundNumber(hitStats.x), dx: roundNumber(hitStats.dx), xFactor: roundNumber(hitStats.xFactor), middle: roundNumber(hitStats.middle)}), 5, canvas.height - 50);
}


let previousXFactor = 0;
/*Actual drawing function */
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ballDirection.horizontal = dx / Math.abs(dx);
  ballDirection.vertical = dy / Math.abs(dy);

  drawBall();
  drawPaddle();
  if(DEBUG){
    drawDebugStats();
    drawHit();
  }
  drawBricks();
  drawScore();
  drawLives();

  x += dx;
  y += dy;

  if(y - ballRadius + dy < 0){
    dy = -dy;
  }else if(y + dy + ballRadius > canvas.height - paddleHeight){

    if(x > paddleX - ballRadius && x < paddleX + paddleWidth + ballRadius){
      let xFactor = 2 * ((x - (paddleX + paddleWidth/2))/paddleWidth);
      speedChangeFactor = xFactor;

      // console.log({x, paddleX, paddleWidth, dx, xFactor,});
      let sign = dx/Math.abs(dx);
      
      dx = dx + 2 * xFactor - 2 * previousXFactor;

      if(DEBUG) drawHit(x, dx, xFactor, (paddleX + paddleWidth/2));
      
      dx = Math.min(Math.abs(dx), 4.9) * sign ;
      dy = -Math.sqrt(speed*speed - dx*dx);

      previousXFactor = xFactor;
    }else{
      // console.log("Game over");
      lives--;
      if(lives <= 0){
        gameOver();
      }else{
        setupPositionSpeed();
        return draw();
      }
      // clearInterval(frameDrawer);
      // dy = -dy;
    }
    // ballColor = getRandomColor();
  }

  if(x + ballRadius + dx >= canvas.width || x - ballRadius + dx < 0){
    dx = -dx;
    initialDx = dx;
    // ballColor = getRandomColor();
  }

  if(rightPressed){
    if(paddleX + paddleWidth + paddleSpeed < canvas.width){
      paddleX += paddleSpeed;
    }
  }

  if(leftPressed){
    if(paddleX - paddleSpeed > 0){
      paddleX -= paddleSpeed;
    }
  }

  if(y < brickColumnCount * (brickHeight + brickPadding) + ballRadius*2){
    collisionDetection();
  }

  if(!isGameOver && !isPaused){
    if(DEBUG)
      setTimeout(draw, 50);
    else
      requestAnimationFrame(draw);
  }

}

function restart(){
  isGameOver = true;
  setTimeout(start, 100);
  // start();
}

function setEasy(){
  brickColumnCount = 4;
  brickRowCount = 3;
  paddleWidth = 100;
  restart();
}

function setMedium(){
  brickColumnCount = 5;
  brickRowCount = 4;
  paddleWidth = 75;
  restart();
}

function setHard(){
  brickColumnCount = 6;
  brickRowCount = 5;
  paddleWidth = 50;
  restart();
}