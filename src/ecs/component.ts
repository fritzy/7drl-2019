let idIdx = 0;

export interface BaseComponent {
  type?: string,
  entityId?: string,
  componentId?: number
}

export class Component implements BaseComponent {

  type: string;
  entityId: string;
  componentId: number;

  constructor(component?: BaseComponent, entityId?: string) {
    if (component) {
      Object.assign(this, component);
    }
    this.type = this.constructor.name;
    if (entityId) this.entityId = entityId;
    this.componentId = idIdx;
    idIdx++;
  }
}