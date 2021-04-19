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
        if (
          grassTile.pos.equals(tile.pos) ||
          !pathFinder.canFindPathBetweenPoints(grassTile.pos, tile.pos)
        )
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

    //Position Enemy in quadrant diagonally from the player
    let xMin = treasureHunter.x < this._columns / 2 ? this._columns / 2 : 0;
    let xMax =
      treasureHunter.x < this._columns / 2
        ? this._columns - 1
        : this._columns / 2;
    let yMin = treasureHunter.y < this._rows / 2 ? this._rows / 2 : 0;
    let yMax =
      treasureHunter.y < this._rows / 2 ? this._rows - 1 : this._rows / 2;

    const grassTilesInQuadrant = this._grassTiles.filter((tile) => {
      return tile.x > xMin && tile.x < xMax && tile.y > yMin && tile.y < yMax;
    });

    foundValidPos = false;
    if (grassTilesInQuadrant.length > 0) {
      let startIndex = getRandomNr(0, grassTilesInQuadrant.length - 1);
      let index = startIndex;
      do {
        let tile = grassTilesInQuadrant[index];
        let pathwayData = pathFinder.findShortestPath(
          tile.pos,
          treasureHunter.pos
        );
        if (
          pathwayData.goodPaths.length > 0 &&
          pathwayData.goodPaths[0].length > 10 //Make sure the enemy is not too close to the hero
        ) {
          enemy.x = tile.pos.x;
          enemy.y = tile.pos.y;
          enemy.width = tile.width;
          enemy.height = tile.height;
          foundValidPos = true;
          break;
        } else {
          index++;
          if (index === grassTilesInQuadrant.length) index = 0;
          else if (index === startIndex) {
            console.error(`Couldn't find a single valid pos in quadrant!`);
            break;
          }
        }
      } while (!foundValidPos);
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
