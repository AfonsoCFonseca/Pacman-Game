import { map } from './app'
import { Tile } from './Tile'
import { Position} from './game-interfaces/position.interface'
import { directionEnum } from './game-interfaces/direction.interface'

export class Pacman {

    private position: Position
    private player;
    private VELOCITY = 160
    private actualDirection = directionEnum.EAST
    private newDirection: directionEnum | null = null
    private nextTile: Tile
    private tileId: string

    constructor( player ){
        this.player = player
        this.position = {
            x: parseInt( player.x ),
            y: parseInt( player.y )
        }

        this.setCurrentPosition( this.position )
        this.tileId = this.getCurrentTile()._id
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

    public setNextTile( ) {
        let {x,y} = this.getCurrentTile().getPosition()

        switch(this.actualDirection) {
            case "SOUTH":
                y += 1
            break;
            case "NORTH":
                y -= 1
            break;
            case "WEST":
                x -= 1
            break;
            case "EAST":
                x += 1
            break;
        }

        this.nextTile = map.getTile( {x,y}, "index")
    }

    setCurrentPosition({ x, y }: Position){
        this.position = {x, y}
    }

    public update(){
        this.setCurrentPosition( this.player )

        if( this.shouldUpdateTile( ) ){
            this.tileId = this.getCurrentTile()._id
            this.actualDirection = this.newDirection
            this.setNextTile()
        }
    }
    
    shouldUpdateTile( ): boolean {
       if( this.getCurrentTile()._id != this.tileId || 
        this.newDirection != this.actualDirection )
            return true
        else return false
    }

    public move( direction: directionEnum){
        this.newDirection = direction

        switch(direction) {
            case "SOUTH":
                this.player.anims.play('pacmanSouthAnim', true);
                this.player.setVelocityX(0);
                this.player.setVelocityY(this.VELOCITY);
            break;
            case "NORTH":
                this.player.anims.play('pacmanNorthAnim', true);
                this.player.setVelocityX(0);
                this.player.setVelocityY(-this.VELOCITY);
            break;
            case "WEST":
                this.player.anims.play('pacmanWestAnim', true);
                this.player.setVelocityX(-this.VELOCITY);
                this.player.setVelocityY(0);
    
            break;
            case "EAST":
                this.player.anims.play('pacmanEastAnim', true);
                this.player.setVelocityX(this.VELOCITY);
                this.player.setVelocityY(0);
            break;

        }
    }

    public findAlternativeWay( nextWay: 'lat' | 'long' ){

        if( nextWay == "long" ){
            this.move(directionEnum.NORTH)
        }
        else if( nextWay == "lat"){
            this.move(directionEnum.EAST)
        }
        
    }
}