import "phaser"
import { Pacman } from './Pacman'
import { Map } from './Map'

export let map
let cursors;
let player;
let pacman;

class GameScene extends Phaser.Scene {
    constructor(){
        super({})
    }

    preload(){
        this.load.image('pacman', 'assets/pacman.png');
    }

    create(){
        player = this.physics.add.sprite(100, 350, 'pacman');

        cursors = this.input.keyboard.createCursorKeys();

        map = new Map( this )
        pacman = new Pacman( player )
       
    }

    update(){

        keys()
        boundaries()

        pacman.setCurrentPosition({ 
            x: parseInt( player.x ), 
            y: parseInt( player.y ) 
        })
        pacman.getCurrentTile()
    }

}

function boundaries(){
    let x = parseInt( player.x )
    let y = parseInt( player.y )

    if( x < 0 || x > 500 )
        player.setVelocityX(0);
}

function keys(){

    if (cursors.left.isDown ){
        player.setVelocityY(0);
        player.setVelocityX(-160);
    }
    else if (cursors.right.isDown ){
        player.setVelocityY(0);
        player.setVelocityX(160);
    }
    else if (cursors.up.isDown){
        player.setVelocityX(0);
        player.setVelocityY(-160);
    }
    else if (cursors.down.isDown){
        player.setVelocityX(0);
        player.setVelocityY(160);
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