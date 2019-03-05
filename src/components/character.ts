import { Component, BaseComponent } from '../ecs/component';

export interface CharacterComponent extends BaseComponent {
  tileX: number;
  texture: string;
}

export class Character extends Component implements CharacterComponent {

  tileX: number;
  texture: string;

  constructor(character?: CharacterComponent) {
    super(character);
  }

}