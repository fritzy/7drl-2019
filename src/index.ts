import Three = require('three');
import { ImageLoader } from 'three';
import Level from './main';

const WIDTH: number = 854;
const HEIGHT: number = 480;

export class Game {

  static dimensions = {
    width: WIDTH,
    height: HEIGHT,
    scale: 1,
    ratio: WIDTH / HEIGHT
  };

  progressCount: number = 0;
  progressTotal: number = 0;
  camera: Three.PerspectiveCamera;
  scene: Three.Scene;
  renderer: Three.WebGLRenderer;
  mesh: Three.Mesh;
  loadList: Array<{name: string, uri: string}> = [];
  images: Map<string, HTMLImageElement> = new Map();
  textures: Map<string, Three.Texture> = new Map();
  imageLoader: Three.ImageLoader = new Three.ImageLoader();
  textureLoader: Three.TextureLoader = new Three.TextureLoader();
  level: Level;
  pointLight: Three.PointLight;
  pointLight2: Three.PointLight;
  plDir: number = 1;
  lastFrame: number = 0;

  constructor(private container: HTMLElement, private loadingEl: HTMLProgressElement, private loadAreaEl: HTMLElement) { 

    this.camera = new Three.PerspectiveCamera( 70, Game.dimensions.ratio, 0.01, 2000 );
    this.camera.position.z = 120;
    this.camera.position.y = 30;
    this.camera.lookAt(0, 0, 0)
 
    this.scene = new Three.Scene();
 
    const geometry = new Three.BoxGeometry( 0.2, 0.2, 0.2 );
    const material = new Three.MeshNormalMaterial();
 
    this.mesh = new Three.Mesh( geometry, material );
    //this.scene.add( this.mesh );
    var light = new Three.AmbientLight( 0x404540 ); // soft white light
    this.scene.add( light );
    this.pointLight = new Three.PointLight( 0xaa7720, 2, 80 );
    this.pointLight.position.set( 0, -9, 32);
    this.pointLight.castShadow = true;
    this.pointLight2 = new Three.PointLight( 0xaa7720, 2, 60 );
    this.pointLight2.position.set( 80, -9, 32 );
    this.scene.add( this.pointLight );
    this.scene.add( this.pointLight2 );
    this.pointLight.shadow.camera.near = 5;
    this.pointLight.shadow.camera.far = 80;
 
    this.renderer = new Three.WebGLRenderer( { antialias: true } );
    this.renderer.shadowMap.enabled = true;
    //this.renderer.shadowMap.type = Three.PCFSoftShadowMap;

    this.renderer.setSize( Game.dimensions.width, Game.dimensions.height );

    this.container.appendChild( this.renderer.domElement );

    this.loadTexture('floors', '/assets/Objects/Floor.png');
    this.loadTexture('player-0', '/assets/Characters/Player0.png');
    this.loadTexture('player-1', '/assets/Characters/Player1.png');
    this.loadTexture('left-bars', '/assets/left-bars.png');
    this.loadTexture('right-bars', '/assets/right-bars.png');
    this.loadTexture('wall-0', '/assets/bastille-wall-01.png');
    this.loadTexture('floor-depth', '/assets/floor-bricks-depth.png');
    this.loadTexture('floor-bricks', '/assets/floor-bricks.png');
    this.load();

    /*this.container.appendChild(this.app.view);

    this.app.view.setAttribute('id', 'gamecanvas');
    Object.assign(this.app.view.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      margin: 'auto',
      visiblity: 'hidden'
    });

    */
    window.addEventListener('resize', (e) => {
      this.setSize();
    });

  }

  loadTexture(name: string, uri:string ) {
    this.loadList.push({ name, uri });
    this.progressTotal++;
  }

  load() {
    for (const imgSet of this.loadList) {
      this.textureLoader.load(imgSet.uri, (img: Three.Texture) => {
        this.textures.set(imgSet.name, img);
        img.minFilter = Three.NearestFilter;
        img.magFilter = Three.NearestFilter;
        this.onProgress();
      }, undefined, (error) => {
        console.log('image dl error')
        console.log(error);
      });
    }
  }

  update(time: number) {

    requestAnimationFrame(this.update.bind(this));
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;
    this.pointLight.position.x += 1 * this.plDir;
    if (this.pointLight.position.x > 16 * 100) {
      this.plDir *= -1;
      this.pointLight.position.x = 16 * 100;
    } else if (this.pointLight.position.x < 0) {
      this.plDir *= -1;
      this.pointLight.position.x = 0;
    }
    //this.pointLight.intensity = Math.random() / 4+ 1.75;
    this.camera.position.x = this.pointLight.position.x + 10;
    this.renderer.render(this.scene, this.camera );
    this.level.update(time, 0, 0);
  }

  setSize() {
    //this.renderer.setSize( window.innerWidth, window.innerHeight );
    const res = 1;
    const width = this.container.clientWidth * res;
    const height = this.container.clientHeight * res;
    this.container.style.margin = 'auto';
    const ratio = width / height;

    let scale = 1;
    let rset = 'SQUARE';

    if (width < height) {
      rset = 'TALL';
    }

    if (ratio < Game.dimensions.ratio) {
      scale = width / Game.dimensions.width;
    } else if (ratio > Game.dimensions.ratio) {
      scale = height / Game.dimensions.height;
    }
    /*
    this.app.renderer.resize(
      WIDTH * scale,
      HEIGHT * scale
    );
    */
    this.renderer.domElement.style.width = `${(Game.dimensions.width * scale / res)}px`;
    this.renderer.domElement.style.height = `${(Game.dimensions.height * scale / res)}px`;
    this.renderer.setSize(Game.dimensions.width, Game.dimensions.height)
    this.renderer.domElement.style.width = `${(Game.dimensions.width * scale / res)}px`;
    this.renderer.domElement.style.height = `${(Game.dimensions.height * scale / res)}px`;

    console.log(`Resolution: ${this.renderer.domElement.style.width} x ${this.renderer.domElement.style.height}`);
  }

  onProgress() {

    this.progressCount++;
    const perc = this.progressCount / this.progressTotal * 100;

    this.loadingEl.value = perc;
    this.loadingEl.textContent = `Loading ... ${perc.toFixed(0)}%`;
    if (this.progressCount === this.progressTotal) {
      this.startGame();
    }
  }

  startGame() {
    console.log('starting game');
    this.loadAreaEl.style.visibility = 'hidden';
    this.container.removeChild(this.loadAreaEl)
    this.setSize();
    this.level = new Level(this);
    this.lastFrame = performance.now();
    this.update(this.lastFrame);
  }

}

declare global {
    interface Window { 
        game: Game;
    }
}

window.game = new Game(
  document.getElementById('container'),
  <HTMLProgressElement> document.getElementById('loading'),
  document.getElementById('loadArea')
);