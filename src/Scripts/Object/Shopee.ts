import * as Phaser from "phaser"


export default class Shopee extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene:Phaser.Scene, x:number, y:number)
    {
        super(scene,x, y, "shopee");
        
        this.scene.add.existing(this);

        scene.physics.add.existing(this);
        this.setTint(0xff0000);
        this.setInteractive();

        this.setCollideWorldBounds();
        this.setBounce(0.6);
        this.setScale(0.175);
        this.setSize(320,360);
        this.setOffset(50,0)
        this.setGravity(0, 400);
        this.on('pointerdown', function(){
            this.setVelocity(0, -600);
         });
    }
}