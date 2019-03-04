import Component from '../ecs/component';
import Three = require('three');

export interface TileInterface {
  walls: Array<Three.Mesh>,
  floor: Array<Three.Mesh>,
  wallDecos: Array<Three.Mesh>,
  position: number,
  cell?: null | number
};

export class Tile extends Component {

  _data: TileInterface;

  constructor(input?: TileInterface) {
    super(input);
  }
}