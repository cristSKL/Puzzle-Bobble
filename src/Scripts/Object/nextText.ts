import * as Phaser from 'phaser';

export default class nextText extends Phaser.GameObjects.Text {
  constructor(scene:Phaser.Scene, x: number, y:number) {
    super(scene, x,y, 'NEXT', { 
        fontFamily: 'Wallpoet',
		fontSize: '48px',
		color: '#3F44C3',
		fontStyle: 'normal',
		stroke: '#FFFFFF',
		strokeThickness: 9,
		shadow: { color: '#FFFFFF', fill: true, blur: 0 }
     })
    scene.add.existing(this)
    this.setOrigin(0.5,0.5)
  }
}
