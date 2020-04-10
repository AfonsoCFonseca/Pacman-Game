import { Position } from '../game-interfaces/position.interface'
import { GameMode } from '../game-interfaces/modes.interface'
import { Tile, tileType } from '../Tile'
import { map } from '../app'
import { directionEnum } from '../game-interfaces/direction.interface'
import { Utils } from '../Utils/utils'
import { scene } from '../app'

export abstract class Enemy {
    public SPEED = 3
    protected isFree: boolean = false
    protected timeToSetFree: number | null;
    protected mode: GameMode
    public position: Position
    private destinyTile: Tile 
    protected ghost
    public actualDirection: directionEnum = directionEnum.NORTH
    public requestedDirection: directionEnum
    protected ghostType: string
    protected frightenedTile = map.getRandomAvailableTile( "anywhere" )

    constructor(position: Position, ghost ){
        this.ghost = ghost
        this.mode = GameMode.CHASE
        this.setPosition(position)
        this.ghostType = ghost.type
        this.timeToSetFree = ghost.timeToSetFree
        this.ghost.anims.play(`ghost${this.ghostType}East`) 

        this.update = this.update.bind(this);
        this.setGameMode = this.setGameMode.bind( this )

        scene.events.on('updateEnemy' , this.update )
        scene.events.on('setGameMode' , this.setGameMode )
    }

    getPosition(): Position{
        return this.position
    }

    public setEnemyFree(): void{
        this.isFree = true
    }

    protected setPosition({ x, y }:Position): void{
        this.position = { x, y }
    }

    getCurrentTile():Tile{
        return map.getTile(this.position)
    }

    protected setDestinyTile( tile: Tile ): void{
        this.destinyTile = tile
    }

    getDestinyTile( ): Tile{
        return this.destinyTile 
    }

    protected setGameMode( mode: GameMode ):void{
        this.mode = mode
    }

    public update(){
        this.setPosition(this.ghost)
        
        if( this.isFree ){
            this.findRoute()
            this.actualDirection = Utils.requestMovementInformation( this )
            this.move()  
        } 
        
        if( scene.time.now > this.timeToSetFree && !this.isFree )
            this.setEnemyFree()
        
    }

    private move(){
        switch(this.actualDirection) {
            case "SOUTH":
                this.ghost.anims.play(`ghost${this.ghostType}South`) 
                this.ghost.y+= this.SPEED
            break;
            case "NORTH":
                this.ghost.anims.play(`ghost${this.ghostType}North`) 
                this.ghost.y-= this.SPEED
            break;
            case "WEST":
                this.ghost.anims.play(`ghost${this.ghostType}West`) 
                this.ghost.x-= this.SPEED
            break;
            case "EAST":
                this.ghost.anims.play(`ghost${this.ghostType}East`) 
                this.ghost.x+= this.SPEED
        }

    }

    private findRoute(): directionEnum {

        if( this.mode == GameMode.FRIGHTENED && this.getCurrentTile() == this.frightenedTile ){
            this.frightenedTile = map.getRandomAvailableTile( "anywhere" )
            return
        } 

        let position = this.getCurrentTile().getPosition()
        let destinyTilePosition = this.destinyTile.getPosition() 
        let chosenDirections = this.makePriority( position, destinyTilePosition)
        
        for( var i = 0; i < chosenDirections.length; i++){
            let futureTile = map.getNeighborTile( this.getCurrentTile(), chosenDirections[i])

            if( futureTile.type !== tileType.WALL &&
                chosenDirections[i] !== Utils.opositeDirection(this.actualDirection)){

                    if( futureTile.type === tileType.DOOR && this.actualDirection === "NORTH"){
                            chosenDirections[i] = directionEnum.NORTH

                    }

                this.requestedDirection = chosenDirections[i]
                break

            }
           
            // if( futureTile.type === tileType.DOOR && this.actualDirection === "NORTH"){
            //     chosenDirections[i] = directionEnum.NORTH
            // }
        }
        
        return this.requestedDirection
    }

    private makePriority( {x, y}:Position, destinyTilePosition: Position): directionEnum[]{
        let chosenDirections: directionEnum[] = []
        let xDistance = x - Math.abs(destinyTilePosition.x)
        let yDistance = y - Math.abs(destinyTilePosition.y)
        let mDirArr = [directionEnum.EAST, directionEnum.WEST, directionEnum.NORTH, directionEnum.SOUTH]

        if( xDistance > yDistance){
            chosenDirections.push( x < destinyTilePosition.x ? directionEnum.EAST: directionEnum.WEST)
            chosenDirections.push( y < destinyTilePosition.y ? directionEnum.SOUTH: directionEnum.NORTH)
        }
        else{
            chosenDirections.push( y < destinyTilePosition.y ? directionEnum.SOUTH: directionEnum.NORTH)
            chosenDirections.push( x < destinyTilePosition.x ? directionEnum.EAST: directionEnum.WEST)
        }

        for( var i = 0; i < chosenDirections.length; i++ ){
            for( var j = 0; j < mDirArr.length; j++ ){

                if( mDirArr[j] === chosenDirections[i])
                    mDirArr.splice(j, 1)
                
            }
        }

        mDirArr.forEach( dir => chosenDirections.push( dir ) )

        return chosenDirections
    }

}