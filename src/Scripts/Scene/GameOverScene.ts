import * as Phaser from "phaser"
import FpsText from "../Object/FpsText";

export default class GameOverScene extends Phaser.Scene {
    private score: number;
    private level:number;
    private width: number;
    private height:number;
    private title: Phaser.GameObjects.Text;
    private scoreText: Phaser.GameObjects.Text;
    private buttonText:Phaser.GameObjects.Text;
    private retryButton: Phaser.GameObjects.Sprite;
    private overlay: Phaser.GameObjects.Rectangle;
    private background:Phaser.GameObjects.Image;
    private buttonDowned:boolean = false;
    

    constructor() {
      super({ key: "GameOverScene", active:false});
    }

    init(data){
        this.score = data.score;
        this.level = data.level;
        this.width = this.scale.width;  
        this.height = this.scale.height;
    }

    create(){
        this.overlay = this.add.rectangle(this.width/2, this.height/2, this.width,this.height, 0x000000).setAlpha(0.6);
        this.background = this.add.image(this.width/2,(this.height/2)*0.83,'panel').setOrigin(0.5,0.5).setScale((0.695*this.width)/100);
        this.title = this.add.text(this.width/2,(this.height/2)*0.55,'Game Over',{ 
            fontFamily: 'Wallpoet',
			fontSize: '80px',
			color: '#FFFFFF',
			fontStyle: 'normal',
			stroke: '#193E74',
			strokeThickness: 16,
        }).setOrigin(0.5,0.5);
        this.scoreText = this.add.text(this.width/2,(this.height/2)*0.75,`Score: ${this.score}`,{
            fontFamily: 'Wallpoet',
			fontSize: '50px',
			color: '#193E74',
			fontStyle: 'normal',	
        }).setOrigin(0.5,0.5);
        this.scoreText = this.add.text(this.width/2,(this.height/2)*0.87,`Level: ${this.level}`,{
            fontFamily: 'Wallpoet',
			fontSize: '50px',
			color: '#193E74',
			fontStyle: 'normal',
        }).setOrigin(0.5,0.5);

        this.retryButton = this.add.sprite(this.width/2,(this.height/2)*1.04,'button').setScale(1.5);
        this.buttonText = this.add.text(this.width/2,(this.height/2)*1.03,'Try Again',{
            fontFamily: 'Wallpoet',
			fontSize: '40px',
			color: '#ffffff',
			fontStyle: 'normal',
        }).setOrigin(0.5,0.5);

        this.retryButton.setInteractive();
        
        this.retryButton.on('pointerout',()=>{
            if(this.buttonDowned){
                this.retryButton.setTexture('button');
                this.buttonText.y -= 3;
                this.buttonDowned = false;
            }
        })
        this.retryButton.on('pointerdown',()=>{
            this.retryButton.setTexture('buttonPressed');
            this.buttonText.y += 3;
            this.buttonDowned = true;
        })
        this.retryButton.on('pointerup',()=>{
            if(this.buttonDowned){
                this.retryButton.setTexture('button');
                this.buttonText.y -= 3;
                this.clickTryAgain();
                this.buttonDowned = false;
            }
            
        })
        // this.retryButton.setTexture('buttonPressed');
    
        
    }

    private clickTryAgain(){
        this.events.emit('clickTryAgain');
    }
}