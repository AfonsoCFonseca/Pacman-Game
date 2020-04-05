import { map } from '../app'
import { tileType } from '../Tile'
import { directionEnum } from '../game-interfaces/direction.interface'

export function requestMovementInformation( { position, actualDirection, requestedDirection, SPEED } ): directionEnum{

    let { x, y } = position

    if( map.getNeighborTile( map.getTile( position ), requestedDirection ).type === tileType.WALL)
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