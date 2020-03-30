enum allStates {
    EMPTY = "EMPTY",
    POINT = "POINT",
    WALL = "WALL"
}

export class Tile {

    private TILE_SIZE = 50
    private posX: number
    private posY: number
    private currentState = allStates.EMPTY

    constructor( x, y, value  ){

        this.setPosition( x, y )
        this.setTileValue( value )
    }

    public setPosition( x, y ){
        this.posX = x
        this.posY = y
    }

    public setTileValue( value ){
        if( !value || value > 3 )
            value = 0
            
        this.currentState = allStates[value]
    }
}