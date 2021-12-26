export default class TileMap {
  constructor(tileSize) {
    this.tileSize = tileSize;
    this.yellowDot = new Image();
    this.yellowDot.src = "../images/yellowDot.png";
    this.wall = new Image();
    this.wall.src = "../images/wall.png";
  }
  map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
  draw(ctx) {
    console.log("draw");

    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[0].length; column++) {
        let tile = this.map[row][column];
        if (tile === 1) {
          this.#drawWall(ctx, column, row);
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

  setCanvasSize(canvas) {
    canvas.width = this.map[0].length * this.tileSize;
    canvas.height = this.map.length * this.tileSize;
  }
}
