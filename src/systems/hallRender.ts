import System from '../ecs/system';
import ECS from '../ecs';
import Entity from '../ecs/Entity';
import { Hall } from '../components/hall';

export default class HallRenderer extends System {

  requiredComponents = new Set(['Hall']);

  tick(entity: Entity) {

    const hall: Hall = entity.components.get('Hall');
    //hall._data.hallContainer.position.x -= 2;
  }

}