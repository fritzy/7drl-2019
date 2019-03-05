import { Character } from './character';
import { BaseComponent, Component } from '../ecs/component';

export interface HallComponent extends BaseComponent {
  tiles: Array<string>;
  char: Character | null;
}

export class Hall extends Component implements HallComponent {

  tiles: Array<string>;
  char: Character | null;

  constructor(hall?: HallComponent) {
    super(hall);
  }

}
