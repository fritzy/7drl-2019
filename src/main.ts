import ECS from './ecs';
import { Components, FloorInterface} from './components';
import HallGen from './systems/hallgen';
import HallRenderer from './systems/hallRender';
import { Game } from '.';


export default class Level  {

  ecs: ECS;
  genHall: HallGen;
  hallRenderer: HallRenderer;

  constructor(public game: Game) {
    console.log('loading game...')
    this.ecs = new ECS();
    for (const component of Object.values(Components)) {
      this.ecs.registerComponent(component);
    }


    const floorDef: FloorInterface = {
      level: this
    };
    this.ecs.createEntity({ Floor: floorDef });

    this.genHall = new HallGen(this.ecs);
    //this.hallRenderer = new HallRenderer(this.ecs);

    this.ecs.addSystem('startLevel', this.genHall);
    this.ecs.runSystemGroup('startLevel');
    //this.ecs.addSystem('animation', this.hallRenderer);

  }

  update(dt: number, du: number) {
    this.ecs.runSystemGroup('animation');
  }


}