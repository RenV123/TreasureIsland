import { Grass } from './GameObjects/grass.js';
import { getRandomNr } from './Helpers/helperlib.js';
import { Wall } from './GameObjects/wall.js';
import { Treasure } from './GameObjects/treasure.js';

export class GameBoard {
  _tiles = [];
  _grassTiles = [];
  _treasureTiles = [];
  _wallTiles = [];
  constructor(
    canvasWidth,
    canvasHeight,
    rows = 15,
    columns = 15,
    treasureCount = 3,
    wallCount = 10
  ) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this._rows = rows;
    this._columns = columns;
    this._treasureCount = treasureCount;
    this._wallCount = wallCount;

    this._generateTiles();
  }

  get tiles() {
    return this._tiles;
  }

  /**
   * Generates tiles of the board.
   * @private
   */
  _generateTiles = () => {
    let nrOfGrassTiles =
      this._rows * this._columns - this._wallCount - this._treasureCount;
    let oneDimensionalTilesArr = [];
    for (let i = 0; i < nrOfGrassTiles; i++) {
      let grassTile = new Grass();
      this._grassTiles.push(grassTile);
      oneDimensionalTilesArr.push(grassTile);
    }

    //Insert Wall objects at random places
    for (let i = 0; i < this._wallCount; i++) {
      let wallTile = new Wall();
      this._wallTiles.push(wallTile);
      oneDimensionalTilesArr.splice(
        getRandomNr(0, oneDimensionalTilesArr.length - 1),
        0,
        wallTile
      );
    }

    //Insert Treasure objects at random places
    for (let i = 0; i < this._treasureCount; i++) {
      let treasureTile = new Treasure();
      this._treasureTiles.push(treasureTile);
      oneDimensionalTilesArr.splice(
        getRandomNr(0, oneDimensionalTilesArr.length - 1),
        0,
        treasureTile
      );
    }

    //Set Coordinates
    oneDimensionalTilesArr.map((item, index) => {
      item.x = index % this._columns;
      item.y = parseInt(index / this._rows);
      item.width = this.canvasWidth / this._columns;
      item.height = this.canvasHeight / this._rows;
    });

    //convert to 2D tiles array
    for (let i = 0; i < this._rows; i++) {
      this._tiles.push(
        oneDimensionalTilesArr.slice(
          i * this._rows,
          i * this._rows + this._columns
        )
      );
    }
  };

  /**
   * Get random free spot on board
   */
  getRandomFreeSpotOnBoard = () => {
    //TODO: validate that position is not boxed in by walls.
    return this._grassTiles[getRandomNr(0, this._grassTiles.length - 1)];
  };

  getTile(x, y) {
    return this._tiles[y][x];
  }
}
