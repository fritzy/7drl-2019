import Component from '../ecs/component';
import Character from './character';
import Entity from '../ecs/entity';

export interface HallInterface {
  /*
  tiles: Array<Entity>;
  char: Character | null;
  floor: Pixi.projection.Container2d;
  hallContainer: Pixi.projection.Container2d;
  layers: Array<Pixi.projection.Container2d>;
  */

}

export class Hall extends Component {

  _data: HallInterface;

  constructor(input?: HallInterface) {
    super(input);
  }
}
