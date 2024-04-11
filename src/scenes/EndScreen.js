
import BaseScene from './BaseScene';

class EndScreen extends BaseScene {

  constructor(config) {
    super('EndScreen', {...config, canGoBack: false});

    this.menu = [
      {scene: 'GameScene', text: 'Restart'},
    ]
  } 

  init(data) {
    this.score = data.score;
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));

    const bestScore = localStorage.getItem('bestScore');
    this.add.text(this.config.width / 2, 0, `Best Score: ${bestScore || 0}`, this.fontOptions)
      .setOrigin(0.5,0)
    this.add.text(this.config.width / 2, 42, `Score: ${this.score}`, this.fontOptions)
    .setOrigin(0.5,0)
  }

  setupMenuEvents(menuItem) {
    const textGO = menuItem.textGO;
    textGO.setInteractive();

    textGO.on('pointerover', () => {
      textGO.setStyle({fill: '#ff0'});
    })

    textGO.on('pointerout', () => {
      textGO.setStyle({fill: '#fff'});
    })

    textGO.on('pointerup', () => {
      this.scene.start('GameScene');
    })
  }
}

export default EndScreen;