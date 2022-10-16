import "phaser";
import { Pacman } from "./Pacman";
import { Map } from "./Map/Map";
import { directionEnum } from "./game-interfaces/direction.interface";
import { GameMode } from "./game-interfaces/modes.interface";
import { Position } from "./game-interfaces/position.interface";
import { RedGhost } from "./Enemy/RedGhost";
import { BlueGhost } from "./Enemy/BlueGhost";
import { PinkGhost } from "./Enemy/PinkGhost";
import { OrangeGhost } from "./Enemy/OrangeGhost";
import { Enemy } from "./Enemy/Enemy";
import {
  pacmanAnimInit,
  ghostsAnimInit,
  tweenMovement,
} from "./Utils/animations";
import { Utils } from "./Utils/utils";
import { Tile, fruit } from "./Tile";

export let scene;
export let map: Map;
let cursors;
let player;
export let pacman: Pacman;
export let redGhost: Enemy;
let pinkGhost: Enemy;
let blueGhost: Enemy;
let orangeGhost: Enemy;

export let level = 1;
export const SPEED = 3;
export let points = 0;
export const FRIGHTENED_TIME = 7000;
let frigthenedTimer = null;
export let SCATTER_TIMER = 12000
export let SCATTER_DURATION = 6000

let btnRetry
let backgroundMenu 

export const ENEMY_SPAWN_TIME = 4000;
export const ENEMY_SETFREE_TIME = 5000;

const FRUIT_SPAWN_TIMER = 3000 //20000
const FRUIT_TIME = 10000
let isFruit =false
let shouldFruitSpawn = true
let fruitTile:Tile
let previousTileValue: number

export const CENTER_MAP_POSITION = { x: 475, y: 475 };
let pointGUI;
let levelGUI

export class GameScene extends Phaser.Scene {
  imageGroup: Phaser.GameObjects.Group;
  menuGameOver:  Phaser.GameObjects.Group;
  pointsGroup: Phaser.Physics.Arcade.StaticGroup;
  powerUpGroup: Phaser.Physics.Arcade.StaticGroup;
  fruitGroup: Phaser.Physics.Arcade.StaticGroup;
  enemyGroup;
  maxDots = 0;
  dots = 0;

  logoImage;

  constructor() {
    super({});
    this.enemyCollide = this.enemyCollide.bind(this);
    this.fruitSpawner = this.fruitSpawner.bind(this);
    this.collectPowerUp = this.collectPowerUp.bind(this);
    this.collectPoint = this.collectPoint.bind(this);
  }

  //****************** PRELOAD  ******************/
  preload() {
    this.load.spritesheet("pacman", "assets/pacmanSpriteSheet.png", {
      frameWidth: 50,
      frameHeight: 50,
    });
    this.load.spritesheet("ghosts", "assets/ghosts.png", {
      frameWidth: 50,
      frameHeight: 50,
    });
    this.load.spritesheet("fruits", "assets/fruits.png", {
      frameWidth: 50,
      frameHeight: 50,
    });
    this.load.image("tileImage1", "assets/firstTile.png");
    this.load.image("tileImage2", "assets/secondTile.png");
    this.load.image("tileImage3", "assets/thirdTile.png");
    this.load.image("tileImage4", "assets/forthTile.png");
    this.load.image("pointImage", "assets/point.png");
    this.load.image("power-up", "assets/power-up.png");
    this.load.image("logo", "assets/Pac-Man_title.png");
    this.load.image("door", "assets/doorTile.png");
    this.load.image("blueDot", "assets/blueDot.png");
    this.load.image("frightened", "assets/frightened.png");
    this.load.image("GameoverBackground", "assets/gameoverBackground.png")
    this.load.image("GameoverButton", "assets/gameoverButton.png")

    this.menuGameOver = this.add.group()
    this.imageGroup = this.add.group();
    this.pointsGroup = this.physics.add.staticGroup();
    this.powerUpGroup = this.physics.add.staticGroup();
    this.fruitGroup = this.physics.add.staticGroup();
    this.enemyGroup = this.add.group();

    scene = this;
  }

  //************************************ CREATE  ************************************/
  create() {
    player = this.physics.add.sprite(325, 575, "pacman")
    pointGUI = this.add.text(80, 1200, "Points: 0", {font: "30px",color: "#FFFFFF"});
    levelGUI = this.add.text(80, 1160, "Level: 1", {font: "30px",color: "#FFFFFF"});
    

    // gameScene.add.text( { font: "65px Arial", align: "center" }).setDepth(2).setOrigin(0.5, 0);
    
    cursors = this.input.keyboard.createCursorKeys();

    pacmanAnimInit();
    ghostsAnimInit();

    map = new Map();
    pacman = new Pacman(player);
    redGhost = new RedGhost();
    pinkGhost = new PinkGhost();
    blueGhost = new BlueGhost();
    orangeGhost = new OrangeGhost();
    this.enemyGroup.enableBody = true;

    this.physics.add.overlap(player, this.pointsGroup, this.collectPoint);
    this.physics.add.collider(player, this.enemyGroup, this.enemyCollide);
    this.physics.add.overlap(player, this.fruitGroup, this.fruitCollide, null, this );
    this.physics.add.overlap(
      player,
      this.powerUpGroup,
      this.collectPowerUp,
      null,
      this
    );

    this.fruitSpawner()

    this.add.image(map.MAP_WIDTH / 2, 1110, "logo");
  }

  //************************************ UPDATE & BOUNDARIES  ************************************/
  update() {
    this.keys();

    pacman.update();
    this.boundaries();

    this.events.emit("updateEnemy");

    this.drawGui();
  }

  boundaries() {
    let nextTile = pacman.getNextTile();
    if (nextTile.type == "WALL" || nextTile.type === "DOOR") {
      if (pacman.direction() == "EAST" || pacman.direction() == "WEST")
        pacman.setRequestedDirection( Utils.findAlternativeWay("long", pacman.getCurrentTile()) );
      if (pacman.direction() == "NORTH" || pacman.direction() == "SOUTH")
        pacman.setRequestedDirection( Utils.findAlternativeWay("lat", pacman.getCurrentTile()) );
    }
  }

  //************************************ FRUIT SPAWNER  ************************************/
  fruitSpawner(){
    let self = this

      if(!isFruit ){
        setTimeout(() =>{
          
            if( shouldFruitSpawn ){
                fruitTile = map.getRandomAvailableTile("ANYWHERE")
                previousTileValue = fruitTile.getTileValue()
        
                fruitTile.setTileValue(5)
                isFruit = true
            }
            self.fruitSpawner()

        }, FRUIT_SPAWN_TIMER ) 
      }
      else{
        setTimeout(() =>{
          if( shouldFruitSpawn ){
                fruitTile.setTileValue(2)
                isFruit = false
                if( fruitTile.fruit ) fruitTile.fruit.destroy()
                
          }
          self.fruitSpawner()

        }, FRUIT_TIME )
      }
   
  }

  //************************************ COLLISIONS  ************************************/
  collectPoint(player, point) {
    points += 10
    let pointOb = point.getData("TileObject");
    pointOb.setTileValue(2);
    this.dots++;
    point.disableBody(true, true);

    if (this.dots >= this.maxDots) {
      this.nextLevel();
    }
  }

  collectPowerUp(player, powerUp) {
    points += 20
    this.events.emit("setGameMode", GameMode.FRIGHTENED);
    powerUp.disableBody(true, true);

    if (frigthenedTimer) clearTimeout(frigthenedTimer);
    frigthenedTimer = setTimeout(() => {
      this.events.emit("setGameMode", GameMode.CHASE);
    }, FRIGHTENED_TIME);
  }

  fruitCollide( player, fruit ){
    points += fruit.getPoints()
    fruit.destroy()  
  }

  enemyCollide(player, enemy) {
    let enemyObj = enemy.getData("GhostObject");
    if (enemyObj.mode == GameMode.FRIGHTENED) {
      enemyObj.sentToCage(enemy);
    }
    else{
      if( pacman.isFree ) 
        this.GameOver()
    }
  }

  //************************************ KEYS  ************************************/
  keys() {
    if (cursors.left.isDown) pacman.setRequestedDirection(directionEnum.WEST);
    else if (cursors.right.isDown)
      pacman.setRequestedDirection(directionEnum.EAST);
    else if (cursors.up.isDown)
      pacman.setRequestedDirection(directionEnum.NORTH);
    else if (cursors.down.isDown)
      pacman.setRequestedDirection(directionEnum.SOUTH);
  }

  //************************************ GAME STATES ************************************/
  nextLevel() {
    level++;
    this.stopGame()
    this.restart()
  }

  GameOver() {
    level = 1
    this.stopGame()
    this.drawGameOverScreen()
  }

  stopGame(){
    redGhost.freeze()
    pinkGhost.freeze()
    blueGhost.freeze()
    orangeGhost.freeze()
    pacman.isFree = false
    shouldFruitSpawn = false
    if( fruit != null ) fruit.destroy()
  }

  restart(){
    //POINTS & MAP
    points = 0
    this.maxDots = 0
    this.dots = 0
    map.destroy()
    map = new Map()
    //PLAYER RESET
    pacman.prepareForNextLevel()
    //ENEMIES REST
    redGhost.prepareNextLevel()
    pinkGhost.prepareNextLevel()
    blueGhost.prepareNextLevel()
    orangeGhost.prepareNextLevel()

    //FRUITS
    isFruit = false
    shouldFruitSpawn = true

    this.scene.resume();
  }

  //************************************ DRAWERS  ************************************/
  drawGui() {
    let pointsText = `Points: ${points}`;
    pointGUI.setText(pointsText);
    let levelText = `Level: ${level}`;
    levelGUI.setText(levelText);
  }

  drawGameOverScreen(){
    let self = this 
    const MENU_GAMEOVER_WIDTH = 600
    const MENU_GAMEOVER_HEIGHT = 350
    const BUTTON_GAMEOVER_WIDTH = 326
    const BUTTON_GAMEOVER_HEIGHT = 78
    
    backgroundMenu = this.add.image( 
      (map.MAP_WIDTH / 2) - (MENU_GAMEOVER_WIDTH / 2), 
      (map.MAP_HEIGHT / 2) - (MENU_GAMEOVER_HEIGHT/ 2), 
      "GameoverBackground" ).setOrigin(0,0)

      btnRetry = this.add.image( 
      (map.MAP_WIDTH / 2) - (BUTTON_GAMEOVER_WIDTH / 2), 
      (map.MAP_HEIGHT / 2) + (BUTTON_GAMEOVER_HEIGHT / 2), 
      "GameoverButton" ).setOrigin(0,0)
    btnRetry.setInteractive( { useHandCursor: true  } );
    btnRetry.setInteractive( { useHandCursor: true  } );
    btnRetry.on('pointerdown', () =>{
      
      btnRetry.destroy();
      btnRetry = null;
      backgroundMenu.destroy();
      backgroundMenu = null;
      self.restart( ) 

    } )

    btnRetry.setDepth(1);
    backgroundMenu.setDepth(1); 
  }
}
//************************************ CONFIG ************************************/
var config = {
  type: Phaser.AUTO,
  width: "150%",
  height: "180%",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: GameScene,
};

export let game = new Phaser.Game(config);
