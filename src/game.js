import { getRandomNr } from "./Helpers/helperlib.js";
import { Grass} from "./GameObjects/grass.js";
import { Wall} from "./GameObjects/wall.js";
import { Treasure} from "./GameObjects/treasure.js";
import { TreasureHunter } from "./GameObjects/treasureHunter.js";

const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

class Game {
  _tiles = [];

  constructor(context,
              canvasWidth,
              canvasHeight,
              rows = 15,
              columns = 15,
              treasureCount = 3,
              wallCount = 10) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this._context = context;
    this._treasureHunter = new TreasureHunter();
    this._rows = rows;
    this._columns = columns;
    this._treasureCount = treasureCount;
    this._wallCount = wallCount;

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
      oneDimensionalTilesArr.push(new Grass());
    }

    //Insert Wall objects at random places
    for (let i = 0; i < this._wallCount; i++) {
      oneDimensionalTilesArr.splice(
          getRandomNr(0, oneDimensionalTilesArr.length - 1),
          0,
          new Wall()
      );
    }

    //Insert Treasure objects at random places
    for (let i = 0; i < this._treasureCount; i++) {
      //Insert Wall objects at random places
      oneDimensionalTilesArr.splice(
          getRandomNr(0, oneDimensionalTilesArr.length - 1),
          0,
          new Treasure()
      );
    }

    //Set Coordinates
    oneDimensionalTilesArr.map((
        item,
        index
    ) => {
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
  }

  /**
   * Draws all the tiles of the board on the canvas
   * @private
   */
  _drawBoard = () => {
    //draw background same as grass
    if(this._tiles.length > 0) {
      this._context.fillStyle = new Grass().color;
      this._context.fillRect(0,0, this.canvasWidth, this.canvasHeight);

      this._tiles.forEach((tilesRow) => {
        tilesRow.forEach(({color, height, width, x, y, name}) => {
          //FIXME: we assume the tile dimensions don't exceed canvas dimensions
          if(name !== 'Grass') {  //Don't render the grass tiles for now.
            this._context.fillStyle = color;
            this._context.fillRect(
                x * width,
                y * height,
                width,
                height
            );
          }
        })
      });
    }
  }

  startGame = () => {
    this._generateTiles();
    this._drawBoard();
  }
}

const game = new Game(context, canvas.width, canvas.height);
game.startGame();
