import "phaser"
import { Pacman } from './Pacman'
import { Map } from './Map'
import { directionEnum } from './game-interfaces/direction.interface'

export let map: Map
let cursors;
let player;
let pacman: Pacman;

export const MAP_X = 0;
export const MAP_Y = 100

// let nextTileGUI
// let currentTileGUI
let pointGUI

class GameScene extends Phaser.Scene {
    imageGroup: Phaser.GameObjects.Group
    pointsGroup: Phaser.Physics.Arcade.StaticGroup
    points = 0; 
    maxPoints: number
    logoImage

    constructor(){
        super({})
    }

    preload(){
        this.load.spritesheet('pacman', 'assets/pacmanSpriteSheet.png', { frameWidth: 50, frameHeight: 50 });
        this.load.image( 'tileImage', 'assets/secondTile.png' )
        this.load.image( 'pointImage', 'assets/point.png' )
        this.load.image( 'logo', 'assets/Pac-Man_title.png' )

        this.imageGroup = this.add.group();
        this.pointsGroup = this.physics.add.staticGroup();

    }

    create(){
        this.add.image( window.innerWidth/2 + 150,1110, 'logo')
        player = this.physics.add.sprite(325,575, 'pacman');
        pointGUI = this.add.text( 80,1160, "Points: 0", { fontSize: '30px', fill: '#FFFFFF' })

        cursors = this.input.keyboard.createCursorKeys();

        map = new Map( this )
        pacman = new Pacman( player )

        this.physics.add.overlap( player, this.pointsGroup, this.collectPoint, null, this )
       
        this.anims.create({
            frames: this.anims.generateFrameNumbers('pacman', { start: 1, end: 3 }),
            key: 'pacmanEastAnim',
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            frames: this.anims.generateFrameNumbers('pacman', { start: 4, end: 6 }),
            key: 'pacmanNorthAnim',
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            frames: this.anims.generateFrameNumbers('pacman', { start: 7, end: 9 }),
            key: 'pacmanSouthAnim',
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            frames: this.anims.generateFrameNumbers('pacman', { start: 10, end: 12 }),
            key: 'pacmanWestAnim',
            frameRate: 10,
            repeat: -1
        });

    }

    update(){  

        this.keys()

        pacman.update()
        this.boundaries()

        // this.develop()
        this.drawGui()

    }

    // develop(){

    //     let nextTile = `${ pacman.getNextTile().getPosition().x }, ${ pacman.getNextTile().getPosition().y }`
    //     let currentTile = `${ pacman.getCurrentTile().getPosition().x }, ${ pacman.getCurrentTile().getPosition().y }`

    //     nextTileGUI.setText( "Next Tile: "+nextTile )
    //     currentTileGUI.setText( "Current Tile: "+currentTile )

    // }

    boundaries(){

        if( pacman.getNextTile().type == "WALL" ){
            if( pacman.direction() == "EAST" || pacman.direction() == "WEST" )
                pacman.findAlternativeWay("long")
            if( pacman.direction() == "NORTH" || pacman.direction() == "SOUTH" )
                pacman.findAlternativeWay("lat")
        }
    
    }

    collectPoint( player, point ){
        
        let pointOb = point.getData('TileObject')
        pointOb.setTileValue(2)
        this.points++
        point.disableBody( true, true )

        if( this.points >= this.maxPoints ){
            this.nextLevel()
        }
    }
    
    keys(){
    
        if (cursors.left.isDown ){
            pacman.setRequestedDirection(directionEnum.WEST)
        }
        else if (cursors.right.isDown ){
            pacman.setRequestedDirection(directionEnum.EAST)
        }
        else if (cursors.up.isDown){
            pacman.setRequestedDirection(directionEnum.NORTH)
        }
        else if (cursors.down.isDown){
            pacman.setRequestedDirection(directionEnum.SOUTH)
        }
    
    }

    nextLevel(){
        console.log( "Next Level")
    }


    drawGui(){
        let pointsText = `Points: ${this.points}`
        pointGUI.setText( pointsText )
    }

}

var config = {
    type: Phaser.AUTO,
    width: '150%',
    height: '180%',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: GameScene
}

var game = new Phaser.Game(config);