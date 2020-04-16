import { Position } from "../game-interfaces/position.interface";
import { GameMode } from "../game-interfaces/modes.interface";
import { Tile, tileType } from "../Tile";
import { map, redGhost } from "../app";
import { directionEnum } from "../game-interfaces/direction.interface";
import { Utils } from "../Utils/utils";
import {
  scene,
  ENEMY_SPAWN_TIME,
  CENTER_MAP_POSITION,
  ENEMY_SETFREE_TIME,
  SCATTER_TIMER,
  SCATTER_DURATION 
} from "../app";
import { tweenMovement } from "../Utils/animations";
import { Game } from "phaser";

export abstract class Enemy {
  public SPEED = 3;
  public isFree: boolean = false;
  protected timeToSetFree: number | null;
  protected mode: GameMode = GameMode.CHASE;
  public position: Position;
  private destinyTile: Tile;
  public ghost;
  public actualDirection: directionEnum = directionEnum.NORTH;
  public requestedDirection: directionEnum;
  protected ghostType: string;
  protected frightenedTile = map.getRandomAvailableTile("ANYWHERE");
  protected initialPosition: Position;

  constructor(position: Position, ghost) {
    this.ghost = ghost;
    this.mode = GameMode.CHASE;
    this.setPosition(position);
    this.ghostType = ghost.type;
    this.timeToSetFree = ghost.timeToSetFree;
    this.ghost.anims.play(`ghost${this.ghostType}East`);
    this.ghost.setDepth(1);
    this.scatterCount()

    this.update = this.update.bind(this);
    this.setGameMode = this.setGameMode.bind(this);

    ghost.setData("GhostObject", this);

    scene.events.on("updateEnemy", this.update);
    scene.events.on("setGameMode", this.setGameMode);
  }

  getPosition(): Position {
    return this.position;
  }

  public changeCurrentPosition({x,y}: Position){
    this.ghost.body.x = x
    this.ghost.body.y = y
  }

  public setEnemyFree(): void {
    this.isFree = true;
    this.setGameMode( GameMode.CHASE)
  }

  protected setPosition({ x, y }: Position): void {
    this.position = { x, y };
  }

  public getCurrentTile(): Tile {
    return map.getTile(this.position);
  }

  protected setDestinyTile(tile: Tile): void {
    this.destinyTile = tile;
  }

  getDestinyTile(): Tile {
    return this.destinyTile;
  }

  protected setGameMode(mode: GameMode): void {

    if (this.isFree) {
      if (mode == GameMode.CHASE) {
        this.SPEED = Utils.calculateSpeed();
      } else if (mode == GameMode.FRIGHTENED) {
        this.SPEED = Math.round( this.SPEED / 2); 
      }
      this.mode = mode;
    }
    
  }

  public update() {
    this.setPosition(this.ghost);

    if (this.isFree) {
      this.findRoute();
      this.actualDirection = Utils.requestMovementInformation(this);
      this.move();
    }

    if (scene.time.now > this.timeToSetFree && !this.isFree){
      this.setEnemyFree();
    }
  }
  
  public freeze(){
    this.timeToSetFree = 999999
    this.isFree = false
  }

  private scatterCount(){
    let self = this 
    setTimeout(()=>{
        if( this.mode == GameMode.CHASE ){
          self.setGameMode(GameMode.SCATTER)

          setTimeout(()=>{
            console.log( "....", this.mode )
            if( self.mode == GameMode.SCATTER ){
              self.setGameMode(GameMode.CHASE)
            }
            self.scatterCount()
          }, SCATTER_DURATION)

        }
      }, SCATTER_TIMER)

  }

  private move() {
    let animationName: string;
    if( this.ghost.type == "red" ) {
      console.log( this.mode )
    }
    switch (this.actualDirection) {
      case "SOUTH":
        animationName = "South";
        this.ghost.y += this.SPEED;
        break;
      case "NORTH":
        animationName = "North";
        this.ghost.y -= this.SPEED;
        break;
      case "WEST":
        animationName = "West";
        this.ghost.x -= this.SPEED;
        break;
      case "EAST":
        animationName = "East";
        this.ghost.x += this.SPEED;
    }
    console.log ( this.mode)
    if (this.mode == GameMode.FRIGHTENED) animationName = "frigthenedAnim";
    else animationName = `ghost${this.ghostType}${animationName}`;

    this.ghost.anims.play(animationName);
  }

  private findRoute(): directionEnum {
    if ( this.mode == GameMode.FRIGHTENED && this.getCurrentTile() == this.frightenedTile) {
      this.frightenedTile = map.getRandomAvailableTile("ANYWHERE");
      return;
    }

    let position = this.getCurrentTile().getPosition();
    let destinyTilePosition = this.destinyTile.getPosition();
    let chosenDirections = this.makePriority(position, destinyTilePosition);

    for (var i = 0; i < chosenDirections.length; i++) {
      let futureTile = map.getNeighborTile( this.getCurrentTile(), chosenDirections[i] );

      if (
        futureTile.type !== tileType.WALL &&
        chosenDirections[i] !== Utils.opositeDirection(this.actualDirection)
      ) {
        if (
          futureTile.type === tileType.DOOR &&
          this.actualDirection === "NORTH"
        ) {
          chosenDirections[i] = directionEnum.NORTH;
        }

        this.requestedDirection = chosenDirections[i];
        break;
      }
    }

    return this.requestedDirection;
  }

  private makePriority({ x, y }: Position, destinyTilePosition: Position): directionEnum[] {
    let chosenDirections: directionEnum[] = [];
    let xDistance = x - Math.abs(destinyTilePosition.x);
    let yDistance = y - Math.abs(destinyTilePosition.y);
    let mDirArr = [
      directionEnum.EAST,
      directionEnum.WEST,
      directionEnum.NORTH,
      directionEnum.SOUTH,
    ];

    if (xDistance > yDistance) {
      chosenDirections.push(
        x < destinyTilePosition.x ? directionEnum.EAST : directionEnum.WEST
      );
      chosenDirections.push(
        y < destinyTilePosition.y ? directionEnum.SOUTH : directionEnum.NORTH
      );
    } else {
      chosenDirections.push(
        y < destinyTilePosition.y ? directionEnum.SOUTH : directionEnum.NORTH
      );
      chosenDirections.push(
        x < destinyTilePosition.x ? directionEnum.EAST : directionEnum.WEST
      );
    }

    for (var i = 0; i < chosenDirections.length; i++) {
      for (var j = 0; j < mDirArr.length; j++) {
        if (mDirArr[j] === chosenDirections[i]) mDirArr.splice(j, 1);
      }
    }

    mDirArr.forEach((dir) => chosenDirections.push(dir));

    return chosenDirections;
  }

  public sentToCage(enemySprite) {
    enemySprite.disableBody(false, true);
    this.timeToSetFree = scene.time.now + ENEMY_SPAWN_TIME;
    this.setGameMode(GameMode.CHASE);
    this.isFree = false;
    let self = this;

    let image = scene.add.image(self.position.x, self.position.y, "frightened");
    tweenMovement(image, () => {
      image.destroy();
      this.ghost.x = CENTER_MAP_POSITION.x;
      this.ghost.y = CENTER_MAP_POSITION.y;
      enemySprite.body.moves = true;
      enemySprite.visible = true;
      this.ghost.anims.play(`ghost${this.ghostType}East`);
    });

    setTimeout(() => {
      enemySprite.enableBody();
      self.isFree = true;
    }, ENEMY_SPAWN_TIME);
  }

  public prepareNextLevel(){
    this.SPEED = Utils.calculateSpeed()
    this.ghost.anims.play(`ghost${this.ghostType}East`);
    this.setGameMode(GameMode.CHASE);
    this.timeToSetFree = scene.time.now + this.ghost.timeToSetFree;
    this.ghost.x = this.initialPosition.x
    this.ghost.y = this.initialPosition.y
  }

}
