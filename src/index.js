

import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import EndScreen from './scenes/EndScreen'
import PreloadScene from './scenes/PreloadScene';
import PauseScene from './scenes/PauseScene';

const WIDTH = 500;
const HEIGHT = 700;
const PLAYER_POSITION = {x: WIDTH / 2, y: HEIGHT * 0.9 };

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: PLAYER_POSITION
}

const Scenes = [PreloadScene, GameScene, EndScreen, PauseScene];
const createScene = Scene => new Scene(SHARED_CONFIG)
const initScenes = () => Scenes.map(createScene)

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    }
  },
  scene: initScenes()
}
new Phaser.Game(config);
