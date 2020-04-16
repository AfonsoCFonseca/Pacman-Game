import { Enemy } from './Enemy'
import { Tile } from '../Tile';
import { map, pacman } from '../app'
import { GameMode } from '../game-interfaces/modes.interface';
import { scene, ENEMY_SETFREE_TIME } from '../app'

export class BlueGhost extends Enemy {
    private scatterPosition

    constructor( ){
        let position = {x: 525, y: 475 }
        let ghost = scene.physics.add.sprite( position.x, position.y,"ghosts" )

        ghost.type = "Blue"
        ghost.timeToSetFree = ENEMY_SETFREE_TIME * 2
        scene.enemyGroup.add(ghost);
        super( position, ghost )
        this.initialPosition = position
        this.scatterPosition = {x:2,y:18}
        
        let newTile = this.findDestinyTile()
        this.setDestinyTile( newTile )
    }

    public update(){

        if( this.isFree ){
            let newTile = this.findDestinyTile()
            this.setDestinyTile( newTile )
        } 
        super.update()
    }

    private findDestinyTile(): Tile{

        switch( this.mode ){
            case GameMode.CHASE:
                return this.chase()
            case GameMode.FRIGHTENED:
                return this.frightenedTile
            case GameMode.SCATTER:
                return map.getTile( this.scatterPosition, 'index' )
        }

    }

    private diferenceBetween( source:number, target:number ):number{
        return Math.abs( target - source )
    }
    

    private chase():Tile{
        let x,y: number
        let pacmanPosition = pacman.getCurrentPosition()
        let redPosition = {x:100,y:100}
        let distanceX = this.diferenceBetween( redPosition.x, pacmanPosition.x )
        let distanceY = this.diferenceBetween( redPosition.y, pacmanPosition.y )

        if( redPosition.x >= pacmanPosition.x)
            distanceX = -distanceX
            
        if( redPosition.y >= pacmanPosition.y )
            distanceY = -distanceY

        x = pacmanPosition.x + distanceX
        y = pacmanPosition.y + distanceY

        if( x >= map.MAP_WIDTH - 50 )
            x = map.MAP_WIDTH - 50
        else if( x <= 0 ) x = 100

        if( y >= map.MAP_HEIGHT - 50 )
             y = map.MAP_HEIGHT - 50
        else if( y <= 0 ) y = 100

        return map.getTile({x,y}, "position")
    }

}