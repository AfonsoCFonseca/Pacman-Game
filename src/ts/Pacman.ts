import { map } from './app'
import { Tile } from './Tile'
import { Position} from './game-interfaces/position.interface'
import { directionEnum } from './game-interfaces/direction.interface'

export class Pacman {

    private position: Position
    private player;
    private actualDirection = directionEnum.EAST
    private nextTile: Tile
    private requestedDirection: directionEnum = directionEnum.EAST
    private SPEED = 3

    constructor( player ){
        this.player = player
        this.position = {
            x: parseInt( player.x ),
            y: parseInt( player.y )
        }

        this.setCurrentPosition( this.position )
        this.setNextTile()
    }   

    public getCurrentPosition(): Position{
        return this.position
    }

    public getCurrentTile( ):Tile{
        let tile = map.getTile( this.position )
        return tile
    }

    public getNextTile(): Tile{
        return this.nextTile
    }

    public direction():directionEnum{
        return this.actualDirection
    }

    public setRequestedDirection( reqDir : directionEnum ){
        this.requestedDirection = reqDir
    }

    public setNextTile( ) {
        this.nextTile = map.getNeighborTile( this.getCurrentTile(), this.requestedDirection)
    }

    setCurrentPosition({ x, y }: Position){
        this.position = {x, y}
    }

    public update(){

        this.setCurrentPosition( this.player )
        this.setNextTile()

        this.requestMovementInformation()
        this.move()

    }

    private requestMovementInformation(){

        let { x, y } = this.getCurrentPosition()

        for( var i= 0; i < this.SPEED; i++ ){
            if( this.actualDirection == "SOUTH" && (y+i) % 25 === 0 && (y+i) % 2 !== 0 ){
                this.actualDirection = this.requestedDirection
                this.player.y = y+i
            }
            else if( this.actualDirection == "NORTH" && (y-i) % 25 === 0 && (y-i) % 2 !== 0 ){
                this.actualDirection = this.requestedDirection
                this.player.y = y-i
            }
            else if( this.actualDirection == "WEST" && (x-i) % 25 === 0 && (x-i) % 2 !== 0 ){
                this.actualDirection = this.requestedDirection
                this.player.x = x-i
            }
            else if( this.actualDirection == "EAST" &&(x+i) % 25 === 0 && (x+i) % 2 !== 0 ){
                this.actualDirection = this.requestedDirection
                this.player.x = x+i
            }
        }

    }

    
    public move( ){
        switch(this.actualDirection) {
            case "SOUTH":
                this.player.anims.play('pacmanSouthAnim', true);
                this.player.body.y+= this.SPEED
            break;
            case "NORTH":
                this.player.anims.play('pacmanNorthAnim', true);
                this.player.body.y-= this.SPEED
            break;
            case "WEST":
                this.player.anims.play('pacmanWestAnim', true);
                this.player.body.x-= this.SPEED
    
            break;
            case "EAST":
                this.player.anims.play('pacmanEastAnim', true);
                this.player.body.x+= this.SPEED
            break;
        }
    }

    public findAlternativeWay( nextWay: 'lat' | 'long' ){
        
        var rand = Math.floor(Math.random() * 10) + 1
        if( nextWay == "long" ){
            if( rand%2 == 0 )
                this.requestedDirection = directionEnum.NORTH
            else this.requestedDirection = directionEnum.SOUTH
        }
        else if( nextWay == "lat"){
            if( rand%2 == 0 )
                this.requestedDirection = directionEnum.EAST
            else this.requestedDirection = directionEnum.WEST
        }
        
    }
}