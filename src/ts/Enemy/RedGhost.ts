import { Position } from '../game-interfaces/position.interface'
import { Enemy } from './Enemy'
import { Tile } from '../Tile';
import { map, pacman } from '../app'
import { GameMode } from '../game-interfaces/modes.interface';
import { scene } from '../app'

export class RedGhost extends Enemy {

    constructor( position: Position ){
        let ghost = scene.physics.add.sprite( 75, 75,"ghosts" )
        scene.enemyGroup.add(ghost);
        super( position, ghost )

        let newTile = this.findDestinyTile()
        this.setDestinyTile( newTile )
        
        this.changeGameMode = this.changeGameMode.bind(this);
        scene.events.on('changeGameMode' , this.changeGameMode )

    }

    public update(){
        let newTile = this.findDestinyTile()
        this.setDestinyTile( newTile )
        super.update()
    }

    private findDestinyTile(): Tile{
        return map.getTile( pacman.getCurrentPosition() )
    }

    private changeGameMode( mode: GameMode ){
        this.setGameMode( mode )
        
        switch( mode ){
            case GameMode.CHASE:
                this.chase()
            break;
            case GameMode.FRIGHTENED:
                this.frightened()
            break;
            case GameMode.SCATTER:
                this.scatter()
            break;
        }
    }

    private chase(){

    }

    private scatter(){
        console.log( "scatter" )
    }

    
}