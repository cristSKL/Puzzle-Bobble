import * as Phaser from "phaser"

export default class levelIndicator extends Phaser.GameObjects.Text {
    constructor(width:number,height:number,scene:Phaser.Scene) {
      super(scene, width, height, 'Easy', { 
        fontFamily: 'Cairo',
        fontSize: '60px',
        color: '#029615',
        stroke: '#FFFFFF',
        strokeThickness: 6, })
      scene.add.existing(this)
      this.setOrigin(1,0.5)
    }
    
    changeLevel(level:number){
        if(level === 1){
            this.setColor('#029615')
            this.setText('Easy')
        }else if(level === 2){
            this.setColor('#FFBB00')
            this.setText('Medium')
        }else if(level === 3){
            this.setColor('#B80000')
            this.setText('Hard')
        }else if(level === 4){
            this.setColor('#370000')
            this.setText('Nightmare')
        }
    }
    update(score:number) {
      this.setText(`Score: ${score}`)
    }
  }
  