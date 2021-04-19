import { Vector2D } from '../Helpers/vector2D.js';
import {
  colorShade,
  PathWayFinder,
  getRandomNr,
  shuffleArray,
} from '../Helpers/helperlib.js';
import { GameObject, DrawTypes } from './gameObject.js';

export class Enemy extends GameObject {
  type = DrawTypes.IMG;
  color = '#F94144';
  whiteListedTiles = ['Grass'];
  hasHurtThetreasureHunter = false;

  constructor(gameboard, treasureHunter, x, y, width, height) {
    super(x, y, width, height);
    this._gameboard = gameboard;
    this._treasureHunter = treasureHunter;
    this.imgSrc = './img/tile-enemy-1.webp';

    //Movement AI
    this._changeOfStepTowardsPlayer = 75;
    this._changeWhenClose = 10;
  }

  move() {
    //Don't move the enemy after hurting the treasurehunter.
    //Allows the treasurehunter a change to escape the enemy.
    if (this.hasHurtThetreasureHunter) {
      this.hasHurtThetreasureHunter = false;
      return;
    }

    let pathFinder = new PathWayFinder(this._gameboard, this.whiteListedTiles);
    let pathWayData = pathFinder.findShortestPath(
      this.pos,
      this._treasureHunter.pos
    );

    if (window.DEBUG_MODE) {
      pathWayData.listOfCheckedSpots.forEach((spot) => {
        let tile = this._gameboard.getTile(spot.x, spot.y);
        tile.color = '#7EB356';
      });
    }
    //Make a random move depending on intelligence level
    let chanceOfStupidity =
      pathWayData.goodPaths.length == 0 ? 100 : getRandomNr(0, 100);

    //Increase the change of good moves when the enemy is close,
    //decrease it when further
    if (pathWayData.goodPaths?.[0]?.length < 7) {
      chanceOfStupidity -= this._changeWhenClose;
    } else chanceOfStupidity += this._changeWhenClose;

    if (chanceOfStupidity > this._changeOfStepTowardsPlayer) {
      let surroundingTiles = shuffleArray([
        this._gameboard.getTile(this.x + 1, this.y),
        this._gameboard.getTile(this.x - 1, this.y),
        this._gameboard.getTile(this.x, this.y + 1),
        this._gameboard.getTile(this.x, this.y - 1),
      ]);

      let matchingTile = surroundingTiles.find((tile) => {
        return (
          tile &&
          this.whiteListedTiles.includes(tile.constructor.name) &&
          !Vector2D.equals(tile.pos, pathWayData.goodPaths?.[0]?.[1]) &&
          !Vector2D.equals(tile.pos, this._treasureHunter.pos) //The enemy cannot move on the treasurehunters tile
        );
      });
      if (matchingTile) {
        this.x = matchingTile.x;
        this.y = matchingTile.y;

        //debugging
        if (window.DEBUG_MODE) matchingTile.color = 'darkred';
      }
    } else if (pathWayData.goodPaths?.[0]?.length > 0) {
      if (
        pathWayData.goodPaths[0][1].x != this._treasureHunter.x ||
        pathWayData.goodPaths[0][1].y != this._treasureHunter.y
      ) {
        this.x = pathWayData.goodPaths[0][1].x;
        this.y = pathWayData.goodPaths[0][1].y;
      }

      //Debug draw all goodpaths
      if (window.DEBUG_MODE) {
        let color = '#99c24750';
        pathWayData.goodPaths.reverse().forEach((pathway) => {
          color = colorShade(color, +10);
          pathway.forEach((spot) => {
            let tile = this._gameboard.getTile(spot.x, spot.y);
            tile.color = color;
          });
        });
      }
    }

    if (Vector2D.subtract(this._treasureHunter.pos, this.pos).length() <= 1) {
      this._treasureHunter.decreaseLives();
      this.hasHurtThetreasureHunter = true;
    }
  }
}
