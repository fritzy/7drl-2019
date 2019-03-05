import Level from '../main';
import Three = require('three');
import { Hall } from './hall';
import { Component , BaseComponent } from '../ecs/component';
import { Frame } from './frame';

export interface FloorComponent extends BaseComponent {
  level: Level,
  camera: Three.Camera,
  halls: Array<Hall>,
  frame: Frame
}

export class Floor extends Component implements FloorComponent {
  level: Level;
  camera: Three.Camera;
  halls: Array<Hall>;
  frame: Frame;

  constructor(floor?: FloorComponent) {
    console.log('typeof floor', floor instanceof Floor)
    if (floor instanceof Floor) {
      throw new Error()
    }
    super(floor);
  }
}
