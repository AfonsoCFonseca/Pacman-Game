import { Position } from './game-interfaces/position.interface' 
import { scene } from './app'

export enum tileType {
    EMPTY = "EMPTY",
    POINT = "POINT",
    WALL = "WALL",
    POWER_UP = "POWER_UP",
    DOOR = "DOOR",
    TELEPORT = "TELEPORT"
}

export class Tile {

    protected TILE_SIZE = 50
    protected POINT_SIZE = 10
    protected POWER_UP_SIZE = 18
    public type = tileType.EMPTY
    private position: Position;
    public _id: string;

    constructor( x, y, value ){
        this._id = `tile_${x}_${y}`
        this.setPosition({ x, y })
        this.setTileValue( value )
    }

    public setPosition( position ){
        this.position = position
    }

    public getPosition(): Position{
        return this.position
    }

    public setTileValue( value: number ){
        if( value == 0 ){
            this.type  = tileType.POINT
            
            let point = scene.pointsGroup.create( 
                (this.position.x *this.TILE_SIZE) + (this.TILE_SIZE/2 - this.POINT_SIZE/2 ),
                (this.position.y* this.TILE_SIZE ) + (this.TILE_SIZE/2 - this.POINT_SIZE/2 ),
                'pointImage').setOrigin(0,0)
            
            point.setData('TileObject', this);

        }
        else if( value == 1 ){
            this.type  = tileType.WALL
            let square = scene.add.image( 
                this.position.x * this.TILE_SIZE,
                this.position.y * this.TILE_SIZE,
                  "tileImage" ).setOrigin(0,0)
            scene.imageGroup.add(square);
        }
        else if( value == 2 ){
            this.type  = tileType.EMPTY
        }
        else if( value == 3 ){
            this.type = tileType.POWER_UP

            let powerup = scene.powerUpGroup.create( 
                (this.position.x *this.TILE_SIZE ) + (this.TILE_SIZE/2 - this.POWER_UP_SIZE/2 ),
                (this.position.y* this.TILE_SIZE ) + (this.TILE_SIZE/2 - this.POWER_UP_SIZE/2 ),
                'power-up').setOrigin(0,0)
            
                powerup.setData('TileObject', this);
        }
        else if( value == 4 ){
            this.type = tileType.DOOR

            let door = scene.add.image( 
                this.position.x * this.TILE_SIZE,
                this.position.y * this.TILE_SIZE,
                  "door" ).setOrigin(0,0)
            scene.imageGroup.add(door);
        }
        else if( value == 5 ){
            this.type = tileType.DOOR
        }
    }
}