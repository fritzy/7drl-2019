import Entity from './entity';
import Component from './component';
import System from './system';

export default class ECS {

  entities: Map<string, Entity>;
  systems: Map<string, Array<System>>;
  components: Map<string, typeof Component>;
  entityIdx: number = 0;

  //set of entity ids that have been identified as a target for each system
  systemEntities: Map<System, Set<string>>;
  //set of entity ids that haven't yet been mapped as system targets
  unmappedEntities: Set<string>;

  constructor() {
    this.entities = new Map();
    this.systems = new Map();
    this.components = new Map()
    this.systemEntities = new Map();
    this.unmappedEntities = new Set();
  }

  createEntity(definition: { [index:string]: any }): string {
    const entity = new Entity(this, definition);
    this.addEntity(entity);
    this.unmappedEntities.add(entity.id);
    return entity.id;
  }

  addEntity(entity: Entity, name?: string) {
    if (!name) {
      name = `${this.entityIdx}`;
      this.entityIdx++;
    }
    this.entities.set(name, entity);
    entity.id = name;
  }

  addSystem(group: string, system: System) {
    if (!this.systems.has(group)) {
      this.systems.set(group, []);
    }
    const systems = this.systems.get(group);
    systems.push(system);
    system.ecs = this;
    this.systemEntities.set(system, new Set());
  }

  runSystemGroup(group: string) {
    this.mapEntities();
    const systems = this.systems.get(group);
    if (!systems) return;
    for (const system of systems) {
      for (const entityId of this.systemEntities.get(system)) {
        system.tick(this.entities.get(entityId));
      }
    }
  }

  //remove entity from all system lists of entities that they operate on
  unmapEntity(id: string) {
    if (!this.entities.has(id)) return;
    for (const entitySet of this.systemEntities.values()) {
      entitySet.delete(id);
    }
    this.unmappedEntities.add(id);
  }

  //discover which entities each system can operate on
  mapEntities() {
    for (const entityId of this.unmappedEntities) {
      const entity = this.entities.get(entityId);
      for (const systemSet of this.systems.values()) {
        for (const system of systemSet) {
          let match = true;
          for (const componentName of system.requiredComponents) {
            if (!entity.components.has(componentName)) {
              match = false;
              break;
            }
          }
          if (match) {
            this.systemEntities.get(system).add(entityId);
          }
        }
      }
      this.unmappedEntities.delete(entityId);
    }
  }

  registerComponent(component: typeof Component) {
    this.components.set(component.name, component)
  }

}