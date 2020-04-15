import { map, ENEMY_SPAWN_TIME } from './app'
import { Tile, tileType } from './Tile'
import { Position} from './game-interfaces/position.interface'
import { directionEnum } from './game-interfaces/direction.interface'
import { Utils } from './Utils/utils'

export class Pacman {

    public position: Position
    public player;
    public actualDirection = directionEnum.EAST
    private nextTile: Tile
    public requestedDirection: directionEnum = directionEnum.EAST
    public SPEED = Utils.calculateSpeed()
    public isFree: boolean = true;
    private startPosition = {x: 325, y:575 }

    constructor( player ){
        this.player = player
        this.position = {
            x: parseInt( player.x ),
            y: parseInt( player.y )
        }

        this.setCurrentPosition( this.startPosition )
        this.setNextTile()
    }   

    public getCurrentPosition(): Position{
        return this.position
    }

    public changeCurrentPosition({x,y}:Position ){
        this.player.x = x
        this.player.y = y
        this.setCurrentPosition({x,y})
    }

    public getCurrentTile( ):Tile{
        return map.getTile( this.position )
    }

    public getNextTile(): Tile{
        return this.nextTile
    }

    public direction():directionEnum{
        return this.actualDirection
    }

    public setRequestedDirection( reqDir : directionEnum ){
        if( this.getCurrentTile().type == "TELEPORT") return
        
        let getNeighborTile = map.getNeighborTile(this.getCurrentTile(), reqDir)
        if( getNeighborTile.type == "WALL" || getNeighborTile.type == "DOOR")
            return
        
        this.requestedDirection = reqDir
    }

    public setNextTile( ) {
        if( this.getCurrentTile().type == "TELEPORT"){
            this.actualDirection = this.getCurrentTile().opositeTeleportPosition.x == 0 ? directionEnum.WEST : directionEnum.EAST
            this.nextTile = map.getTile( this.getCurrentTile().opositeTeleportPosition )
        }
        else this.nextTile = map.getNeighborTile( this.getCurrentTile(), this.requestedDirection)
    }

    private setCurrentPosition({ x, y }: Position){
        this.position = {x, y}
    }

    public prepareForNextLevel(){
        this.SPEED = Utils.calculateSpeed()
        this.changeCurrentPosition(this.startPosition)
        this.actualDirection = directionEnum.EAST
        this.requestedDirection = directionEnum.EAST
        this.player.anims.play('pacmanEastAnim', true);
        setTimeout( () =>{
            this.isFree = true;
        }, ENEMY_SPAWN_TIME )
    }

    public update(){

        if(this.isFree){
            this.setCurrentPosition( this.player )
            this.setNextTile()
    
            this.actualDirection = Utils.requestMovementInformation( this )
            this.move()
        }

    }

    public move( ){
        switch(this.actualDirection) {
            case "SOUTH":
                this.player.anims.play('pacmanSouthAnim', true);
                this.player.y+= this.SPEED
            break;
            case "NORTH":
                this.player.anims.play('pacmanNorthAnim', true);
                this.player.y-= this.SPEED
            break;
            case "WEST":
                this.player.anims.play('pacmanWestAnim', true);
                this.player.x-= this.SPEED
    
            break;
            case "EAST":
                this.player.anims.play('pacmanEastAnim', true);
                this.player.x+= this.SPEED
            break;
        }
    }

}