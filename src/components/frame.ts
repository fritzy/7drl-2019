import { Component, BaseComponent } from '../ecs/component';

export interface FrameComponent extends BaseComponent {
  dt: number,
  du: number,
  time: number
}

export class Frame extends Component implements FrameComponent {

  dt: number;
  du: number;
  time: number;

  constructor(character?: FrameComponent) {
    super(character);
  }

}