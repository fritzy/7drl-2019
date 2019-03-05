import ECS from '.';

export default class Entity {

  components: Map<string, any>;
  id: string;
  ecs: ECS;

  constructor(ecs: ECS, definition?: { [index: string]: any}) {
    this.ecs = ecs;
    this.components = new Map();
    if (definition) {
      this.setComponents(definition);
    }
  }

  setComponents(definition: { [index: string]: any}) {
    for (const key of Object.keys(definition)) {
      const component = this.ecs.componentTypes.get(key);
      let instance = definition[key];
      if (!(instance instanceof component)) {
        instance = new component(definition[key]);
      }
      this.addComponent(instance);
    }
  }

  addComponents(components: Array<any>) {
    for (const component of components) {
      this.addComponent(component);
    }
  }

  addComponent(component: any) {
    const name = component.type;
    this.components.set(name, component);
    component.entityId = this.id;
    //remove this entity from the systems entity target cache
    this.ecs.unmapEntity(this.id);
  }

  removeComponent(name: string) {
    this.components.delete(name);
    //remove this entity from the systems entity target cache
    this.ecs.unmapEntity(this.id);
  }

  destroy() {
    this.ecs.destroyEntity(this.id);
  }

  serialize() {
  }

}