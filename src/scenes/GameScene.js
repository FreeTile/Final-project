
import BaseScene from './BaseScene';

const PLATFORMS_TO_RENDER = 6;

class GameScene extends BaseScene {

  constructor(config) {
    super('GameScene', config);

    this.player = null;
    this.platforms = null;

    this.platformHorizontalDistance = [175, 225];
    this.platformVerticalDistanceRange = [150, 200];
    this.platformHorizontalDistanceRange = [100, 150];
    this.jumpVelocity = 600;

    this.score = 0;
    this.scoreText = '';
    this.scoreToIncrease = 0;
    this.platformVelocity =150;

    this.doubleJump = true;
  }

  preload() {
    this.load.image('sky', 'assets/Sky.png');
    this.load.spritesheet('player', 'assets/Idle.png', { frameWidth: 32, frameHeight: 32,startFrame: 0, endFrame: 10 });
    this.load.spritesheet('run', 'assets/Run.png', { frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 21 });
    this.load.image('Platform', 'assets/Platform.png');
    this.load.image ("Wall", 'assets/Walls.png');
  }

  create() {
    super.create();
    this.createAnimation();
    this.createPlayer();
    this.createPlatforms();
    this.createFloor();
    this.createWalls();
    this.createColliders();
    this.createScore();
    this.handleInputs();
    this.createPause();
  }

  update() {
    this.checkGameStatus();
    this.recyclePlatforms();
    this.move();
    this.updateSpeed();
    this.listenToEvents();
  }


  createBG() {
    this.add.image(-400, 0, 'sky').setOrigin(0);
  }

  createScore() {
    this.score = 0;
    const bestScore = localStorage.getItem('bestScore');
    this.scoreText = this.add.text(this.config.width*0.02, this.config.height*0.02, `Score: ${0}`, { fontSize: '32px', fill: '#000'});
    this.add.text(this.config.width*0.02, this.config.height*0.07, `Best score : ${bestScore ||0}`, {fontSize: '18px', fill: '#000'});
  }


  createAnimation(){

    this.anims.create({
      key: 'idle',
      frames:  this.anims.generateFrameNumbers('player', { start: 0, end: 10 }),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('run', { start: 12, end: 21 }),
      frameRate: 10,
      repeat: -1
    });
  }

  createPlayer() {
    this.player = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'player', 0).setOrigin(0);
    this.player.body.gravity.y = 1300;
    this.player.setScale(1.5);
    this.player.setCollideWorldBounds(true);
    this.player.anims.play('idle', true);

    const colliderWidth = this.player.width * 0.6;
    const colliderHeight = this.player.height * 0.9;
    const offsetX = (this.player.width - colliderWidth) / 2;
    const offsetY = 0;
    this.player.body.setSize(colliderWidth, colliderHeight, offsetX, offsetY);
  }

  createWalls(){
    this.LWall = this.physics.add.sprite(-32,0, 'Wall').setOrigin(0,0).setImmovable();
    this.RWall = this.physics.add.sprite(this.config.width-32, 0, 'Wall').setOrigin(0,0).setImmovable();
    this.physics.add.collider(this.player, this.LWall);
    this.physics.add.collider(this.player, this.RWall);
  }

  createFloor(){
    this.floor = this.physics.add.sprite(0, this.config.height-16, 'Platform')
    .setImmovable(true)
    .setOrigin(0, 0)
    .setScale(2);
    this.physics.add.collider(this.player, this.floor);
  }

  updateSpeed(){
    if (this.scoreToIncrease == 10){
      this.platformVelocity += 10;
      this.platforms.setVelocityY(this.platformVelocity);
      this.scoreToIncrease = 0;
    }
  }
  
  createPlatforms() {
    this.platforms = this.physics.add.group();

    for (let i = 0; i < PLATFORMS_TO_RENDER; i++) {
      const leftPlatform = this.platforms.create(0, 0, 'Platform')
        .setImmovable(true)
        .setOrigin(0, 0);
      const rightPlatform = this.platforms.create(0, 0, 'Platform')
        .setImmovable(true)
        .setOrigin(-1, 0);

      this.placePlatform(leftPlatform, rightPlatform)
    }

    this.platforms.setVelocityY(this.platformVelocity);
  }

  createColliders() {
    this.physics.add.collider(this.player, this.platforms);
  }

  handleInputs() {
    this.leftKeyDown = false;
    this.rightKeyDown = false;
    this.downKeyDown = false;

    this.input.keyboard.on('keydown_W', () => { this.jumpKeyDown = true; }, this);
    this.input.keyboard.on('keydown_A', () => { this.leftKeyDown = true; }, this);
    this.input.keyboard.on('keydown_D', () => { this.rightKeyDown = true; }, this);
    this.input.keyboard.on('keydown_S', () => { this.downKeyDown = true; }, this);

    this.input.keyboard.on('keyup_A', () => { this.leftKeyDown = false; }, this);
    this.input.keyboard.on('keyup_D', () => { this.rightKeyDown = false; }, this);
    this.input.keyboard.on('keyup_S', () => { this.downKeyDown = false; }, this);
  }

  move(){
    if (this.leftKeyDown) {
      this.Left();
    } 
    if (this.rightKeyDown) {
      this.Right();
    } 
    if (this.downKeyDown) 
    {
      this.Drop();
    }
    if(!this.rightKeyDown & !this.leftKeyDown & !this.downKeyDown){
      this.Stop();
    }

    if(this.player.body.touching.down){
      this.player.body.gravity.y = 1300;
    }

    if (this.jumpKeyDown) {
      this.Jump();
      this.jumpKeyDown = false;
    }
  }
  checkGameStatus() {
    if (this.player.getBounds().bottom >= this.config.height || this.player.y <= 0) {
      this.gameOver();
    }
  }

  placePlatform(LPlatform, RPlatform) {
    const UpMostY = this.getUpMostPlatform();
    const platformHorisontalPosition = Phaser.Math.Between(-450, -100);
    const platformVerticalDistance = Phaser.Math.Between(...this.platformVerticalDistanceRange);
    const platformHorizontalDistance = Phaser.Math.Between(...this.platformHorizontalDistanceRange);

    LPlatform.x = platformHorisontalPosition;
    LPlatform.y = UpMostY - platformVerticalDistance;

    RPlatform.x = LPlatform.x + platformHorizontalDistance;
    RPlatform.y = LPlatform.y;
  }

  recyclePlatforms() {
    const tempPlatforms = [];
    this.platforms.getChildren().forEach(Platform => {
      if (Platform.y >= this.config.height) {
        tempPlatforms.push(Platform);
        if (tempPlatforms.length === 2) {
          this.placePlatform(...tempPlatforms);
          this.increaseScore();
          this.scoreToIncrease++;
        }
      }
    })
  }

  getUpMostPlatform() {
    let UpMostY = 0;

    this.platforms.getChildren().forEach(function(platform) {
      UpMostY = Math.min(platform.y, UpMostY);
    })

    return UpMostY;
  }
  
  gameOver() {
    this.physics.pause();
    this.player.setTint(0xEE4824);

    this.saveBestScore();

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.physics.pause();
        this.scene.pause();
        this.scene.start('EndScreen', { score: this.score});
      },
      loop: false
    })
  }

  saveBestScore() {
    const bestScoreText = localStorage.getItem('bestScore');
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    if (!bestScore || this.score > bestScore) {
      localStorage.setItem('bestScore', this.score);
    }
  }

  Jump() {
    this.floor.destroy();
    if (this.player.body.touching.down) {
      this.player.setVelocityY(-this.jumpVelocity);
      this.doubleJump = true;
    }else if(this.doubleJump == true){
      this.player.setVelocityY(-this.jumpVelocity);
      this.doubleJump = false;
    }
  }

  Left(){
    this.player.setFlipX(true);
    this.player.setVelocityX(-250);
    this.player.anims.play('run', true);
  }

  Right(){
    this.player.setFlipX(false);
    this.player.setVelocityX(250);
    this.player.anims.play('run', true);
  }

  Stop() {
    this.player.setVelocityX(0);
    this.player.gravity
    this.player.anims.play('idle', true);
  }
  Drop() {
    this.player.body.gravity.y = 5000;
    this.player.anims.play('idle', true);
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`)
  }

  createPause() {
    const pauseButton = this.add.image(this.config.width*0.9, this.config.height*0.1, 'pause')
      .setInteractive()
      .setScale(3)
      .setOrigin(1);

    pauseButton.on('pointerdown', () => {
      this.physics.pause();
      this.scene.pause();
      this.scene.launch('PauseScene');
    })
  }

  listenToEvents() {
    this.events.on('resume', () => {
      this.physics.resume();
    })
  }
}


export default GameScene;
