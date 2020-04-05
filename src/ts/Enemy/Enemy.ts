import { Position } from '../game-interfaces/position.interface'
import { GameMode } from '../game-interfaces/modes.interface'
import { Tile, tileType } from '../Tile'
import { map } from '../app'
import { directionEnum } from '../game-interfaces/direction.interface'
import { requestMovementInformation } from '../Utils/utils'

export abstract class Enemy {
    public SPEED = 3
    private mode: GameMode
    public position: Position
    private destinyTile: Tile 
    protected ghost
    public actualDirection: directionEnum = directionEnum.EAST
    public requestedDirection: directionEnum

    constructor({ x, y }, ghost ){
        this.ghost = ghost
        this.mode = GameMode.CHASE
        this.setPosition({ x, y })
    }

    getPosition(): Position{
        return this.position
    }

    protected setPosition({ x, y }:Position){
        this.position = { x, y }
    }

    getCurrentTile(){
        return map.getTile(this.position)
    }

    protected setDestinyTile( tile: Tile ){
        this.destinyTile = tile
    }

    getDestinyTile( ): Tile{
        return this.destinyTile 
    }

    protected setGameMode( mode: GameMode ){
        this.mode = mode
    }

    protected frightened(){
        
    }

    public update(){
        this.setPosition(this.ghost)
        this.findRoute()
        
        this.actualDirection = requestMovementInformation( this )
        this.move()
    }

    private move(){

        switch(this.actualDirection) {
            case "SOUTH":
                this.ghost.anims.play('ghostRedSouth') 
                this.ghost.y+= this.SPEED
            break;
            case "NORTH":
                this.ghost.anims.play('ghostRedNorth') 
                this.ghost.y-= this.SPEED
            break;
            case "WEST":
                this.ghost.anims.play('ghostRedWest') 
                this.ghost.x-= this.SPEED
            break;
            case "EAST":
                this.ghost.anims.play('ghostRedEast') 
                this.ghost.x+= this.SPEED
            break;
        }
    }

    private findRoute(): directionEnum {
        let chosenDirections: directionEnum[] = []
        let { x, y } = this.getCurrentTile().getPosition()
        let destinyTilePosition = this.destinyTile.getPosition() 

        chosenDirections.push( x < destinyTilePosition.x ? directionEnum.EAST: directionEnum.WEST)
        chosenDirections.push( y < destinyTilePosition.y ? directionEnum.SOUTH: directionEnum.NORTH)

        for( var i = 0; i < chosenDirections.length; i++){
            let futureTile = map.getNeighborTile( this.getCurrentTile(), chosenDirections[i])
            if( futureTile.type !== tileType.WALL ){
                this.requestedDirection = chosenDirections[i]
                break
            }
        }

        return this.requestedDirection
    }

}