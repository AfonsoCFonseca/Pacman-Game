import { Position } from '../game-interfaces/position.interface'
import { Enemy } from './Enemy'
import { Tile, tileType } from '../Tile';
import { map, pacman } from '../app'
import { GameMode } from '../game-interfaces/modes.interface';
import { scene } from '../app'
import { directionEnum } from '../game-interfaces/direction.interface';
import { Utils } from '../Utils/utils'

export class BlueGhost extends Enemy {
    tileFarPosition:Tile
    chaseState: 'far' | 'close'

    constructor( ){
        let position = {x: 526, y: 475 }
        let ghost = scene.physics.add.sprite( position.x, position.y,"ghosts" )

        ghost.type = "Blue"
        ghost.timeToSetFree = 8000
        scene.enemyGroup.add(ghost);
        super( position, ghost )

        this.tileFarPosition = map.getTile({x:75,y:900})
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
        let pacmanPosition = pacman.getCurrentPosition()
        let ghostPosition = this.getPosition()
        let dist = this.distance( pacmanPosition.x, pacmanPosition.y, ghostPosition.x, ghostPosition.y )

        if( dist < 150 )
            this.chaseState = 'far'
        else if( this.getCurrentTile() == this.tileFarPosition )
            this.chaseState = 'close'

        return this.chaseState == 'far' ?  this.tileFarPosition : map.getTile( pacman.getCurrentPosition() )  

    }

    private distance(x1,y1,x2,y2){
        var dx = x1 - x2;
        var dy = y1 - y2;

        return Math.sqrt(dx * dx + dy * dy);
    }

    private scatter(){
        console.log( "scatter" )
    }

    
}