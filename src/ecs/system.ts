import Entity from './entity';
import ECS from '.';

export default class System {

  requiredComponents: Set<string>;
  entityCache: Set<Entity>;
  ecs: ECS;

  constructor(ecs: ECS) {
    this.ecs = ecs;
    this.requiredComponents = new Set();
  }

  tick(entity: Entity) {

  }

}