import { map } from './app'
import { Tile } from './Tile'

interface Position {
    x: number,
    y: number
}

export class Pacman {

    private position: Position

    constructor( player ){
        this.position = {
            x: parseInt( player.x ),
            y: parseInt( player.y )
        }
        this.getCurrentPosition()
    }   

    public getCurrentPosition(): Position{
        return this.position
    }

    public getCurrentTile( ):Tile{
        let tile = map.getCurrentTile( this.position )
        //console.log( `Pacman is current at  ${ tile.posX }:${ tile.posY } with state ${tile.currentState}`)
        return tile
    }

    setCurrentPosition({ x, y }: Position){
        this.position = {x, y}
    }
}