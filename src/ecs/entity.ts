import Component from './component';
import ECS from '.';

export default class Entity {

  components: Map<string, Component>;
  id: number;
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
      const component = this.ecs.components.get(key);
      const instance = new component(definition[key]);
      this.addComponent(instance);
    }
  }

  addComponents(components: Array<Component>) {
    for (const component of components) {
      this.addComponent(component);
    }
  }

  addComponent(component: Component) {

    const cName = component.constructor.name;
    const cProxy = new Proxy(component, {
      get: (target: Component, p: string | number | symbol, receiver: any ) => {

        return target._data[p];
      },
      set: (target: Component, p: string | number | symbol, value: any, receiver: any): boolean => {

        if (component.hasOwnProperty(p)) {
          target._data[p] = value;
          return true;
        }
        return false;
      }
    });
    const components = this.components.set(cName, component);
    //remove this entity from the systems entity target cache
    this.ecs.unmapEntity(this.id);
  }

  removeComponent(name: string) {
    this.components.delete(name);
    //remove this entity from the systems entity target cache
    this.ecs.unmapEntity(this.id);
  }

  serialize() {
  }

}