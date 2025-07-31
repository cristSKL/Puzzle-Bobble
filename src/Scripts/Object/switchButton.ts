import * as Phaser from 'phaser'

export default class switchButton extends Phaser.GameObjects.Sprite{
    private buttonDowned:boolean = false;
    private label:Phaser.GameObjects.Text;
    constructor(scene:Phaser.Scene, x:number, y:number, width:number, height:number){
        super(scene,x,y,'button2');
        this.scene.add.existing(this);
        this.setScale(0.7);
        this.setInteractive();
        this.label = this.scene.add.text(x,y-2,'Switch',{
            fontFamily: 'Comic Neue',
			fontSize: '20px',
			color: '#FFFFFF',
            stroke: '#FFFFFF',
			strokeThickness: 10,
        }).setOrigin
        (0.5,0.5)
        this.on('pointerdown',()=>{
            this.buttonDowned = true;
            this.setTexture("button2Pressed");
            this.label.y += 2;
            
        })
        this.on('pointerup',()=>{
            if(this.buttonDowned){
                this.buttonDowned = false;
                this.setTexture("button2");
                this.label.y -= 2;
                this.emit('switching',this);
            }
        })
        this.on('pointerout',()=>{
            if(this.buttonDowned){
                this.buttonDowned = false;
                this.setTexture("button2")
                this.label.y -= 2;
            }
            
            
        })
        scene.add.rectangle(width/2, y,width,height*0.0075,0xff0000 ).setAlpha(0.3);
        this.setDepth(1000);
        this.label.setDepth(1001);
    }

    changeColor(code:number){
        if(code === 0){
            this.label.setColor('#ff0000');
          }else  if(code === 1){
            this.label.setColor("#34a4eb");
          }else  if(code === 2){
            this.label.setColor("#34eb5f");
          }else  if(code === 3){
            this.label.setColor("#f5e907");
          }else  if(code === 4){
            this.label.setColor("#000000");
          }else  if(code === 5){
            this.label.setColor("#3f07f5");
          }else  if(code === 6){
            this.label.setColor("#f507e9");
        }
    }
}