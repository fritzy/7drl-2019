import System from '../ecs/system';
import ECS from '../ecs';
import Level from '../main';
import Entity from '../ecs/Entity';
import { TileInterface } from '../components/tile';
import Three = require('three');
import { PlaneGeometry, Object3D, RGBADepthPacking, MeshDepthMaterial } from 'three';

export default class HallGen extends System {

  constructor(ecs: ECS) {
    super(ecs)
    this.requiredComponents.add('Floor');
  }


  tick(entity: Entity) {

    const level: Level = entity.components.get('Floor')._data.level;
    const game = level.game;


    const tiles: string[] = [];
    for (let idx = 0; idx < 200; idx++) {

      let cell: null | number = null;
      let lastTile: null | TileInterface = null;

      if (idx > 0) {
        lastTile = this.ecs.entities.get(tiles[idx - 1]).components.get('Tile')._data; 
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

    const wallTex = game.textures.get('wall-0');
    wallTex.minFilter = Three.NearestFilter;
    wallTex.magFilter = Three.NearestFilter;
    const floorAtlasTexture = game.textures.get('floors');
    const floorTex = floorAtlasTexture.clone();
    floorTex.minFilter = Three.NearestFilter;
    floorTex.magFilter = Three.NearestFilter;
    floorTex.repeat.x = ( 16 / floorAtlasTexture.image.width );	
    floorTex.repeat.y = ( 16 / floorAtlasTexture.image.height );
    floorTex.offset.x = ( Math.abs( 16 ) / floorAtlasTexture.image.width );
    floorTex.offset.y = ( Math.abs( 624 - 128 )/ floorAtlasTexture.image.height );
    floorTex.needsUpdate = true;

    const leftBarsTex = game.textures.get('left-bars');
    leftBarsTex.minFilter = Three.NearestFilter;
    leftBarsTex.magFilter = Three.NearestFilter;
    const rightBarsTex = game.textures.get('right-bars');
    rightBarsTex.minFilter = Three.NearestFilter;
    rightBarsTex.magFilter = Three.NearestFilter;


    function makeWall(x: number, y: number, z: number, r?: number, cast?: boolean, recv?: boolean) {
      var geometry = new Three.PlaneGeometry( 16, 32, 2 );
      //var material = new Three.MeshBasicMaterial( {color: 0xffff00, side: Three.DoubleSide} );
      var material = new Three.MeshLambertMaterial({ map : wallTex })
      material.side = Three.DoubleSide;
      var plane = new Three.Mesh( geometry, material );
      plane.geometry.translate( 0, -16, 0 );
      game.scene.add( plane );
      plane.position.set(x, y, z)
      plane.castShadow = !!cast;
      plane.receiveShadow = !!recv;
      if (r) plane.geometry.rotateY(r);
    }

    function makeBars(x: number, y: number, z: number, left:boolean = true) {
      let texture = leftBarsTex;
      if (!left) {
       texture = rightBarsTex;
      }
      var geometry = new Three.PlaneGeometry( 16, 32, 2 );
      //var material = new Three.MeshBasicMaterial( {color: 0xffff00, side: Three.DoubleSide} );
      var material = new Three.MeshLambertMaterial({ map : texture, transparent: true, alphaTest: .1 })
      material.side = Three.DoubleSide;
      var plane = new Three.Mesh( geometry, material );
      plane.geometry.translate( 0, -16, 0 );

      game.scene.add( plane );

      plane.position.set(x, y, z)
      plane.castShadow = false;
      plane.receiveShadow = false;
    }

    function makeFloor(x: number, y: number, z: number) {
      var geometry = new Three.PlaneGeometry( 16, 16, 2);
      //var material = new Three.MeshBasicMaterial( {color: 0xffff00, side: Three.DoubleSide} );
      var material = new Three.MeshLambertMaterial({ map : floorTex })
      material.side = Three.DoubleSide;
      var plane = new Three.Mesh( geometry, material );
      plane.geometry.translate( 0, -8, 0 );
      plane.geometry.rotateX(Math.PI)
      game.scene.add( plane );
      plane.position.set(x, y, z)
      plane.receiveShadow = true;
      plane.geometry.rotateX(Math.PI /2)
    }
    console.log('wall-0', wallTex)
    let idx = 0;
    /*
    for (const tileId of tiles) {
      const tile = this.ecs.entities.get(tileId);
      const tileC = tile.components.get('Tile')._data;

      const ftexture = Pixi.Texture.from('floor-1mm');
      const fsprite = new Pixi.projection.Sprite2d(ftexture);
      fsprite.anchor.set(.5, 1);
      fsprite.scale.set(4, 4);
      fsprite.position.set(idx * fsprite.width, 0);
      layers[0].addChild(fsprite);
      
      if (tileC.cell === 0 || tileC.cell === 1) {
        const fsprite2 = new Pixi.projection.Sprite2d(ftexture);
        fsprite2.anchor.set(.5, 1);
        fsprite2.scale.set(4, 4);
        fsprite2.position.set(idx * fsprite2.width, -fsprite2.height);
        layers[0].addChild(fsprite2);
      }
      idx++;
    }
    */
    idx = 0;
    for (const tileId of tiles) {

      const tile = this.ecs.entities.get(tileId);
      const tileC = tile.components.get('Tile')._data;

      makeFloor(idx * 16, -32, 0)
      /*
      const wtexture = Pixi.Texture.from('wall-0');
      const wsprite = new Pixi.projection.Sprite2d(wtexture);
      wsprite.anchor.set(.5, 1);
      wsprite.scale.set(4, 4);
      wsprite.proj.affine = Pixi.projection.AFFINE.AXIS_X;
      */


      if (tileC.cell !== null) {
        makeWall(idx * 16, 0, -16, 0, false, true);
        makeFloor(idx * 16, -32, -16)
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