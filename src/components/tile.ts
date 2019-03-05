import { Component, BaseComponent } from '../ecs/component';
import Three = require('three');

export interface TileComponent extends BaseComponent {
  walls: Array<Three.Mesh>,
  floor: Array<Three.Mesh>,
  wallDecos: Array<Three.Mesh>,
  position: number,
  cell?: null | number
};

export class Tile extends Component implements TileComponent {
  walls: Array<Three.Mesh>;
  floor: Array<Three.Mesh>;
  wallDecos: Array<Three.Mesh>;
  position: number;
  cell: null | number;

  constructor(tile?: TileComponent) {
    super(tile);
  }
}