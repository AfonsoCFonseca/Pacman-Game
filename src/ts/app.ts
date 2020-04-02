import "phaser"
import { Pacman } from './Pacman'
import { Map } from './Map'
import { directionEnum } from './game-interfaces/direction.interface'

export let map: Map
let cursors;
let player;
let pacman: Pacman;

let nextTileGUI
let currentTileGUI

class GameScene extends Phaser.Scene {
    imageGroup: Phaser.GameObjects.Group

    constructor(){
        super({})
    }

    preload(){
        this.load.spritesheet('pacman', 'assets/pacmanSpriteSheet.png', { frameWidth: 50, frameHeight: 50 });
        this.load.image( 'tileImage', 'assets/secondTile.png' )

        this.imageGroup = this.add.group();

    }

    create(){
        player = this.physics.add.sprite(325,575, 'pacman');

        cursors = this.input.keyboard.createCursorKeys();

        map = new Map( this )
        pacman = new Pacman( player )
       
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

        let nextTile = `${ pacman.getNextTile().getPosition().x }, ${ pacman.getNextTile().getPosition().y }`
        let currentTile = `${ pacman.getCurrentTile().getPosition().x }, ${ pacman.getCurrentTile().getPosition().y }`

        nextTileGUI = this.add.text( 1000, 80, "Next Tile: "+ nextTile, { fontSize: '20px', fill: '#FFFFFF' });
        currentTileGUI = this.add.text( 1000, 120, "Current Tile: "+ currentTile, { fontSize: '20px', fill: '#FFFFFF' });
    }

    update(){  

        this.keys()

        pacman.update()
        this.boundaries()

        this.develop()

    }

    develop(){

        let nextTile = `${ pacman.getNextTile().getPosition().x }, ${ pacman.getNextTile().getPosition().y }`
        let currentTile = `${ pacman.getCurrentTile().getPosition().x }, ${ pacman.getCurrentTile().getPosition().y }`

        nextTileGUI.setText( "Next Tile: "+nextTile )
        currentTileGUI.setText( "Current Tile: "+currentTile )

    }

    boundaries(){

        if( pacman.getNextTile().type == "WALL" ){
            if( pacman.direction() == "EAST" || pacman.direction() == "WEST" )
                pacman.findAlternativeWay("long")
            if( pacman.direction() == "NORTH" || pacman.direction() == "SOUTH" )
                pacman.findAlternativeWay("lat")
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