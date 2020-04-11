import { scene, level } from "./app";
import { Utils } from "./Utils/utils";
import { Position } from "./game-interfaces/position.interface";

export class Fruit extends Phaser.GameObjects.Sprite {
  constructor(position: Position) {
    let { x, y } = position;

    let index = Utils.indexForRandomFruit();
    super(scene, x, y, "fruits", index);
    this.setOrigin(0, 0);

    scene.add.existing(this);
  }
}
