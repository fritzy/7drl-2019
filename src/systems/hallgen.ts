import System from '../ecs/system';
import ECS from '../ecs';
import Pixi = require('pixi.js');
import Level from '../main';
import Entity from '../ecs/Entity';

export default class HallGen extends System {

  constructor(ecs: ECS) {
    super(ecs)
    this.requiredComponents.add('Floor');
  }

  tick(entity: Entity) {

    const level: Level = entity.components.get('Floor')._data.level;
    const game = level.game;

    const floor = new Pixi.projection.Container2d();
    const hallContainer = new Pixi.projection.Container2d();
    floor.addChild(hallContainer);
    floor.position.set(game.app.screen.width / 2, game.app.screen.height);
    level.addChild(floor);

    const tiles = [];
    for (let idx = 0; idx < 30; idx++) {
      const wtexture = Pixi.Texture.from('wall-0');
      const wsprite = new Pixi.projection.Sprite2d(wtexture);
      wsprite.anchor.set(.5, 1);
      wsprite.scale.set(4, 4);
      wsprite.proj.affine = Pixi.projection.AFFINE.AXIS_X;
      wsprite.position.set(idx * wsprite.width, -32 * 4);
      hallContainer.addChild(wsprite);

      const ftexture = Pixi.Texture.from('floor-1mm');
      const fsprite = new Pixi.projection.Sprite2d(ftexture);
      fsprite.anchor.set(.5, 1);
      fsprite.scale.set(4, 4);
      fsprite.position.set(idx * fsprite.width, 0);
      hallContainer.addChild(fsprite)

      const fsprite2 = new Pixi.projection.Sprite2d(ftexture);
      fsprite2.anchor.set(.5, 1);
      fsprite2.scale.set(4, 4);
      fsprite2.position.set(idx * fsprite2.width, -fsprite2.height);
      hallContainer.addChild(fsprite2)

      const tileId = this.ecs.createEntity({
        Tile: {
          walls: [wsprite],
          floor: [fsprite, fsprite2],
          wallDecos: [],
          position: idx
        }
      });
      tiles.push(tileId);
    }

    let squareFar = new Pixi.Point(game.app.screen.width / 2, game.app.screen.height / 2 - 100);
    let pos = floor.toLocal(squareFar, undefined, undefined, undefined, PIXI.projection.TRANSFORM_STEP.BEFORE_PROJ);
    //need to invert this thing, otherwise we'll have to use scale.y=-1 which is not good
    pos.y = -pos.y;
    pos.x = -pos.x;
    floor.proj.setAxisY(pos, -1);
    const hallId = this.ecs.createEntity({
      Hall: {
        tiles: tiles,
        char: null,
        floor: floor,
        hallContainer: hallContainer
      }
    });

  }

}