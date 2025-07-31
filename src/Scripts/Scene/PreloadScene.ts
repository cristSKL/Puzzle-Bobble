import * as Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload(): void {
    this.load.path = "src/Assets/";

    this.load.image('shopee','shopee.png');
    this.load.spritesheet('bubble','bubbleSprite.png',{frameWidth:512,frameHeight:512});
    this.load.image('arrow','arrowUp.png');
    this.load.audio('sfx', 'pop-2.mp3');
    this.load.audio('bgm', 'GameBGM.mp3');
    this.load.image('button','gameOver/buttonLong_brown.png');
    this.load.image('buttonPressed','gameOver/buttonLong_brown_pressed.png');
    this.load.image('panel','gameOver/panel_brown.png')
    this.load.image('panel2','gameOver/buttonSquare_blue.png')
    this.load.image('panel3','gameOver/buttonSquare_blue_pressed.png')
    this.load.image('button2','gameOver/buttonLong_blue.png');
    this.load.image('button2Pressed','gameOver/buttonLong_blue_pressed.png');
    this.load.image('musicOn','musicOn.png');
    this.load.image('musicOff','musicOff.png');
    
    // 
  }

  
  create(): void {
    this.createAnim();
   

    this.scene.start("GameScene");
  }

  private createAnim(){
    this.anims.create({
      key: 'pop',
      frames: this.anims.generateFrameNumbers('bubble',{start:0,end:5}),
      frameRate:22,
  
    })
  }


}

