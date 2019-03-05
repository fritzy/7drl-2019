import Three = require('three');
import ECS from '../ecs';

export interface GraphicsInterface {
  textureAtlas(name: string, atlas: Three.Texture | string, x: number, y: number, w: number, h: number): Three.Texture;
  sprite(texture: Three.Texture | string, x: number, y: number, z: number, options?: Three.MeshStandardMaterialParameters, cast?: boolean, recv?: boolean, w?: number, h?: number): Three.Mesh;
}

export const Graphics = (ecs: ECS): GraphicsInterface => {

  const floor = ecs.entities.get('floor');
  const level = floor.components.get('Floor').level;
  const game = level.game;

  return {

    textureAtlas: function textureAtlas(name: string, atlas: Three.Texture | string, x: number, y: number, w: number, h: number): Three.Texture {
      let atlasTex: Three.Texture;
      if (typeof atlas === 'string') {
        atlasTex = game.textures.get(atlas)
      } else {
        atlasTex = atlas;
      }
      const texture = atlasTex.clone();
      texture.minFilter = Three.NearestFilter;
      texture.magFilter = Three.NearestFilter;
      texture.repeat.x = ( w / atlasTex.image.width );	
      texture.repeat.y = ( h / atlasTex.image.height );
      texture.offset.x = ( Math.abs( w ) / atlasTex.image.width );
      texture.offset.y = ( Math.abs( atlasTex.image.height - w )/ atlasTex.image.height );
      texture.needsUpdate = true;
      return texture;
    },

    sprite: function sprite(texture: Three.Texture | string, x: number, y: number, z: number, options?: Three.MeshStandardMaterialParameters, cast?: boolean, recv?: boolean, w?: number, h?: number): Three.Mesh {
      let map: Three.Texture;
      if (typeof texture === 'string') {
        map = game.textures.get(texture);
      } else {
        map = texture;
      }
      if (!w) w = map.image.width;
      if (!h) h = map.image.height;
      const geometry = new Three.PlaneGeometry( w, h, 2, 2 );
      options = Object.assign({
        map: map,
        metalness: 0,
        roughness: 1
      }, options);
      const material = new Three.MeshStandardMaterial(options);
      material.side = Three.DoubleSide;
      const plane = new Three.Mesh( geometry, material );
      plane.geometry.translate( 0, -h / 2, 0 );;
      game.scene.add( plane );
      plane.position.set(x, y, z)
      plane.castShadow = cast;
      plane.receiveShadow = recv;
      return plane;
    }
  }
}


