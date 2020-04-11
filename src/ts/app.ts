import "phaser";
import { Pacman } from "./Pacman";
import { Map } from "./Map/Map";
import { directionEnum } from "./game-interfaces/direction.interface";
import { GameMode } from "./game-interfaces/modes.interface";
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
import { Game } from "phaser";
import { Fruit } from "./Fruit";

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

export const FRIGHTENED_TIME = 7000;
export const FRIGHTENED_SPEED = 2;
let frigthenedTimer = null;

export const ENEMY_SPAWN_TIME = 4000;
export const ENEMY_SETFREE_TIME = 5000;

export const CENTER_MAP_POSITION = { x: 475, y: 475 };
let pointGUI;

export class GameScene extends Phaser.Scene {
  imageGroup: Phaser.GameObjects.Group;
  pointsGroup: Phaser.Physics.Arcade.StaticGroup;

  powerUpGroup: Phaser.Physics.Arcade.StaticGroup;
  enemyGroup;

  points = 0;
  maxPoints: number;
  logoImage;

  constructor() {
    super({});
    this.enemyCollide = this.enemyCollide.bind(this);
  }

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
    this.load.image("tileImage", "assets/secondTile.png");
    this.load.image("pointImage", "assets/point.png");
    this.load.image("power-up", "assets/power-up.png");
    this.load.image("logo", "assets/Pac-Man_title.png");
    this.load.image("door", "assets/doorTile.png");
    this.load.image("blueDot", "assets/blueDot.png");
    this.load.image("frightened", "assets/frightened.png");

    this.imageGroup = this.add.group();
    this.pointsGroup = this.physics.add.staticGroup();
    this.powerUpGroup = this.physics.add.staticGroup();
    this.enemyGroup = this.add.group();

    scene = this;
  }

  create() {
    this.add.image(window.innerWidth / 2 + 150, 1110, "logo");
    player = this.physics.add.sprite(325, 575, "pacman");
    pointGUI = this.add.text(80, 1160, "Points: 0", {
      fontSize: "30px",
      fill: "#FFFFFF",
    });

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
    console.log(map.getRandomAvailableTile("ANYWHERE"));
    let pos = map.getRandomAvailableTile("ANYWHERE").getPosition();
    let fruit = new Fruit({ x: pos.x * 50, y: pos.y * 50 });

    this.physics.add.overlap(player, this.pointsGroup, this.collectPoint);
    this.physics.add.collider(player, this.enemyGroup, this.enemyCollide);
    this.physics.add.overlap(
      player,
      this.powerUpGroup,
      this.collectPowerUp,
      null,
      this
    );
  }

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
        pacman.setRequestedDirection(
          Utils.findAlternativeWay("long", pacman.getCurrentTile())
        );
      if (pacman.direction() == "NORTH" || pacman.direction() == "SOUTH")
        pacman.setRequestedDirection(
          Utils.findAlternativeWay("lat", pacman.getCurrentTile())
        );
    }
  }

  collectPoint(player, point) {
    let pointOb = point.getData("TileObject");
    pointOb.setTileValue(2);
    this.points++;
    point.disableBody(true, true);

    if (this.points >= this.maxPoints) {
      this.nextLevel();
    }
  }

  collectPowerUp(player, powerUp) {
    this.events.emit("setGameMode", GameMode.FRIGHTENED);
    powerUp.disableBody(true, true);

    if (frigthenedTimer) clearTimeout(frigthenedTimer);
    frigthenedTimer = setTimeout(() => {
      this.events.emit("setGameMode", GameMode.CHASE);
    }, FRIGHTENED_TIME);
  }

  enemyCollide(player, enemy) {
    let enemyObj = enemy.getData("GhostObject");
    if (enemyObj.mode == GameMode.FRIGHTENED) {
      enemyObj.sentToCage(enemy);
    } else {
      this.GameOver();
    }
  }

  keys() {
    if (cursors.left.isDown) pacman.setRequestedDirection(directionEnum.WEST);
    else if (cursors.right.isDown)
      pacman.setRequestedDirection(directionEnum.EAST);
    else if (cursors.up.isDown)
      pacman.setRequestedDirection(directionEnum.NORTH);
    else if (cursors.down.isDown)
      pacman.setRequestedDirection(directionEnum.SOUTH);
  }

  nextLevel() {
    level++;
    console.log("Next Level");
  }

  GameOver() {
    console.log("GAMEOVER");
  }

  drawGui() {
    let pointsText = `Points: ${this.points}`;
    pointGUI.setText(pointsText);
  }
}

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
