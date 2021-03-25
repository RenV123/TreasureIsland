import { Vector2D } from '../Helpers/vector2D.js';
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
      foundPathToTreasureHunter: false,
      goldenPathIndex: -1,
      listOfCheckedSpots: [],
    };

    pathWayData.listOfPathWays.push([]);
    this._moveToTreasureHunterRecursive(this.pos, 0, pathWayData);

    //Filter out all pathways that do not end on the treasurehunter pos.
    pathWayData.listOfPathWays = pathWayData.listOfPathWays.filter(
      (pathway) => {
        return (
          pathway.length > 0 &&
          this._treasureHunter.pos.equals(pathway[pathway.length - 1])
        );
      }
    );

    pathWayData.listOfPathWays.sort(
      (pathA, pathB) => pathA.length - pathB.length
    );

    if (pathWayData.listOfPathWays[0]?.length) {
      console.log('Eureka!');
      this.x = pathWayData.listOfPathWays[0]?.[0].x;
      this.y = pathWayData.listOfPathWays[0]?.[0].y;
    }

    pathWayData.listOfCheckedSpots.forEach((spot) => {
      let tile = this._gameboard.getTile(spot.x, spot.y);
      tile.color = '#93B27B';
    });
    pathWayData.listOfPathWays[0]?.forEach((spot) => {
      let tile = this._gameboard.getTile(spot.x, spot.y);
      tile.color = '#8ED954';
    });
  }

  _moveToTreasureHunterRecursive(pos, pathWayIndex, pathWayData) {
    //prevent checking the same spots twice
    pathWayData.listOfCheckedSpots.push(pos);

    //Check if we found the pos of the treasurehunter
    if (pos.equals(this._treasureHunter.pos)) {
      pathWayData.foundPathToTreasureHunter = true;
      pathWayData.goldenPathIndex = pathWayIndex;
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

      for (let i = 0; i < tileArr.length; i++) {
        if (
          tileArr[i] &&
          this.whiteListedTiles.includes(tileArr[i].constructor.name) &&
          !pathWayData.listOfCheckedSpots.includes(tileArr[i].pos)
        ) {
          if (i < 2) {
            //first two spots are presumed closer to the target make no new pathways
            pathWayData.listOfPathWays[pathWayIndex].push(tileArr[i].pos);
            this._moveToTreasureHunterRecursive(
              tileArr[i].pos,
              pathWayIndex,
              pathWayData
            );
            return;
          } else {
            //last spots are further from the target make new pathways
            pathWayData.listOfPathWays.push([
              ...pathWayData.listOfPathWays[pathWayIndex],
              tileArr[i].pos,
            ]);
            this._moveToTreasureHunterRecursive(
              tileArr[i].pos,
              pathWayIndex + 1,
              pathWayData
            );
          }
        }
      }
    }
  }

  _canMoveOnTile(x, y) {
    let tile = this._gameboard.getTile(x, y);
    return this.whiteListedTiles.includes(tile.constructor.name);
  }
}
