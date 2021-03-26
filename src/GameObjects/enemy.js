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
      listOfPathWays: [],
      listOfCheckedSpots: [],
    };

    pathWayData.listOfPathWays.push([]);

    //Use tilepos instead
    let tilePos = this._gameboard.getTile(this.pos.x, this.pos.y).pos;

    this._moveToTreasureHunterRecursive(tilePos, 0, pathWayData);

    //Filter out all pathways that do not end on the treasurehunter pos.
    let validPathways = pathWayData.listOfPathWays.filter((pathway) => {
      return (
        pathway.length > 0 &&
        this._treasureHunter.pos.equals(pathway[pathway.length - 1])
      );
    });

    validPathways.sort((pathA, pathB) => pathA.length - pathB.length);

    if (validPathways[0]?.length) {
      console.log('Eureka!');
      this.x = validPathways[0]?.[0]?.x;
      this.y = validPathways[0]?.[0]?.y;
    }

    //Only for debugging

    //show all traveled spots as ligt green
    pathWayData.listOfCheckedSpots?.forEach((spot) => {
      let tile = this._gameboard.getTile(spot.x, spot.y);
      tile.color = '#A9CC8E';
    });

    //show all valid paths from most valid to least (lighter to darker)
    let color = '#99c247';
    validPathways.reverse().forEach((pathway) => {
      color = colorShade(color, +10);
      pathway.forEach((spot) => {
        let tile = this._gameboard.getTile(spot.x, spot.y);
        tile.color = color;
      });
    });
  }

  _moveToTreasureHunterRecursive(pos, pathWayIndex, pathWayData) {
    //prevent checking the same spots twice
    if (pos) {
      pathWayData.listOfCheckedSpots.push(pos);
    } else return;

    //Check if we found the pos of the treasurehunter
    if (pos.equals(this._treasureHunter.pos)) {
      return;
    }

    //Calculate the distance and direction towards the treasure hunter
    let distance = Vector2D.subtract(this._treasureHunter.pos, pos);

    if (distance.length() > 0) {
      let direction = Vector2D.divide(distance, distance.length());
      direction = new Vector2D(
        direction.x > 0 ? Math.ceil(direction.x) : Math.floor(direction.x),
        direction.y > 0 ? Math.ceil(direction.y) : Math.floor(direction.y)
      );

      //Get all available surrounding tiles of this pos
      let tileArr = [
        this._gameboard.getTile(pos.x + 1, pos.y),
        this._gameboard.getTile(pos.x - 1, pos.y),
        this._gameboard.getTile(pos.x, pos.y + 1),
        this._gameboard.getTile(pos.x, pos.y - 1),
      ];

      tileArr.sort((tileA, tileB) => {
        return (
          Vector2D.subtract(this._treasureHunter.pos, tileA.pos).length() -
          Vector2D.subtract(this._treasureHunter.pos, tileB.pos).length()
        );
      });

      let tempCopyOfCurrentPathwayPos = [
        ...pathWayData.listOfPathWays[pathWayIndex],
      ];
      for (let i = 0; i < tileArr.length; i++) {
        if (
          tileArr[i] &&
          this.whiteListedTiles.includes(tileArr[i].constructor.name) &&
          !pathWayData.listOfCheckedSpots.includes(tileArr[i].pos)
        ) {
          if (tileArr[i].pos.equals(this._treasureHunter.pos)) {
            pathWayData.listOfPathWays[pathWayIndex].push(tileArr[i].pos);
            return;
          }
          /* if (i < 2) {
            //first two spots are presumed closer to the target make no new pathways
            pathWayData.listOfPathWays[pathWayIndex].push(tileArr[i].pos);
            this._moveToTreasureHunterRecursive(
              tileArr[i].pos,
              pathWayIndex,
              pathWayData
            );
         } else {*/
          //last spots are further from the target make new pathways
          pathWayData.listOfPathWays.push([
            ...tempCopyOfCurrentPathwayPos,
            tileArr[i].pos,
          ]);
          this._moveToTreasureHunterRecursive(
            tileArr[i].pos,
            pathWayData.listOfPathWays.length - 1,
            pathWayData
          );
          /*}*/
        }
      }
    }
  }

  _canMoveOnTile(x, y) {
    let tile = this._gameboard.getTile(x, y);
    return this.whiteListedTiles.includes(tile.constructor.name);
  }
}
