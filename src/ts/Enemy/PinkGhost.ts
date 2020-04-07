import { Position } from '../game-interfaces/position.interface'
import { Enemy } from './Enemy'
import { Tile } from '../Tile';
import { map, pacman } from '../app'
import { GameMode } from '../game-interfaces/modes.interface';
import { scene } from '../app'

export class PinkGhost extends Enemy {

    constructor( ){
        let position = {x: 475, y: 475 }
        let ghost = scene.physics.add.sprite( position.x, position.y,"ghosts" )
        ghost.type = "Pink"
        ghost.timeToSetFree = 16000
        scene.enemyGroup.add(ghost);
        super( position, ghost )

        let newTile = this.findDestinyTile()
        this.setDestinyTile( newTile )

    }

    public update(){
        let newTile = this.findDestinyTile()
        this.setDestinyTile( newTile )
        super.update()
    }

    private findDestinyTile(): Tile{
        return map.getTile( pacman.getCurrentPosition() )
    }

    private chase(){

    }

    private scatter(){
        console.log( "scatter" )
    }

    
}