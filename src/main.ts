import ECS from './ecs';
import { Components, Floor } from './components';
import HallGen from './systems/hallgen';
import HallRenderer from './systems/hallRender';
import { Game } from '.';
import { Frame } from './components/frame';
import Entity from './ecs/entity';


export default class Level  {

  ecs: ECS;
  genHall: HallGen;
  hallRenderer: HallRenderer;
  floorEntity: Entity;

  constructor(public game: Game) {
    console.log('loading game...')
    this.ecs = new ECS();
    for (const component of Object.values(Components)) {
      console.log(component)
      this.ecs.registerComponent(component);
    }

    const floor = new Floor({
      level: this,
      camera: game.camera,
      halls: [],
      frame: new Frame({
        dt: 0,
        du: 0,
        time: 0
      })
    });
    console.log(floor.type)

    this.ecs.createEntity({ Floor: floor }, 'floor');
    this.floorEntity = this.ecs.entities.get('floor'); 

    this.genHall = new HallGen(this.ecs);
    //this.hallRenderer = new HallRenderer(this.ecs);

    console.log('gen hall', this.genHall)
    this.ecs.addSystem('startLevel', this.genHall);
    this.ecs.runSystemGroup('startLevel');
    //this.ecs.addSystem('animation', this.hallRenderer);

  }

  update(time: number, dt: number, du: number) {
    const frame = this.floorEntity.components.get('Floor').frame;
    frame.dt = dt;
    frame.du = du;
    frame.time = time;
  }


}