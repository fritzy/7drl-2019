import System from '../ecs/system';
import ECS from '../ecs';
import Level from '../main';
import Entity from '../ecs/Entity';
import { Tile } from '../components/tile';
import Three = require('three');
import { PlaneGeometry, Object3D, RGBADepthPacking, MeshDepthMaterial } from 'three';
import { Graphics, GraphicsInterface } from '../utils/graphics';
import { Character } from '../components/character';

export default class HallGen extends System {


  constructor(ecs: ECS) {
    super(ecs)
    this.requiredComponents.add('Floor');
  }


  tick(entity: Entity) {

    console.log('tick for hallgen')

    const level: Level = entity.components.get('Floor').level;
    const game = level.game;

    const graphics = Graphics(this.ecs);

    const tiles: string[] = [];

    const charTex = graphics.textureAtlas('x', 'player-0', 48, 16, 16, 16); 
    graphics.sprite(charTex, 200, -16, 16, { transparent: true }, false, false, 16, 16)

    this.ecs.createEntity({
      Character: new Character({
        tileX: 3,
        texture: null
      })
    });

    for (let idx = 0; idx < 200; idx++) {

      let cell: null | number = null;
      let lastTile: null | Tile = null;

      if (idx > 0) {
        lastTile = this.ecs.entities.get(tiles[idx - 1]).components.get('Tile'); 
      }

      if (lastTile !== null && lastTile.cell === 0) {
        cell = 1;
      }
      
      if (cell === null && lastTile !== null && lastTile.cell !== 1 && Math.floor(Math.random() * 4) === 0) {
        cell = 0;
      }

      const tileId = this.ecs.createEntity({
        Tile: {
          walls: [],
          floor: [],
          wallDecos: [],
          position: idx,
          cell
        }
      });
      tiles.push(tileId);
    }

    function makeWall(x: number, y: number, z: number, r?: number, cast?: boolean, recv?: boolean) {
      const plane = graphics.sprite('wall-0', x, y, z, undefined, cast, recv)
      if (r) plane.geometry.rotateY(r);
    }

    function makeBars(x: number, y: number, z: number, left:boolean = true) {
      let plane;
      if (left) {
        plane = graphics.sprite('left-bars', x, y, z, {
          transparent: true,
          metalness: .2,
          roughness: .5,
        });
      } else {
        plane = graphics.sprite('right-bars', x, y, z, {
          transparent: true,
          metalness: .2,
          roughness: .5,
        });
      }
    }

    function makeFloor(x: number, y: number, z: number) {
      const plane = graphics.sprite('floor-bricks', x, y, z, {
      }, false, true);
      plane.geometry.rotateX(Math.PI /2)

    }
    let idx = 0;
    for (const tileId of tiles) {

      const tile = this.ecs.entities.get(tileId);
      const tileC = tile.components.get('Tile');

      makeFloor(idx * 16, -32, 16)
      makeFloor(idx * 16, -32, 32)

      if (tileC.cell !== null) {
        makeWall(idx * 16, 0, -16, 0, false, true);
        makeFloor(idx * 16, -32, 0)
      } else {
        makeWall(idx * 16, 0, 0, 0, true,  false);
      }
      if (tileC.cell === 0) {
        makeWall(idx * 16 - 8, 0, -8, Math.PI / 2, false, true)
        makeBars(idx * 16, 0, 0, true);
      } else if (tileC.cell === 1) {
        makeWall(idx * 16 + 8, 0, -8, Math.PI / 2, false, true)
        makeBars(idx * 16, 0, 0, false);
      }
      idx++;
    }
     

    /*
    const hallId = this.ecs.createEntity({
      Hall: {
        tiles: tiles,
        char: null,
        floor: floor,
        hallContainer: hallContainer
      }
    });
    */

  }

}