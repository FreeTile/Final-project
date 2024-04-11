import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene {

  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.image('sky', 'assets/Sky.jpg');
    this.load.spritesheet('player', 'assets/Idle.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('platform', 'assets/Platform.png');
    this.load.image('pause', 'assets/pause.png');
  }

  create() {
    this.scene.start('GameScene');
  }
}

export default PreloadScene;