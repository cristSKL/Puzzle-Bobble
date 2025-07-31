import * as Phaser from 'phaser'

export default class Bubble extends Phaser.Physics.Arcade.Sprite{
    constructor(scene:Phaser.Scene, x:number, y:number, code:number, width:number, circleSize:number, worldActive:boolean, offset:number){
        super(scene,x, y, "bubble", 0);
        
        this.scene.add.existing(this);

        scene.physics.add.existing(this);
       //72
        this.setScale((width/8)/375).setOffset(offset,offset).body.setCircle(circleSize)
        
        if(worldActive){
          this.setInteractive();
          this.setVisible(true);
          this.setCollideWorldBounds(true);
          this.setBounce(1,1);
          this.setData('code',code);
          if(code === 0){
              this.setTint(0xff0000);
            }else  if(code === 1){
              this.setTint(0x34a4eb);
            }else  if(code === 2){
              this.setTint(0x34eb5f);
            }else  if(code === 3){
              this.setTint(0xf5e907);
            }else  if(code === 4){
              this.setTint(0x00000);
            }else  if(code === 5){
              this.setTint(0x3f07f5);
            }else  if(code === 6){
              this.setTint(0xf507e9);
          }
        }else{
          this.setVisible(false);
        }
        
    }

    changeColor(code){
      if(code === 0){
        this.setTint(0xff0000);
      }else  if(code === 1){
        this.setTint(0x34a4eb);
      }else  if(code === 2){
        this.setTint(0x34eb5f);
      }else  if(code === 3){
        this.setTint(0xf5e907);
      }else  if(code === 4){
        this.setTint(0x00000);
      }else  if(code === 5){
        this.setTint(0x3f07f5);
      }else  if(code === 6){
        this.setTint(0xf507e9);
    }
    }
}