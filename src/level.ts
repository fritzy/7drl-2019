import Pixi = require('pixi.js');
import { Scene } from '@fritzy/pixi-scene';
import 'pixi-projection';

const playerTile = '1x3';

export default class Level extends Scene {

  walls: Array<Pixi.Sprite>;
  floors: Array<Pixi.Sprite>;
  offset = -Math.PI / 4;
  floor: Pixi.projection.Container2d;
  positionX: number;
  player: Pixi.projection.Sprite2d;
  frameCount: number;
  playerAnim: number;

  constructor(game: any) {
    super(game);
    console.log('start level');

    this.walls = [];
    this.floors = []; 
 
    this.floor = new Pixi.projection.Container2d();
    this.floor.position.set(this.game.app.screen.width / 2, this.game.app.screen.height);
    this.addChild(this.floor);
    this.positionX = 0;
    this.frameCount = 0;
    this.playerAnim = 0;

    for (let idx = -3; idx < 5; idx++) {
      const texture = Pixi.Texture.from('floor-1mm');
      const sprite = new Pixi.projection.Sprite2d(texture);
      console.log('is sprite2d', (sprite instanceof Pixi.projection.Sprite2d));
      sprite.anchor.set(.5, 1);
      //sprite.width = this.game.app.screen.width;
      //sprite.height = this.game.app.screen.height;
      sprite.scale.set(16, 32)

      console.log(sprite.width, sprite.height)
      //sprite.position.set(0, 0)
      sprite.position.set(idx * sprite.width, 0)
      this.floors.push(sprite);
      this.floor.addChild(sprite);
      console.log(sprite);
    }
    for (let idx = -3; idx < 5; idx++) {
      const wall = new Pixi.projection.Sprite2d(Pixi.Texture.from('floor-1s'));
      wall.anchor.set(.5, 1);
      wall.scale.set(16, 32)
      wall.proj.affine = PIXI.projection.AFFINE.AXIS_X;
      wall.position.set(idx * wall.width, -32 * 16)
      this.walls.push(wall)
      this.floor.addChild(wall);
    }

    this.player = new Pixi.projection.Sprite2d(Pixi.Texture.fromFrame(`player0-${playerTile}`))
    this.player.anchor.set(.5, 1);
    this.player.scale.set(12, 12);
    this.player.position.set(0, -200)
    this.player.proj.affine = PIXI.projection.AFFINE.AXIS_X;

    this.floor.addChild(this.player);

    let squareFar = new Pixi.Point(this.game.app.screen.width / 2, this.game.app.screen.height / 2 - 100);
    let pos = this.floor.toLocal(squareFar, undefined, undefined, undefined, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ);
    //need to invert this thing, otherwise we'll have to use scale.y=-1 which is not good
    pos.y = -pos.y;
    pos.x = -pos.x;
    this.floor.proj.setAxisY(pos, -1);


    //this.ceil.proj.setAxisY(new Pixi.Point(0, -288), -1);

    //this.container.proj.setAxisY(new Pixi.Point(this.game.app.screen.width / 2, this.game.app.screen.height), -1);
    console.log(this.game.app.screen.width);
  }

  update(dt: number, du: number) {
    super.update(dt, du);
    this.frameCount += dt;
    if (this.frameCount >= 250) {
      this.frameCount = 0;
      this.playerAnim += 1;
      if (this.playerAnim > 1) {
        this.playerAnim = 0;
      }
      this.player.texture = Pixi.Texture.fromFrame(`player${this.playerAnim}-${playerTile}`);
    }
    this.positionX += 5 * du;
    //this.player.position.y = -Math.abs(Math.cos(this.positionX / 50) * 100);
    //this.floor.position.x = this.positionX;
    //console.log('projection pos', pos)
    for (const sprite of this.floors) {
      sprite.position.x += 5 * du;
      if (sprite.position.x > this.game.app.screen.width) {
        sprite.position.x = -this.game.app.screen.width;
      }
    }
    for (const sprite of this.walls) {
      sprite.position.x += 5 * du;
      if (sprite.position.x > this.game.app.screen.width) {
        sprite.position.x = -this.game.app.screen.width;
      }
    }

  }

}