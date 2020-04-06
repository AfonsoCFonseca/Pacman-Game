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