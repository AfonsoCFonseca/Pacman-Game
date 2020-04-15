import { map, scene, level, SPEED } from "../app";
import { tileType, Tile } from "../Tile";
import { directionEnum } from "../game-interfaces/direction.interface";

export class Utils {
  public static requestMovementInformation(elem): directionEnum {
    let { x, y } = elem.position;
    let neighborTile = map.getNeighborTile(
      map.getTile(elem.position),
      elem.requestedDirection
    );


    if ( neighborTile.type === tileType.TELEPORT  ) {

      if( elem.player ) 
        elem.changeCurrentPosition(this.convertTilePosToXY( neighborTile.opositeTeleportPosition, "pacman"))
      else elem.changeCurrentPosition(this.convertTilePosToXY( neighborTile.opositeTeleportPosition))
      return elem.actualDirection
    }
    
    if (
      neighborTile.type === tileType.WALL ||
      (neighborTile.type === tileType.DOOR && elem.requestedDirection != "NORTH")
    ) return elem.actualDirection;


    for (var i = 0; i < SPEED; i++) {
      if (
        (elem.actualDirection == "SOUTH" &&
          (y + i) % 25 === 0 &&
          (y + i) % 2 !== 0) ||
        (elem.actualDirection == "NORTH" &&
          (y - i) % 25 === 0 &&
          (y - i) % 2 !== 0) ||
        (elem.actualDirection == "WEST" &&
          (x - i) % 25 === 0 &&
          (x - i) % 2 !== 0) ||
        (elem.actualDirection == "EAST" && 
          (x + i) % 25 === 0 && 
          (x + i) % 2 !== 0)
      )
        return elem.requestedDirection;
    }

    return elem.actualDirection;
  }

  public static opositeDirection(dir: directionEnum): directionEnum {
    switch (dir) {
      case directionEnum.NORTH:
        return directionEnum.SOUTH;
      case directionEnum.SOUTH:
        return directionEnum.NORTH;
      case directionEnum.EAST:
        return directionEnum.WEST;
      case directionEnum.WEST:
        return directionEnum.EAST;
    }
  }

  public static giveLimitsOfMapByZone(zone: string) {
    let halfMapX = map.MAP_TILE_WIDTH / 2 - 1;
    let halfMapY = map.MAP_HEIGHT / 2 - 1;

    switch (zone) {
      case "NW":
        return {
          minX: 1,
          minY: 1,
          maxX: halfMapX,
          maxY: halfMapY,
        };
      case "NE":
        return {
          minX: halfMapX,
          minY: 1,
          maxX: map.MAP_TILE_WIDTH - 1,
          maxY: halfMapY,
        };
      case "SE":
        return {
          minX: halfMapX,
          minY: halfMapY,
          maxX: map.MAP_TILE_WIDTH - 1,
          maxY: map.MAP_TILE_HEIGHT - 1,
        };
      case "SW":
        return {
          minX: 1,
          minY: halfMapY,
          maxX: halfMapX,
          maxY: map.MAP_TILE_HEIGHT - 1,
        };
      case "ANYWHERE":
        return {
          minX: 1,
          minY: 1,
          maxX: map.MAP_TILE_WIDTH - 1,
          maxY: map.MAP_TILE_HEIGHT - 1,
        };
    }
  }

  public static findAlternativeWay(
    nextWay: "lat" | "long",
    currentTile: Tile
  ): directionEnum {
    var rand = Math.floor(Math.random() * 10) + 1;
    var dir: directionEnum;
    if (nextWay == "long") {
      dir = rand % 2 == 0 ? directionEnum.NORTH : directionEnum.SOUTH;
    } else if (nextWay == "lat") {
      dir = rand % 2 == 0 ? directionEnum.EAST : directionEnum.WEST;
    }
    return dir;
  }

  public static getRandomDir(): directionEnum {
    var rand = Math.floor(Math.random() * 4) + 1;
    switch (rand) {
      case 1:
        return directionEnum.NORTH;
      case 2:
        return directionEnum.EAST;
      case 3:
        return directionEnum.WEST;
      case 4:
        return directionEnum.SOUTH;
    }
  }

  public static distance(x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);
  }

  public static targetDrawer(target: Tile, verbose: boolean = false) {
    let { x, y } = this.convertTilePosToXY ( target.getPosition() )

    scene.add.image(x + 18, y + 18, "blueDot").setOrigin(0, 0);

    if (verbose) {
      console.log(x);
      console.log(y);
    }
  }

  public static calculateSpeed(): number {
    if( level == 1 ) return SPEED
    else{
      return SPEED + (level - 1)
    } 
  }

  public static convertTilePosToXY({x,y}, pacman = null ){
    if( pacman ){
      return {x: ((x*50)+25) , y: (y*50) +25}
    }  
    return {x: (x*50) , y: (y*50)}
  }


}
