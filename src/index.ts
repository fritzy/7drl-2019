import Pixi = require('pixi.js');
//import Tween = require('@tweenjs/tween.js');
/// <reference path="./typings/fritzy__pixi-scene.d.ts" />
import PixiScene = require('@fritzy/pixi-scene');
import Level from './main';

Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST;

const WIDTH: number = 320;
const HEIGHT: number = 200;

export class Game {

  static dimensions = {
    width: WIDTH,
    height: HEIGHT,
    scale: 1,
    ratio: WIDTH / HEIGHT
  };

  app: Pixi.Application; 
  manager: PixiScene.Manager;
  progressCount: number;
  progressTotal: number;
  level: Level;

  constructor(private container: HTMLElement, private loadingEl: HTMLProgressElement, private loadAreaEl: HTMLElement) { 

    this.app = new Pixi.Application({
      resolution: 1,
      ...Game.dimensions
    });

    this.container.appendChild(this.app.view);

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

    window.addEventListener('resize', (e) => {
      this.setSize();
    });

    this.manager = new PixiScene.Manager(this, this.app.stage);

    Pixi.loader.add('./assets/floor.json');
    Pixi.loader.add('./assets/wall.json');
    Pixi.loader.add('./assets/player0.json');
    Pixi.loader.add('./assets/player1.json');
    Pixi.loader.add('wall-0', './assets/bastille-wall-01.png');

    Pixi.loader.load((loader: Pixi.loaders.Loader, resources: Array<Pixi.loaders.Resource>) => {

    });


    Pixi.loader.onProgress.add(this.onProgress.bind(this));
    this.progressCount = 0;
    this.progressTotal = Object.keys(Pixi.loader.resources).length;
  }

  setSize() {
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
    this.app.renderer.view.style.width = `${(Game.dimensions.width * scale / res)}px`;
    this.app.renderer.view.style.height = `${(Game.dimensions.height * scale / res)}px`;

    console.log(`Resolution: ${this.app.renderer.view.style.width} x ${this.app.renderer.view.style.height}`);

    //this.level.scale.set(scale);
    //this.scale = scale;
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
    this.level = new Level(this);
    this.manager.addScene('level', this.level);
    this.setSize();

    this.manager.start();
    this.app.view.style.visibility = 'visible';
    this.loadAreaEl.style.visibility = 'hidden';
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