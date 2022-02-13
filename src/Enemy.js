import MovingDirection from "./MovingDirection.js";
import TileMap from "./TileMap.js";

export default class Enemy {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;
    this.movingDirection = Math.floor(
      Math.random() * Object.keys(MovingDirection).length
    );
    this.directionTimeDefault = this.#random(1, 15);
    this.directionTimer = this.directionTimeDefault;
    this.superPointTimerDefault = 10;
    this.superPointTimer = this.superPointTimerDefault;
    this.#loadImages();
  }

  draw(ctx, pause, pacman) {
    if (!pause) {
      this.#changeDirection();
      this.#move();
    }
    if (pacman.superPointActive) {
      this.#changeToSuperPoint(pacman);
    } else {
      this.image = this.normalEnemy;
    }
    ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
  }

  touchingWith(pacman) {
    if (
      this.x < pacman.x + this.tileSize / 2 &&
      this.x + this.tileSize / 2 > pacman.x &&
      this.y < pacman.y + this.tileSize / 2 &&
      this.y + this.tileSize / 2 > pacman.y
    ) {
      return true;
    } else {
      return false;
    }
  }

  #changeToSuperPoint(pacman) {
    if (pacman.superPointLastSeconds) {
      this.superPointTimer--;
      if (this.superPointTimer == 0) {
        this.superPointTimer = this.superPointTimerDefault;
        if (this.image == this.scaredEnemy) {
          this.image = this.scaredEnemy2;
        } else {
          this.image = this.scaredEnemy;
        }
      }
    } else {
      this.image = this.scaredEnemy;
    }
  }

  #changeDirection() {
    this.directionTimer--;
    let newDirection = null;
    if (this.directionTimer == 0) {
      this.directionTimer = this.directionTimeDefault;
      newDirection = Math.floor(
        Math.random() * Object.keys(MovingDirection).length
      );
    }
    if (newDirection != this.movingDirection && newDirection != null) {
      if (
        Number.isInteger(this.y / this.tileSize) &&
        Number.isInteger(this.x / this.tileSize)
      ) {
        if (!this.tileMap.touchingWall(this.x, this.y, newDirection)) {
          this.movingDirection = newDirection;
        }
      }
    }
  }

  #move() {
    if (!this.tileMap.touchingWall(this.x, this.y, this.movingDirection)) {
      switch (this.movingDirection) {
        case MovingDirection.up:
          this.y -= this.velocity;
          break;
        case MovingDirection.down:
          this.y += this.velocity;
          break;
        case MovingDirection.left:
          this.x -= this.velocity;
          break;
        case MovingDirection.right:
          this.x += this.velocity;
          break;
      }
    }
  }

  #random(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  #loadImages() {
    this.normalEnemy = new Image();
    this.normalEnemy.src = "../images/ghost.png";

    this.scaredEnemy = new Image();
    this.scaredEnemy.src = "../images/scaredGhost.png";

    this.scaredEnemy2 = new Image();
    this.scaredEnemy2.src = "../images/scaredGhost2.png";

    this.image = this.normalEnemy;
  }
}
