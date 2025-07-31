import * as Phaser from 'phaser';

export default class FpsText extends Phaser.GameObjects.Text {
  constructor(height:number,scene:Phaser.Scene) {
    super(scene, 10, height-50, '', { color: 'white', fontSize: '28px' })
    scene.add.existing(this)
    this.setOrigin(0)
  }

  update() {
    this.setText(`fps: ${Math.floor(this.scene.game.loop.actualFps)}`)
  }
}
