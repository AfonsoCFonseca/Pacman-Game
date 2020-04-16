import { Position } from '../game-interfaces/position.interface'
import { Enemy } from './Enemy'
import { Tile } from '../Tile';
import { map, pacman, ENEMY_SPAWN_TIME } from '../app'
import { GameMode } from '../game-interfaces/modes.interface';
import { scene } from '../app'
import { Utils } from '../Utils/utils';

export class RedGhost extends Enemy {
    private scatterPosition

    constructor( ){
        let position = { x: 475, y: 375 }
        let ghost = scene.physics.add.sprite( position.x, position.y,"ghostRedAnim" )
        ghost.type = "Red"
        ghost.timeToSetFree = ENEMY_SPAWN_TIME
        scene.enemyGroup.add(ghost);
        super( position, ghost )
        this.initialPosition = position
        this.scatterPosition = {x:2,y:2}


        // let newTile = this.findDestinyTile()
        // this.setDestinyTile( newTile )

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
                return map.getTile( pacman.getCurrentPosition() )
            case GameMode.FRIGHTENED:
                return this.frightenedTile
            case GameMode.SCATTER:
                return map.getTile( this.scatterPosition, 'index' )
        }
    }
    
}