import MovingDirection from "./MovingDirection.js";
import Pacman from "./Pacman.js";
import Enemy from "./Enemy.js";

export default class TileMap {
  constructor(tileSize) {
    this.tileSize = tileSize;
    this.yellowDot = new Image();
    this.yellowDot.src = "../images/yellowDot.png";
    this.wall = new Image();
    this.wall.src = "../images/wall.png";
  }

  // 0 - yellow dot
  // 1 - wall
  // 2 - empty tile (black)
  // 3 - pacman
  map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 4, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 4, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
  draw(ctx) {
    //
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[0].length; column++) {
        let tile = this.map[row][column];
        if (tile === 1) {
          this.#drawWall(ctx, column, row);
        } else if (tile == 0) {
          this.#drawYellowDot(ctx, column, row);
        } else if (tile == 2) {
          this.#drawEmptyTile(ctx, column, row);
        }
      }
    }
  }

  #drawWall(ctx, column, row) {
    ctx.drawImage(
      this.wall,
      column * this.tileSize,
      row * this.tileSize,
      this.tileSize,
      this.tileSize
    );
  }

  #drawEmptyTile(ctx, column, row) {
    ctx.fillStyle = "black";
    ctx.fillRect(
      column * this.tileSize,
      row * this.tileSize,
      this.tileSize,
      this.tileSize
    );
  }

  #drawYellowDot(ctx, column, row) {
    ctx.drawImage(
      this.yellowDot,
      column * this.tileSize,
      row * this.tileSize,
      this.tileSize,
      this.tileSize
    );
  }

  setCanvasSize(canvas) {
    canvas.width = this.map[0].length * this.tileSize;
    canvas.height = this.map.length * this.tileSize;
  }

  getPacman(velocity) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        if (this.map[row][column] == 3) {
          this.map[row][column] = 0;
          return new Pacman(
            column * this.tileSize,
            row * this.tileSize,
            this.tileSize,
            velocity,
            this
          );
        }
      }
    }
  }

  getEnemies(velocity) {
    const enemies = [];
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const tile = this.map[row][column];
        if (tile == 4) {
          this.map[row][column] = 0;
          enemies.push(
            new Enemy(
              column * this.tileSize,
              row * this.tileSize,
              this.tileSize,
              velocity,
              this
            )
          );
        }
      }
    }
    return enemies;
  }

  touchingWall(x, y, direction) {
    if (
      Number.isInteger(x / this.tileSize) &&
      Number.isInteger(y / this.tileSize)
    ) {
      let nextColumn = 0;
      let nextRow = 0;
      let nextX = 0;
      let nextY = 0;

      switch (direction) {
        case MovingDirection.up:
          nextY = y - this.tileSize;
          nextX = x;
          break;

        case MovingDirection.down:
          nextY = y + this.tileSize;
          nextX = x;
          break;

        case MovingDirection.left:
          nextX = x - this.tileSize;
          nextY = y;
          break;
        case MovingDirection.right:
          nextX = x + this.tileSize;
          nextY = y;
      }

      nextColumn = nextX / this.tileSize;
      nextRow = nextY / this.tileSize;

      const tile = this.map[nextRow][nextColumn];
      if (tile == 1) {
        return true;
      }
    }
    return false;
  }

  eatPoint(x, y) {
    const row = y / this.tileSize;
    const column = x / this.tileSize;
    if (Number.isInteger(row) && Number.isInteger(column)) {
      if (this.map[row][column] == 0) {
        this.map[row][column] = 2;
        return true;
      }
    }
    return false;
  }
}
