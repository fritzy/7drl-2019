import Component from '../ecs/component';
import Level from '../main';

export interface FloorInterface {
  level: Level
}

export class Floor extends Component {

  _data: FloorInterface;

  constructor(input?: FloorInterface) {
    super(input);
  }
}