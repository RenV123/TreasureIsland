import { Vector2D } from '../Helpers/vector2D.js';
import {
  colorShade,
  PathWayFinder,
  getRandomNr,
  shuffleArray,
} from '../Helpers/helperlib.js';
import { GameObject, DrawTypes } from './gameObject.js';

export class Enemy extends GameObject {
  type = DrawTypes.CIRCLE;
  color = '#F94144';
  whiteListedTiles = ['Grass'];

  constructor(
    gameboard,
    treasureHunter,
    x,
    y,
    width,
    height,
    intelligence = 75
  ) {
    super(x, y, width, height);
    this._gameboard = gameboard;
    this._treasureHunter = treasureHunter;
    this._intelligence = intelligence;
  }

  moveToTreasureHunter() {
    let pathFinder = new PathWayFinder(this._gameboard, this.whiteListedTiles);
    let pathWayData = pathFinder.findShortestPath(
      this.pos,
      this._treasureHunter.pos
    );

    let chanceOfStupidity = getRandomNr(0, 100);

    /*pathWayData.listOfCheckedSpots.forEach((spot) => {
      let tile = this._gameboard.getTile(spot.x, spot.y);
      tile.color = '#7EB356';
    });*/

    //Make a random move depending on intelligence level
    if (
      chanceOfStupidity > this._intelligence ||
      pathWayData.goodPaths.length == 0
    ) {
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
          tile.x != pathWayData.goodPaths?.[0]?.[1]?.x &&
          tile.y != pathWayData.goodPaths?.[0]?.[1]?.y
        );
      });
      if (matchingTile) {
        this.x = matchingTile.x;
        this.y = matchingTile.y;

        //debugging
        matchingTile.color = 'darkred';
      }
    } else if (pathWayData.goodPaths?.[0]?.length > 0) {
      this.x = pathWayData.goodPaths[0][1].x;
      this.y = pathWayData.goodPaths[0][1].y;

      //Debug draw all goodpaths
      let color = '#99c247';
      pathWayData.goodPaths.reverse().forEach((pathway) => {
        color = colorShade(color, +10);
        pathway.forEach((spot) => {
          let tile = this._gameboard.getTile(spot.x, spot.y);
          tile.color = color;
        });
      });
    }
  }
}
