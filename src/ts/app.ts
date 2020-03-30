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
        //this.load.image('pacman', 'assets/pacman.png');
        this.load.spritesheet('pacman', 'assets/pacmanSpriteSheet.png', { frameWidth: 50, frameHeight: 50 });
    }

    create(){
        player = this.physics.add.sprite(100, 350, 'pacman');

        cursors = this.input.keyboard.createCursorKeys();

        map = new Map( this )
        pacman = new Pacman( player )
       
        this.anims.create({
            frames: this.anims.generateFrameNumbers('pacman', { start: 0, end: 3 }),
            key: 'pacmanEastAnim',
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            frames: this.anims.generateFrameNumbers('pacman', { start: 10, end: 12 }),
            key: 'pacmanWestAnim',
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
        player.anims.play('pacmanWestAnim', true);
        player.setVelocityY(0);
        player.setVelocityX(-160);
    }
    else if (cursors.right.isDown ){
        player.anims.play('pacmanEastAnim', true);
        player.setVelocityY(0);
        player.setVelocityX(160);
    }
    else if (cursors.up.isDown){
        player.anims.play('pacmanNorthAnim', true);
        player.setVelocityX(0);
        player.setVelocityY(-160);
    }
    else if (cursors.down.isDown){
        player.anims.play('pacmanSouthAnim', true);
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