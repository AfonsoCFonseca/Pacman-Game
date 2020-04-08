import { Position } from '../game-interfaces/position.interface'
import { Enemy } from './Enemy'
import { Tile } from '../Tile';
import { map, pacman } from '../app'
import { GameMode } from '../game-interfaces/modes.interface';
import { scene } from '../app'

export class OrangeGhost extends Enemy {

    constructor( ){
        let position = {x: 425, y: 475 }
        let ghost = scene.physics.add.sprite( position.x, position.y,"ghosts" )
        ghost.type = "Orange"
        ghost.timeToSetFree = 12000
        scene.enemyGroup.add(ghost);
        super( position, ghost)

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