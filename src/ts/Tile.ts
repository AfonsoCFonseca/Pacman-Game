import { Position } from './game-interfaces/position.interface' 
import { scene } from './app'
import { Fruit } from './Fruit'
import { Utils } from './Utils/utils'

export let fruit: Fruit
let makeRandomTileNumber = Math.floor(Math.random() * 4) + 1

export enum tileType {
    EMPTY = "EMPTY",
    POINT = "POINT",
    WALL = "WALL",
    POWER_UP = "POWER_UP",
    DOOR = "DOOR",
    TELEPORT = "TELEPORT",
    FRUIT = "FRUIT"
}

export class Tile {

    protected TILE_SIZE = 50
    protected POINT_SIZE = 10
    protected POWER_UP_SIZE = 18
    public type: tileType = tileType.EMPTY
    private value: number
    private position: Position;
    public _id: string;
    public fruit: Fruit | null
    public opositeTeleportPosition: Position | null
    public image;


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

    public getTileValue(): number{
        return this.value
    }

    public setTileValue( value: number ){

        if( value == 0 ){
            this.type  = tileType.POINT
            
            this.image = scene.pointsGroup.create( 
                (this.position.x *this.TILE_SIZE) + (this.TILE_SIZE/2 - this.POINT_SIZE/2 ),
                (this.position.y* this.TILE_SIZE ) + (this.TILE_SIZE/2 - this.POINT_SIZE/2 ),
                'pointImage').setOrigin(0,0)
            
            this.image.setData('TileObject', this);

        }
        else if( value == 1 ){
            this.type  = tileType.WALL
            this.image = scene.add.image( 
                this.position.x * this.TILE_SIZE,
                this.position.y * this.TILE_SIZE,
                  "tileImage"+makeRandomTileNumber ).setOrigin(0,0)
            scene.imageGroup.add(this.image);
        }
        else if( value == 2 ){
            this.type  = tileType.EMPTY
        }
        else if( value == 3 ){
            this.type = tileType.POWER_UP

            this.image = scene.powerUpGroup.create( 
                (this.position.x *this.TILE_SIZE ) + (this.TILE_SIZE/2 - this.POWER_UP_SIZE/2 ),
                (this.position.y* this.TILE_SIZE ) + (this.TILE_SIZE/2 - this.POWER_UP_SIZE/2 ),
                'power-up').setOrigin(0,0)
            
                this.image.setData('TileObject', this);
        }
        else if( value == 4 ){
            this.type = tileType.DOOR

            this.image = scene.add.image( 
                this.position.x * this.TILE_SIZE,
                this.position.y * this.TILE_SIZE,
                  "door" ).setOrigin(0,0)
            scene.imageGroup.add(this.image);
        }
        else if( value == 5 ){ 
            if( this.value == 1 ) scene.dots++
            this.type = tileType.FRUIT
            let {x,y} = Utils.convertTilePosToXY( this.getPosition() )
            fruit = new Fruit({ x, y });
            this.fruit = fruit
        }
        else if( value == 6 ){
            this.type = tileType.TELEPORT

            if( this.position.x == 18 )
                this.opositeTeleportPosition = {x: 0, y: 9}
            else this.opositeTeleportPosition = {x: 18, y: 9}
        }

        this.value = value
    }
}