import { Hall } from './hall';
import { Tile } from './tile';
import { Floor } from './floor'
import Component from '../ecs/component';

export * from './hall';
export * from './tile';
export * from './floor';


export const Components: { [index: string]: typeof Component } = {
  Hall,
  Tile,
  Floor
};
