import * as Phaser from 'phaser';

export default class scoreText extends Phaser.GameObjects.Text {
  constructor(width:number,height:number,scene:Phaser.Scene) {
    super(scene, width, height, '', { color: 'white', fontSize: '30px' })
    scene.add.existing(this)
    this.setOrigin(0,0.5)
  }

  update(score:number) {
    this.setText(`Score: ${score}`)
  }
}
