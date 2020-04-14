import { scene, level } from "./app";
import { Utils } from "./Utils/utils";
import { Position } from "./game-interfaces/position.interface";

export class Fruit extends Phaser.GameObjects.Sprite {
  points: number

  constructor(position: Position) {
    let { x, y } = position;

    let index = indexForRandomFruit();
    super(scene, x, y, "fruits", index);
    this.setOrigin(0, 0);
    this.setDepth(1.1)

    this.setPoints( this.lookAtArray(index) )
    scene.add.existing(this);
    scene.fruitGroup.add( this )
  }

  private setPoints(points:number){
    this.points = points
  }

  public getPoints() : number {
    return this.points
  }

  private lookAtArray( index:number ): number {
    let fruitPoints = [
      100,
      300,
      500,
      700,
      1000,
      2000,
      3000,
      5000
    ]

    return fruitPoints[index]
  }

  
}

function indexForRandomFruit(): number {
  let rnd = Math.floor(Math.random() * 10) + 1;
  let index: number;
  switch (level) {
    case 1:
      return rnd % 2 == 0 ? 0 : 1;
    case 2:
      return rnd % 2 == 0 ? 2 : 3;
    case 3:
      return rnd % 2 == 0 ? 4 : 5;
    case 4:
      return rnd % 2 == 0 ? 6 : 7;
  }
}
