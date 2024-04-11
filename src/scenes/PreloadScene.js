import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene {

  constructor() {
    super('PreloadScene');
  }

  //preloading BackGround and pause button
  preload() {
    this.load.image('sky', 'assets/Sky.jpg');
    this.load.image('pause', 'assets/pause.png');
  }

  create() {
    this.scene.start('GameScene');
  }
}

export default PreloadScene;