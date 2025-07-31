import * as Phaser from 'phaser'

export default class nextbubbleBorder extends Phaser.GameObjects.Sprite{
    constructor(scene: Phaser.Scene, x:number, y:number){
        super(scene, x,y,'panel3');
        this.scene.add.existing(this);
        this.setScale(3.15);
        this.scene.add.text(x+3,y+95,'NEXT',{ fontFamily: 'Wallpoet',
            fontSize: '25px',
            color: '#3F44C3',
            fontStyle: 'normal',
            stroke: '#FFFFFF',
            strokeThickness: 9,
            shadow: { color: '#FFFFFF', fill: true, blur: 0 }
        }).setOrigin(0.5,0.5)
    }
}