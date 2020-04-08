import { Position } from '../game-interfaces/position.interface'
import { Enemy } from './Enemy'
import { Tile, tileType } from '../Tile';
import { map, pacman } from '../app'
import { GameMode } from '../game-interfaces/modes.interface';
import { scene } from '../app'
import { directionEnum } from '../game-interfaces/direction.interface';
import { Utils } from '../Utils/utils'

export class BlueGhost extends Enemy {

    constructor( ){
        let position = {x: 526, y: 475 }
        let ghost = scene.physics.add.sprite( position.x, position.y,"ghosts" )
        ghost.type = "Blue"
        ghost.timeToSetFree = 8000
        scene.enemyGroup.add(ghost);
        super( position, ghost )

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
        let nextTile: Tile
        switch( this.mode ){
            case GameMode.CHASE:
                nextTile = this.chase()
            case GameMode.FRIGHTENED:
                nextTile = this.frightenedTile
            case GameMode.SCATTER:
                nextTile = map.getTile( pacman.getCurrentPosition() )
        }

        return nextTile
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

        // scene.add.image( 
        //     nextTile.getPosition().x * 50 + 18,
        //     nextTile.getPosition().y * 50 + 18,
        //       "blueDot" ).setOrigin(0,0)

        return nextTile
    }

    private scatter(){
        console.log( "scatter" )
    }

    
}