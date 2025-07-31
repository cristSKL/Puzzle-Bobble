import * as Phaser from 'phaser'

export default class bgmButton extends Phaser.GameObjects.Sprite{
    private bgmOff:boolean = false;
    constructor(scene:Phaser.Scene, x:number, y:number){
        super(scene,x,y,'musicOn');
        this.scene.add.existing(this);
        this.setScale(1.3);
        this.setInteractive();
        this.on('pointerdown',()=>{
            if(this.bgmOff){
                this.setTexture('musicOn');
                this.bgmOff = false;
                this.emit('musicTurnOn',this);
            }else{
                this.setTexture('musicOff');
                this.bgmOff = true;
                this.emit('musicTurnOff',this)
            }
            
        })
    }
}