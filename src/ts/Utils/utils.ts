import { map, scene } from '../app'
import { tileType, Tile } from '../Tile'
import { directionEnum } from '../game-interfaces/direction.interface'

export class Utils {
    public static requestMovementInformation( { position, actualDirection, requestedDirection, SPEED } ): directionEnum{

        let { x, y } = position
        let neighborTile = map.getNeighborTile( map.getTile( position ), requestedDirection )
    
        if( neighborTile.type === tileType.WALL ||
             ( neighborTile.type === tileType.DOOR && requestedDirection != "NORTH"))
            return actualDirection

        for( var i= 0; i < SPEED; i++ ){
            if( ( actualDirection == "SOUTH" && (y+i) % 25 === 0 && (y+i) % 2 !== 0 ) ||
                ( actualDirection == "NORTH" && (y-i) % 25 === 0 && (y-i) % 2 !== 0 ) ||
                ( actualDirection == "WEST" && (x-i) % 25 === 0 && (x-i) % 2 !== 0 ) ||
                ( actualDirection == "EAST" &&(x+i) % 25 === 0 && (x+i) % 2 !== 0 ) )
                    return requestedDirection
        }

        return actualDirection
    }

    public static opositeDirection( dir: directionEnum): directionEnum{
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

    public static giveLimitsOfMapByZone(zone: string){
        let halfMapX = ( map.MAP_TILE_WIDTH / 2 ) - 1
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
                    maxX: map.MAP_TILE_WIDTH - 1,
                    maxY: halfMapY,
                }
            case "SE":
                return {
                    minX: halfMapX,
                    minY: halfMapY,
                    maxX: map.MAP_TILE_WIDTH - 1,
                    maxY: map.MAP_TILE_HEIGHT - 1
                }
            case "SW":
                return {
                    minX:1,
                    minY:halfMapY,
                    maxX:halfMapX,
                    maxY:map.MAP_TILE_HEIGHT - 1
                }
            case "ANYWHERE":
                return {
                    minX:1,
                    minY:1,
                    maxX:map.MAP_TILE_WIDTH - 1,
                    maxY:map.MAP_TILE_HEIGHT - 1
                }
        }
    
    }
    
    public static findAlternativeWay( nextWay: 'lat' | 'long', currentTile: Tile ): directionEnum {
    
        var rand = Math.floor(Math.random() * 10) + 1
        var dir: directionEnum
        if( nextWay == "long" ){
            dir = rand%2 == 0 ? directionEnum.NORTH : directionEnum.SOUTH
        }
        else if( nextWay == "lat"){
            dir = rand%2 == 0 ? directionEnum.EAST : directionEnum.WEST
        }

        // if( map.getNeighborTile(currentTile, dir ).type == "WALL" ){
        //     Utils.targetDrawer( map.getNeighborTile(currentTile, dir ) )
        //     dir = Utils.opositeDirection( dir )
        //     console.log("aqui")
        // }

        return dir
        
    }
    
    public static getRandomDir():directionEnum{
        var rand = Math.floor(Math.random() * 4) + 1
        switch( rand ){
            case 1:
                return directionEnum.NORTH
            case 2:
                return directionEnum.EAST
            case 3:
                return directionEnum.WEST
            case 4:
                return directionEnum.SOUTH
        }
    }

        
    public static distance(x1,y1,x2,y2){
        var dx = x1 - x2;
        var dy = y1 - y2;

        return Math.sqrt(dx * dx + dy * dy);
    }

    public static targetDrawer(target:Tile, verbose: boolean = false ){
        let { x, y } = target.getPosition()
        
        scene.add.image( 
            x * 50 + 18,
            y * 50 + 18,
              "blueDot" ).setOrigin(0,0)

        if( verbose ){
            console.log( x )
            console.log( y )
        }

    }
}
