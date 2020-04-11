import { Position } from '../game-interfaces/position.interface'
import { Enemy } from './Enemy'
import { Tile } from '../Tile';
import { map, pacman } from '../app'
import { GameMode } from '../game-interfaces/modes.interface';
import { scene } from '../app'

export class RedGhost extends Enemy {

    constructor( ){
        let position = { x: 475, y: 375 }
        let ghost = scene.physics.add.sprite( position.x, position.y,"ghostRedAnim" )
        ghost.type = "Red"
        ghost.timeToSetFree = null
        scene.enemyGroup.add(ghost);
        super( position, ghost )
        this.initialPosition = position
        this.setEnemyFree()

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
                return map.getTile( pacman.getCurrentPosition() )
            case GameMode.FRIGHTENED:
                return this.frightenedTile
            case GameMode.SCATTER:
                return map.getTile( pacman.getCurrentPosition() )
        }
    }

    private chase(){

    }

    private scatter(){
        console.log( "scatter" )
    }

    
}