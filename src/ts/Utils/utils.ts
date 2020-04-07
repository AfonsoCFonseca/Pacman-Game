import { map } from '../app'
import { tileType } from '../Tile'
import { directionEnum } from '../game-interfaces/direction.interface'

export function requestMovementInformation( { position, actualDirection, requestedDirection, SPEED } ): directionEnum{

    let { x, y } = position
    let neighborTile = map.getNeighborTile( map.getTile( position ), requestedDirection )

    if( neighborTile.type === tileType.WALL )
        return actualDirection

    for( var i= 0; i < SPEED; i++ ){
        if( actualDirection == "SOUTH" && (y+i) % 25 === 0 && (y+i) % 2 !== 0 )
            return requestedDirection
        else if( actualDirection == "NORTH" && (y-i) % 25 === 0 && (y-i) % 2 !== 0 )
            return requestedDirection
        else if( actualDirection == "WEST" && (x-i) % 25 === 0 && (x-i) % 2 !== 0 )
            return requestedDirection
        else if( actualDirection == "EAST" &&(x+i) % 25 === 0 && (x+i) % 2 !== 0 )
            return requestedDirection
    }
    return actualDirection
}

export function opositeDirection( dir: directionEnum): directionEnum{
    switch( dir ){
        case directionEnum.NORTH: 
            return directionEnum.SOUTH
        case directionEnum.SOUTH: 
            return directionEnum.NORTH
        case directionEnum.EAST: 
            return directionEnum.WEST
        case directionEnum.WEST: 
            return directionEnum.EAST
    }
}

export function giveLimitsOfMapByZone(zone: string){
    let halfMapX = ( map.MAP_WIDTH / 2 ) - 1
    let halfMapY =  ( map.MAP_HEIGHT / 2 ) - 1

    switch( zone ){
        case "NW": 
            return {
                minX: 1,
                minY: 1,
                maxX: halfMapX,
                maxY: halfMapY,
            }
        case "NE":
            return {
                minX: halfMapX,
                minY: 1,
                maxX: map.MAP_WIDTH - 1,
                maxY: halfMapY,
            }
        case "SE":
            return {
                minX: halfMapX,
                minY: halfMapY,
                maxX: map.MAP_WIDTH - 1,
                maxY: map.MAP_HEIGHT - 1
            }
        case "SW":
            return {
                minX:1,
                minY:halfMapY,
                maxX:halfMapX,
                maxY:map.MAP_HEIGHT - 1
            }
        case "ANYWHERE":
            return {
                minX:1,
                minY:1,
                maxX:map.MAP_WIDTH - 1,
                maxY:map.MAP_HEIGHT - 1
            }
    }

}