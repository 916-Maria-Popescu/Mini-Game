import TileMap from "./TileMap.js";
const tileSize = 32;
const velocity = 2;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileMap = new TileMap(tileSize);
const pacman = tileMap.getPacman(velocity);
const enemies = tileMap.getEnemies(velocity);

const gameOverSound = new Audio("../sounds/gameOver.wav");
const gameWinSound = new Audio("../sounds/gameWin.wav");
let gameOver = false;
let gameWin = false;

function gameLoop() {
  //
  tileMap.draw(ctx);
  drawGameEnd();
  pacman.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
  checkGameOver();
  checkGameWin();
}

function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();
    if (gameOver) {
      gameOverSound.play();
    }
  }
}

function checkGameWin() {
  if (!gameWin) {
    gameWin = isGameWin();
    if (gameWin) {
      gameWinSound.play();
    }
  }
}

function isGameOver() {
  return enemies.some(
    (enemy) => !pacman.superPointActive && enemy.touchingWith(pacman)
  );
}

function isGameWin() {
  return tileMap.didWin();
}

function pause() {
  return !pacman.getIsMoving() || gameOver || gameWin;
}

function drawGameEnd() {
  if (gameWin || gameOver) {
    let text = " You Win";
    if (gameOver) {
      text = "Game Over";
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height / 3.2, canvas.width, 80);
    ctx.font = "80px comic sans";
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");

    ctx.fillStyle = gradient;
    ctx.fillText(text, 10, canvas.height / 2);
  }
}

tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 1000 / 70);
