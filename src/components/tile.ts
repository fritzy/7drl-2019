import Component from '../ecs/component';
import Pixi = require('pixi.js');

export interface TileInterface {
  walls: Array<Pixi.projection.Sprite2d>,
  floor: Array<Pixi.projection.Sprite2d>,
  wallDecos: Array<Pixi.projection.Sprite2d>,
  position: number
};

export class Tile extends Component {

  _data: TileInterface;

  constructor(input?: TileInterface) {
    super(input);
  }
}