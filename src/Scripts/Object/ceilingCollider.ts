import * as Phaser from 'phaser'

export default class CeilingCollider extends Phaser.Physics.Arcade.Sprite{
    constructor(scene:Phaser.Scene,x:number,y:number,width:number, height:number){
        super(scene,x, y,'');
        
        this.scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setSize(width,height);
        this.visible = false;
    }
}
