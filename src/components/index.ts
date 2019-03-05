import { Hall }  from './hall';
import { Tile, TileComponent }  from './tile';
import { Floor } from './floor'
import { Character } from './character';
import { Sprite } from './sprite';
import { Component } from '../ecs/component';

export * from './hall';
export * from './tile';
export * from './floor';
export * from './character';
export * from './sprite';


export const Components: { [index: string]: typeof Component } = {
  Hall,
  Tile,
  Floor,
  Character,
  Sprite
};
