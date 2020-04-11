import { Position } from '../game-interfaces/position.interface'
import { Enemy } from './Enemy'
import { Tile,tileType } from '../Tile';
import { map, pacman } from '../app'
import { GameMode } from '../game-interfaces/modes.interface';
import { scene,ENEMY_SETFREE_TIME } from '../app'
import { Utils } from '../Utils/utils'

export class PinkGhost extends Enemy {

    constructor( ){
        let position = {x: 475, y: 475 }
        let ghost = scene.physics.add.sprite( position.x, position.y,"ghosts" )
        ghost.type = "Pink"
        ghost.timeToSetFree = ENEMY_SETFREE_TIME * 3
        scene.enemyGroup.add(ghost);
        super( position, ghost )
        this.initialPosition = position

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
                return map.getTile( pacman.getCurrentPosition() )
        }
    }

    private chase():Tile{
        let pacmanTile = map.getTile( pacman.getCurrentPosition() )
        let pacmanDirection = pacman.actualDirection
        let nextTile = map.getNeighborTile(pacmanTile,pacmanDirection)
        let previousTile = pacmanTile

        for( var i = 0;i < 2; i++ ){
            do{
                let randDir = Utils.getRandomDir()
                nextTile = map.getNeighborTile(previousTile,randDir)
            }while( nextTile.type != tileType.EMPTY && nextTile.type != tileType.POINT )
            previousTile = nextTile
        }

        return nextTile
    }

    private scatter(){
        console.log( "scatter" )
    }

    
}