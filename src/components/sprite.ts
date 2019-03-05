import { Component, BaseComponent } from '../ecs/component';
import Three = require('three');

export interface SpriteComponent extends BaseComponent {
  sprite: Three.Mesh;
}

export class Sprite extends Component implements SpriteComponent {

  sprite: Three.Mesh;

  constructor(sprite?: SpriteComponent) {
    super(sprite);
  }

}