import { Position } from './game-interfaces/position.interface' 

enum tileType {
    EMPTY = "EMPTY",
    POINT = "POINT",
    WALL = "WALL"
}

export class Tile {

    protected TILE_SIZE = 50
    public type = tileType.EMPTY
    private position: Position;
    public _id: string;
    scene: any;

    constructor( scene, x, y, value ){
        this.scene = scene
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
        if( value == 0 )
            this.type  = tileType.EMPTY
        else if( value == 1 ){
            this.type  = tileType.WALL
            let square = this.scene.add.image( this.position.x * this.TILE_SIZE, this.position.y* this.TILE_SIZE, "tileImage" ).setOrigin(0,0)
            this.scene.imageGroup.add(square);
        }
        else if( value == 2 )
            this.type  = tileType.POINT
    }
}