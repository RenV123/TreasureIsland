import { Vector2D } from '../Helpers/vector2D.js';
import { colorShade } from '../Helpers/helperlib.js';
import { GameObject, DrawTypes } from './gameObject.js';

export class Enemy extends GameObject {
  type = DrawTypes.CIRCLE;
  color = '#F94144';
  whiteListedTiles = ['Grass'];

  constructor(gameboard, treasureHunter, x, y, width, height) {
    super(x, y, width, height);
    this._gameboard = gameboard;
    this._treasureHunter = treasureHunter;
  }

  moveToTreasureHunter() {
    let pathWayData = {
      listOfCheckedSpots: [], //all spots on the board that the algorithm checked
      activePaths: [], //all currently checked spots
      goodPaths: [], //paths that find their way to the treasurehunter are added here.
      badPaths: [], //paths that lead to dead end go here. (for debugging)
    };

    //Use tilepos instead
    let tilePos = this._gameboard.getTile(this.pos.x, this.pos.y).pos;
    pathWayData.listOfCheckedSpots.push(tilePos);
    pathWayData.activePaths.push([tilePos]);
    this._findTreasureHunterPathRecursive(pathWayData);

    pathWayData.listOfCheckedSpots.forEach((spot) => {
      let tile = this._gameboard.getTile(spot.x, spot.y);
      tile.color = '#7EB356';
    });

    if (pathWayData.goodPaths?.[0]?.length > 0) {
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

  _findTreasureHunterPathRecursive(pathWayData) {
    //Iterate in reverse over every pathway as we are replacing them with new ones.
    let newActivePaths = [];
    while (pathWayData.activePaths.length > 0) {
      let pathway = pathWayData.activePaths.pop();

      if (pathway && pathway.length > 0) {
        let pos = pathway[pathway.length - 1];

        //Get all available surrounding tiles of this pos
        let tileArr = [
          this._gameboard.getTile(pos.x + 1, pos.y),
          this._gameboard.getTile(pos.x - 1, pos.y),
          this._gameboard.getTile(pos.x, pos.y + 1),
          this._gameboard.getTile(pos.x, pos.y - 1),
        ];

        let isDeadEnd = true;
        tileArr.forEach((tile) => {
          if (
            tile &&
            this.whiteListedTiles.includes(tile.constructor.name) &&
            !pathWayData.listOfCheckedSpots.includes(tile.pos)
          ) {
            isDeadEnd = false;

            //Found path to the treasureHunter
            if (tile.pos.equals(this._treasureHunter.pos)) {
              pathWayData.goodPaths.push([...pathway, tile.pos]);
            } else {
              //Keep looking
              pathWayData.listOfCheckedSpots.push(tile.pos);
              newActivePaths.push([...pathway, tile.pos]);
            }
          }
        });
        if (isDeadEnd) {
          pathWayData.badPaths.push(pathway);
        }
      } else console.error('Found undefined or empty pathway.');
    }
    pathWayData.activePaths = newActivePaths;
    if (
      pathWayData.activePaths.length > 0 &&
      pathWayData.goodPaths.length == 0
    ) {
      this._findTreasureHunterPathRecursive(pathWayData);
    }
    //Sort by length to get the shortest path
    else if (pathWayData.goodPaths.length > 0) {
      pathWayData.goodPaths.sort((pathA, pathB) => {
        return pathA.length > pathB.length;
      });
    }
  }
}
