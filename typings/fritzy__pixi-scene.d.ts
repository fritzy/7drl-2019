declare module '@fritzy/pixi-scene' {

  import Pixi = require('pixi.js');

  class Game {
    app: Pixi.Application;
    manager: PixiScene.Manager;
    progressCount: number;
    progressTotal: number;

    constructor(container: HTMLElement, loadingEl: HTMLProgressElement, loadingAreaEl: HTMLElement);
    setSize(): void;
    onProgress(): void;
    startGame(): void;
  }

  namespace PixiScene {

    class Scene extends Pixi.Container {
      game: Game;
      constructor(game: Game);
      standUp(): void;
      tearDown(): void;
      update(dt: number, du: number): void;
    }

    class Manager {
      scene: Scene;
      sceneList: Array<Scene>;
      stage: Pixi.Container;

      constructor(game: Game, parent: Pixi.Container);
      addScene(name: string, scene: Scene): void;
      removeScene(name: string): void;
      start(): void;
      pause(): void;
      unpause(): void;
      togglePause(): void;
      update(ts: number): void;
    }
  }

  export = PixiScene;
}
