import * as Phaser from 'phaser'

export default class Arrow extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene:Phaser.Scene, x:number, y:number)
    {
        super(scene,x, y, "arrow");
        
        this.scene.add.existing(this);

        scene.physics.add.existing(this);
        this.setScale(1,1.3);
        this.setTint(0xd1d1d1);
        this.setInteractive();
    }
}