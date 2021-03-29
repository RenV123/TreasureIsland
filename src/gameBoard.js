import { Grass } from './GameObjects/grass.js';
import { getRandomNr, PathWayFinder } from './Helpers/helperlib.js';
import { Wall } from './GameObjects/wall.js';
import { Treasure } from './GameObjects/treasure.js';
import { Vector2D } from './Helpers/vector2D.js';

export class GameBoard {
  _tiles = [];
  _grassTiles = [];
  _treasureTiles = [];
  _wallTiles = [];
  _treasureCollected = 0;

  constructor(
    canvasWidth,
    canvasHeight,
    rows = 15,
    columns = 15,
    treasureCount = 3,
    wallCount = 10,
    onAllTreasureCollected
  ) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this._rows = rows;
    this._columns = columns;
    this._treasureCount = treasureCount;
    this._wallCount = wallCount;
    this._onAllTreasureCollected = onAllTreasureCollected;

    this.generateBoard();
  }

  get tiles() {
    return this._tiles;
  }

  /**
   * Generates tiles of the board.
   */
  generateBoard = () => {
    this._treasureCollected = 0;
    this._tiles = [];
    this._treasureTiles = [];
    this._wallTiles = [];
    this._grassTiles = [];
    let oneDimensionalTilesArr = [];

    let nrOfGrassTiles =
      this._rows * this._columns - this._wallCount - this._treasureCount;

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
  placeTreasureHunterAndEnemy = (treasureHunter, enemy) => {
    let pathFinder = new PathWayFinder(this, ['Grass', 'Treasure']);
    let foundValidPos = false;
    while (!foundValidPos) {
      let grassTile = this._grassTiles[
        getRandomNr(0, this._grassTiles.length - 1)
      ];

      let canFindAllTreasure = true;
      this._treasureTiles.forEach((tile) => {
        if (!pathFinder.canFindPathBetweenPoints(grassTile.pos, tile.pos))
          canFindAllTreasure = false;
      });
      if (!canFindAllTreasure) {
        this.generateBoard();
      } else {
        treasureHunter.x = grassTile.pos.x;
        treasureHunter.y = grassTile.pos.y;
        treasureHunter.width = grassTile.width;
        treasureHunter.height = grassTile.height;
        foundValidPos = true;
      }
    }

    //Place Enemy in opposite quadrant

    let enemyPos = new Vector2D();
    if (treasureHunter.x < this._columns / 2) {
      enemyPos.x = getRandomNr(this._columns / 2, this._columns);
    } else {
      enemyPos.x = getRandomNr(0, this._columns / 2);
    }

    if (treasureHunter.y < this._rows / 2) {
      enemyPos.y = getRandomNr(this._rows / 2, this._rows);
    } else {
      enemyPos.y = getRandomNr(0, this._rows / 2);
    }

    let enemyIndex = enemyPos.x * enemyPos.y;
    let grassTile = this._grassTiles[enemyIndex];

    let firstIndex = enemyIndex;
    foundValidPos = false;
    let attempts = 0;
    let maxAttempts = (this._columns / 2) * (this._rows / 2);
    while (!foundValidPos && attempts < maxAttempts) {
      if (
        grassTile &&
        pathFinder.canFindPathBetweenPoints(grassTile.pos, treasureHunter.pos)
      ) {
        enemy.x = grassTile.pos.x;
        enemy.y = grassTile.pos.y;
        enemy.width = grassTile.width;
        enemy.height = grassTile.height;
        foundValidPos = true;
      }

      if (enemyIndex >= this._grassTiles.length) {
        enemyIndex = 0;
      }
      grassTile = this._grassTiles[++enemyIndex];
      attempts++;
    }

    if (!foundValidPos) {
      console.error(
        `Couldnt find valid spot. index: ${firstIndex}, ${enemyIndex}`
      );
    }
  };

  getTile(x, y) {
    return this._tiles[y]?.[x];
  }

  collectTreasureTile(tile) {
    let index = this._treasureTiles.findIndex((t) => t === tile);
    if (index !== -1) {
      let grass = new Grass(tile.x, tile.y, tile.width, tile.height);
      this._treasureTiles.splice(index, 1);

      this._tiles[tile.y][tile.x] = grass;

      this._treasureCollected++;
      if (this._treasureCollected == this._treasureCount) {
        this._onAllTreasureCollected();
      }
    } else {
      console.error('Treasure tile is not in board!');
    }
  }
}
