import MovingDirection from "./MovingDirection.js";
import PacmanRotation from "./Rotation.js";
import Rotation from "./Rotation.js";

export default class Pacman {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.isMoving = false;
    this.currentMovingDirection = null;
    this.reqestedMovingDirection = null;

    this.animationTimerDeafult = 10;
    this.animationTimerCurrent = null;
    this.pacmanRotation = PacmanRotation.right;

    this.eatPointSound = new Audio("../sounds/waka.wav");

    this.eatSuperPointSound = new Audio("../sounds/power_dot.wav");
    this.timers = [];
    this.superPointActive = false;
    this.superPointLastSeconds = false;

    this.eatEnemySound = new Audio("../sounds/eat_ghost.wav");

    document.addEventListener("keydown", this.#keydown);
    this.#loadImages();
  }

  draw(ctx, pause, enemies) {
    if (!pause) {
      this.#animate();
      this.#move();
    }

    this.#eatPoint();
    this.#eatSuperPoint();
    this.#eatEnemy(enemies);

    const size = this.tileSize / 2;

    ctx.save();
    ctx.translate(this.x + size, this.y + size);
    ctx.rotate((this.pacmanRotation * 90 * Math.PI) / 180);
    ctx.drawImage(
      this.pacmanImages[this.pacmanImageIndex],
      -size,
      -size,
      this.tileSize,
      this.tileSize
    );
    ctx.restore();
  }

  getIsMoving() {
    return this.isMoving;
  }

  #loadImages() {
    const pacmanImage1 = new Image();
    pacmanImage1.src = "../images/pac0.png";

    const pacmanImage2 = new Image();
    pacmanImage2.src = "../images/pac1.png";

    const pacmanImage3 = new Image();
    pacmanImage3.src = "../images/pac2.png";

    this.pacmanImages = [
      pacmanImage1,
      pacmanImage2,
      pacmanImage3,
      pacmanImage2,
    ];
    this.pacmanImageIndex = 0;
  }

  #keydown = (event) => {
    //up = 38
    if (event.keyCode == 38) {
      if (this.currentMovingDirection == MovingDirection.down) {
        this.currentMovingDirection = MovingDirection.up;
      }
      this.reqestedMovingDirection = MovingDirection.up;
      this.isMoving = true;
    }
    //down - 40
    if (event.keyCode == 40) {
      if (this.currentMovingDirection == MovingDirection.up) {
        this.currentMovingDirection = MovingDirection.down;
      }
      this.reqestedMovingDirection = MovingDirection.down;
      this.isMoving = true;
    }
    //left - 37
    if (event.keyCode == 37) {
      if (this.currentMovingDirection == MovingDirection.right) {
        this.currentMovingDirection = MovingDirection.left;
      }
      this.isMoving = true;
      this.reqestedMovingDirection = MovingDirection.left;
    }
    //right - 39
    if (event.keyCode == 39) {
      if (this.currentMovingDirection == MovingDirection.left) {
        this.currentMovingDirection = MovingDirection.right;
      }
      this.isMoving = true;
      this.reqestedMovingDirection = MovingDirection.right;
    }
  };

  #move() {
    if (this.currentMovingDirection !== this.reqestedMovingDirection) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (
          !this.tileMap.touchingWall(
            this.x,
            this.y,
            this.reqestedMovingDirection
          )
        ) {
          this.currentMovingDirection = this.reqestedMovingDirection;
        }
      }
    }

    if (
      this.tileMap.touchingWall(this.x, this.y, this.currentMovingDirection)
    ) {
      return;
    }

    if (
      this.currentMovingDirection != null &&
      this.animationTimerCurrent == null
    ) {
      this.animationTimerCurrent = this.animationTimerDeafult;
    }

    switch (this.currentMovingDirection) {
      case MovingDirection.up:
        this.y -= this.velocity;
        this.pacmanRotation = PacmanRotation.up;
        break;
      case MovingDirection.down:
        this.y += this.velocity;
        this.pacmanRotation = PacmanRotation.down;
        break;
      case MovingDirection.left:
        this.x -= this.velocity;
        this.pacmanRotation = PacmanRotation.left;
        break;
      case MovingDirection.right:
        this.x += this.velocity;
        this.pacmanRotation = PacmanRotation.right;
        break;
    }
  }

  #animate() {
    if (this.animationTimerCurrent == null) {
      return;
    }
    this.animationTimerCurrent--;
    if (this.animationTimerCurrent == 0) {
      this.animationTimerCurrent = this.animationTimerDeafult;
      this.pacmanImageIndex++;
      if (this.pacmanImageIndex == this.pacmanImages.length) {
        this.pacmanImageIndex = 0;
      }
    }
  }

  #eatPoint() {
    if (this.tileMap.eatPoint(this.x, this.y)) {
      this.eatPointSound.play();
    }
  }

  #eatSuperPoint() {
    if (this.tileMap.eatSuperPoint(this.x, this.y)) {
      this.eatSuperPointSound.play();
      this.superPointActive = true;
      this.superPointLastSeconds = false;
      this.timers.forEach((timer) => clearTimeout(timer));
      this.timers = [];

      let superPointTimer = setTimeout(() => {
        this.superPointActive = false;
        this.superPointLastSeconds = false;
      }, 1000 * 6);

      this.timers.push(superPointTimer);

      let superPointLastSecondsTimer = setTimeout(() => {
        this.superPointLastSeconds = true;
      }, 1000 * 3);

      this.timers.push(superPointLastSecondsTimer);
    }
  }

  #eatEnemy(enemies) {
    if (this.superPointActive) {
      const allEatenEnemies = enemies.filter((enemy) =>
        enemy.touchingWith(this)
      );
      allEatenEnemies.forEach((enemy) => {
        enemies.splice(enemies.indexOf(enemy), 1);
        this.eatEnemySound.play();
      });
    }
  }
}
