import * as Phaser from "phaser";
import Arrow from "../Object/Arrow"
import FpsText from "../Object/FpsText";
import ScoreText from "../Object/scoreText";
import Bubbles from "../Object/Bubbles"
import Bubble from "../Object/Bubble";
import CeilingCollider from "../Object/ceilingCollider"
import NextBubbleBorder from "../Object/nextBubbleBorder"
import SwitchButton from "../Object/switchButton"
import BgmButton from "../Object/bgmButton"
import LevelText from "../Object/levelText"
import levelIndicator from "../Object/levelIndicator"
import GameOverColider from "../Object/gameOverColider"
import { ConstructorDeclaration } from "typescript";

export default class GameScene extends Phaser.Scene {
  private ctd = 0;
  private spacebar:Phaser.Input.Keyboard.Key;
  //#region GameOver
  private gameOver:boolean;
  private gameOverCheck:boolean;
  private gameOverTriggered:boolean;
  //#endregion

  //#region audio
  private sfxBubble:Phaser.Sound.BaseSound;
  private sfxBubbleConfig;
  private bgm:Phaser.Sound.BaseSound;;
  private bgmConfig;
  //#endregion

  

  //#region Object
  private switchButton:SwitchButton;
  private bgmButton:BgmButton;
  private bubbleGroup:Bubbles;
  private bubbleGroupGeom:Bubbles;
  private bubble:Bubble;
  private nextBubble:Bubble;
  private nextBubbleBorder: NextBubbleBorder;
  private tempBubble:Bubble;
  private tempBubbleHit:Bubble;
  private ceilingColider: CeilingCollider;
  private gameOverColider: GameOverColider;
  private arrow: Arrow;
  private fpsText:FpsText;
  private scoreText: ScoreText;
  private levelText: LevelText;
  private levelIndicator: levelIndicator;
  //#endregion
 
  //#region Geom
  private graphics: Phaser.GameObjects.Graphics
  private aimLine: Phaser.Geom.Line
  private reflectingLineLeft: Phaser.Geom.Line
  private reflectingLineRight: Phaser.Geom.Line
  private reflectedLine: Phaser.Geom.Line
  private intersectPoin:Phaser.Geom.Point
 //#endregion 

  //#region Aiming
  private aimMode:boolean = false;
  private boolOnCollision: boolean = false;
  //#endregion

  private inverted:boolean = false;


  //#region number and array
  private bubbleDelay:boolean = false;
  private popDelay:boolean = false;
  private bubbleSpawnY:number;
  private bubbleRad:number;
  private bubbleOffset:number;
  private bubbleGeomRad:number;
  private bubbleGeomOffset:number
  private width:number = 0;
  private height:number = 0;
  private level:number;
  private levelCtd:number;
  private tileCountdown:number;
  private easyCountdown:number;
  private mediumCountdown:number;
  private hardCountdown:number;
  private veryHardCountdown:number;
  private score:number = 0;
  private nextColor:number;
  private pointerAngle:number = 0;
  private bubbleColorCode:Array<Array<number>> =[];
  private bubbleStacks = []
  private tempBubbleStacks = []
  private neighbouroffsets = [];  

  //#endregion
  
  constructor() {
    super({ key: "GameScene" });
  }

  init(): void {
    this.resetVar();
    this.score = 0;
    this.width = this.scale.width;  
    this.height = this.scale.height;
    //#region level progresion variable
    this.bubbleRad = 165;
    this.bubbleOffset = 94;
    this.bubbleGeomRad = 190;
    this.bubbleGeomOffset = 72;
    this.level = 1;
    this.levelCtd = 3;
    this.easyCountdown = 10;
    this.mediumCountdown = 9;
    this.hardCountdown = 8;
    this.veryHardCountdown= 7;
    this.tileCountdown = this.easyCountdown;
    this.neighbouroffsets = [ 
      [[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]], 
      [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]]
     ];  
     
    //#endregion
    this.sound.removeAll();
  }

  create(): void 
  {
      let myCoord:{tilex:number,tiley:number} = this.getBubbleCoordinate(0,9);
      this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.sfxBubble = this.sound.add('sfx');
      this.sfxBubbleConfig = {
        mute: false,
        volume: 1.5,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: false,
        delay: 0,
      }
      this.bgm = this.sound.add('bgm');
      this.bgmConfig = {
        mute: false,
        volume: 0.5,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: true,
        delay: 0,
      }
      this.bgm.play(this.bgmConfig)
      var header = this.add.rectangle(this.width/2, this.height*0.0375, this.width, this.height*0.075, 0x6666ff);
      let floorHeight = (this.height - myCoord.tiley) - this.height*0.0417
      let floorYpos = this.height - (floorHeight/2)
      this.bubbleSpawnY = this.height - floorHeight
      var floor = this.add.rectangle(this.width/2,  floorYpos,this.width,floorHeight,0x7d7b7a );

      this.gameOverColider = new GameOverColider(this,this.width/2,myCoord.tiley,this.width,this.height*0.0075)
      this.ceilingColider = new CeilingCollider(this,this.width/2,this.height*0.0375,this.width,this.height*0.075);
      
      this.bubble = new Bubble(this,this.width/2,this.bubbleSpawnY, Phaser.Math.Between(0,6),this.width,this.bubbleRad, true,this.bubbleOffset);
      this.bubbleGroup = new Bubbles(this.physics.world, this);
      this.bubbleGroupGeom = new Bubbles(this.physics.world,this);

      this.nextColor = Phaser.Math.Between(0,6);
      this.nextBubbleBorder = new NextBubbleBorder(this,this.width*0.89,myCoord.tiley + (this.height*0.125));
      this.nextBubble = new Bubble(this,this.width*0.89,myCoord.tiley + (this.height*0.125), this.nextColor,this.width,this.bubbleRad, true,this.bubbleOffset);
      
      this.fpsText = new FpsText(this.height,this);
      this.scoreText = new ScoreText(this.width*0.021,this.height*0.021,this);
      this.levelText = new LevelText(this.width*0.021,this.height*0.058,this);
      this.levelIndicator = new levelIndicator(this.width*0.99,this.height*0.0375,this)
      this.graphics = this.add.graphics();
      this.graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa, }, fillStyle: { color: 0xff0000 }});
      this.aimLine = new Phaser.Geom.Line(this.width/2,this.height*0.75, 0, 800);
      this.reflectingLineLeft = new Phaser.Geom.Line(0, this.height, 0, 0);      
      this.reflectingLineRight = new Phaser.Geom.Line(this.width, this.height, this.width, 0);
      this.reflectedLine = new Phaser.Geom.Line(0, 0, 0, 0);
      this.intersectPoin = new Phaser.Geom.Point()
      this.bubbleGroup.add(this.ceilingColider);
      this.randomizedColor();
      this.createBubble();

      this.switchButton = new SwitchButton(this,this.width*0.89,myCoord.tiley,this.width,this.height);
      this.switchButton.changeColor(this.nextColor);
      this.switchButton.on('switching',()=>{
        this.bubbleSwitchHandler();
      })

      this.bgmButton = new BgmButton(this,30,myCoord.tiley)
      this.bgmButton.on('musicTurnOn',()=>{
        this.bgm.play(this.bgmConfig);
      })
      this.bgmButton.on('musicTurnOff',()=>{
        this.bgm.stop();
      })
      //#region Pointer Input and movement
     
      this.input.on('pointerdown',(pointer:Phaser.Input.Pointer)=>{
        if(!this.gameOver){
          if(pointer.y >= this.bubbleSpawnY + this.height*0.033){
         
            if(!this.bubbleDelay){
              this.aimMode = true;
              this.adjustAimAngle(pointer);
            }
          }else{
            this.aimMode = false;
          }
        }
      });
     
      this.input.on('pointerup',()=>{
        if(!this.gameOver){
          if(!this.bubbleDelay && this.aimMode){
            this.bubbleDelay = true;
            this.physics.velocityFromRotation(this.pointerAngle , 2800, this.bubble.body.velocity);
          }
          this.aimMode = false;
        }    

      });
      
    
      this.input.on('pointermove',(pointer:Phaser.Input.Pointer)=>{
       
        if(!this.bubbleDelay && this.aimMode){
          if(pointer.y >= this.bubbleSpawnY + this.height*0.033){
           this.adjustAimAngle(pointer);
            
          }else{
            this.aimMode = false;
          }
        
        }
      });
      //#endregion
    
      this.physics.add.overlap(this.gameOverColider,this.bubbleGroup,()=>{
        this.gameOverCheck = true;
        
      },undefined,this)
      this.physics.add.overlap(this.bubble,this.bubbleGroup,this.bubleOverlapHandler,undefined,this)
      this.arrow = new Arrow(this, this.bubble.x, this.bubble.y);
  }

  
  update(): void 
  { 
    // this.debugMode()

    if(!this.gameOver){
      if(this.gameOverCheck === true && this.bubbleDelay === false){
        this.gameOver = true;
      }
      if(!this.bubbleDelay && this.aimMode){
        this.arrow.visible = true;
      }else{
        this.arrow.visible = false;
        this.graphics.clear();
      }
    
      if(this.boolOnCollision){
        this.handleBubbleStack();
      }
  
      this.scoreText.update(this.score);
      this.levelText.update(this.tileCountdown);
    }else{
      this.endGame();
    }
    this.fpsText.update();
    
  }

  private debugMode(){
    if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
      this.progressLevel();
    }
  }

  private resetVar(){
    this.gameOver = false;
    this.gameOverCheck = false;
    this.gameOverTriggered = false;
    this.inverted = false;
    this.boolOnCollision = false;
    this.bubbleDelay = false;
    this.popDelay = false;
    this.bubbleStacks = []
    this.tempBubbleStacks = []
    
    for(let i = 0; i<10;i++){
      let tempArr = []
      let col = this.getColNum(i);
     
      for(let j = 0; j<col; j++){
        tempArr.push(undefined);
      }
      this.bubbleStacks.push(tempArr)
    
    }
  }

  //#region game over
  private endGame(){
    if(!this.gameOverTriggered){
      // this.overlay.setAlpha(0.6)
      this.bgm.destroy();

  
      this.gameOverTriggered = true;
      this.scene.launch('GameOverScene',{score:this.score, level:this.level});
      let panel = this.scene.get('GameOverScene');
      panel.events.on('clickTryAgain', this.handleTryAgain, this);
    }
  }

  private handleTryAgain(){
   
    this.scene.restart();
    this.closeGameOver();
    
   
  }

  private closeGameOver(){
    this.scene.stop('GameOverScene');
  }
  //#endregion

  //#region Switch Bubble
  private bubbleSwitchHandler(){
    if(!this.gameOver){
      let code1 = this.bubble.getData('code');
      let code2 = this.nextColor;
      this.nextColor = code1;
      code1 = code2;
      this.bubble.setData('code',code1);
      this.bubble.changeColor(code1);
      this.nextBubble.changeColor(this.nextColor);
      this.switchButton.changeColor(this.nextColor);
    }
  }
  //#endregion



  //#region Geom Aim Adjust
  private AimAdjust():void{
    let linePoints:Array<Phaser.Geom.Point> = [];
    linePoints = this.aimLine.getPoints(150);
    let maxIdx:number = 149;
    let idx:number = 0;
    let objExist: boolean;
    
    do{ 
      objExist = false;
      this.bubbleGroupGeom.children.each(c =>{
        const child = c as Phaser.Physics.Arcade.Sprite;
        if(!objExist){
          objExist = child.body.hitTest(linePoints[idx].x,linePoints[idx].y);
        }   
      })
      if(!objExist){
        objExist = this.ceilingColider.body.hitTest(linePoints[idx].x,linePoints[idx].y);
      }   
      idx += 1;
    }while( idx < maxIdx && !objExist);
    if(objExist){
      this.graphics.clear();
      for(let i = 0; i<idx-1; i++){
        this.graphics.fillCircle(linePoints[i].x, linePoints[i].y, 4);
      } 
    }else{
      // let intersectPoint: Phaser.Geom.Point = new Phaser.Geom.Point()
      if(Phaser.Geom.Intersects.LineToLine(this.aimLine,this.reflectingLineLeft,this.intersectPoin)){
        let reflectAngle: number = Phaser.Geom.Line.ReflectAngle(this.aimLine,this.reflectingLineLeft);
        this.redrawLine();

        Phaser.Geom.Line.SetToAngle(this.reflectedLine,this.intersectPoin.x,this.intersectPoin.y,reflectAngle,2000);
        this.adjustReflectAim(this.intersectPoin,reflectAngle);
      }else if(Phaser.Geom.Intersects.LineToLine(this.aimLine,this.reflectingLineRight,this.intersectPoin)){
        let reflectAngle: number = Phaser.Geom.Line.ReflectAngle(this.aimLine,this.reflectingLineRight);
        this.redrawLine();
        Phaser.Geom.Line.SetToAngle(this.reflectedLine,this.intersectPoin.x, this.intersectPoin.y,reflectAngle,2000);
        this.adjustReflectAim(this.intersectPoin,reflectAngle);
      }else{
        this.redrawLine();
      }
    }
  }

  private adjustAimAngle(pointer:Phaser.Input.Pointer){
    this.pointerAngle = Phaser.Math.Angle.Between(this.bubble.x,this.bubble.y, pointer.x, pointer.y);
    this.pointerAngle = Phaser.Math.RadToDeg(this.pointerAngle);
    this.bubble.setAngle(this.pointerAngle - 90);
    this.arrow.setAngle(this.pointerAngle-90);
    this.pointerAngle = Phaser.Math.DegToRad(this.pointerAngle+180);
    Phaser.Geom.Line.SetToAngle(this.aimLine, this.bubble.x,this.bubble.y,this.pointerAngle, 2000);
    this.AimAdjust();
  }

  private adjustReflectAim(intersectPoint:Phaser.Geom.Point,reflectAngle:number):void{
    let linePoints:Array<Phaser.Geom.Point> = [];
    linePoints = this.reflectedLine.getPoints(150);
    let maxIdx:number = 149;
    let idx:number = 0;
    let objExist: boolean;
    
    do{ 
      objExist = false;
      this.bubbleGroupGeom.children.each(c =>{
        const child = c as Phaser.Physics.Arcade.Sprite;
        if(!objExist){
          objExist = child.body.hitTest(linePoints[idx].x,linePoints[idx].y);
        }
        
      })
      if(!objExist){
        objExist = this.ceilingColider.body.hitTest(linePoints[idx].x,linePoints[idx].y);
      }
      idx += 1;
    }while( idx < maxIdx && !objExist);

    if(objExist){
      let Dist:number = Phaser.Math.Distance.Between(this.reflectedLine.x1,this.reflectedLine.y1,linePoints[idx-1].x,linePoints[idx-1].y);
      Phaser.Geom.Line.SetToAngle(this.reflectedLine,intersectPoint.x, intersectPoint.y,reflectAngle,Dist);
      this.redrawLine();
      for(let i = 0; i<idx-1; i++){
        this.graphics.fillCircle(linePoints[i].x, linePoints[i].y, 4);
      } 
    }else{
      for(let i = 0; i<150; i++){
        this.graphics.fillCircle(linePoints[i].x, linePoints[i].y, 4);
      } 
    }
  }

  private redrawLine():void{
    let linePoints:Array<Phaser.Geom.Point> = [];
    linePoints = this.aimLine.getPoints(150);
    let maxIdx:number = 150;

    this.graphics.clear()
    for(let i = 0; i<maxIdx-1; i++){
      this.graphics.fillCircle(linePoints[i].x, linePoints[i].y, 4);
    } 
  }
  //#endregion

  //#region create bubble, bubble coordinate, and color
  private getColNum(row:number):number{
    let x = 0
    if(!this.inverted){
      if(row%2 === 0){
        x = 8;
      }else{
        x = 7;
      }
    }else if(this.inverted){
      if(row%2 === 0){
        x = 7;
      }else{
        x = 8;
      }
    }
    return x;
  }
  
  private randomizedColor():void{
    let x: number;
    for (let row = 0; row < 5; ++row){
      let j: Array<number> = []
      x = this.getColNum(row);
      for(let column = 0; column < x; ++column){
        let i:number = Phaser.Math.Between(0,6);
        j.push(i);
      }
      this.bubbleColorCode.push(j);
    }
   
  }
  
  private createBubble(): void{
    let x: number;
    let odd: boolean;
    for (let row = 0; row < 5; ++row){
      let tempArr = [];
      x = this.getColNum(row);
      for(let column = 0; column < x; ++column){
        let coord:{tilex:number,tiley:number} = this.getBubbleCoordinate(column,row);
        this.bubbleGroup.add(new Bubble(this,coord.tilex,coord.tiley,this.bubbleColorCode[row][column],this.width, this.bubbleRad, true, this.bubbleOffset).setData({xPos:column,yPos:row}))
        this.bubbleGroupGeom.add(new Bubble(this,coord.tilex,coord.tiley,this.bubbleColorCode[row][column],this.width, this.bubbleGeomRad, false, this.bubbleGeomOffset))
        
        // tempArr.push({
        //   xCoord:coord.tilex,
        //   yCoord:coord.tiley,
        //   xPos: column,
        //   yPos: row,
        //   code:this.bubbleColorCode[row][column],
        //   processed: false,
        //   odd: odd
        // })
        this.bubbleStacks[row][column] = {
          xCoord:coord.tilex,
          yCoord:coord.tiley,
          xPos: column,
          yPos: row,
          code:this.bubbleColorCode[row][column],
          processed: false,
          odd: odd
        }
      
      }
      
  
        // this.bubbleStacks.push(tempArr);
    }
    // console.log(this.bubbleStacks);
  }
  //#endregion

  //#region Snap Bubble, adjust array, and adjust coordinate
  private bubleOverlapHandler(b:Phaser.GameObjects.GameObject, g:Phaser.GameObjects.GameObject):void{
    if(this.boolOnCollision === false && this.bubbleDelay === true && this.popDelay === false){
      const bubble = b as Bubble;
      const group = g as Bubble
      this.boolOnCollision = true;
      this.tempBubble = bubble; 
      if(group.getData('code') !== undefined){
        this.tempBubbleHit = group;
      }else{
        this.tempBubbleHit = undefined
      }
    }
  }

  private handleBubbleStack():void{
    let tilePos:{x:number,y:number} = this.snapBubble(this.tempBubble);
    let coord:{tilex:number,tiley:number} = this.getBubbleCoordinate(tilePos.x,tilePos.y);
    let bubTile = {
      xCoord:coord.tilex,
      yCoord:coord.tiley,
      xPos:tilePos.x,
      yPos:tilePos.y,
      code:this.tempBubble.getData('code'),
      processed:false
    }
    
    if(this.tempBubbleHit !== undefined){
      tilePos = this.adjustBubbleCoordinate(bubTile);
      coord = this.getBubbleCoordinate(tilePos.x,tilePos.y);
    }
    // this.adjustBubbleArray(tilePos);
    this.bubbleStacks[tilePos.y][tilePos.x] = {
      xCoord:coord.tilex,
      yCoord:coord.tiley,
      xPos:tilePos.x,
      yPos:tilePos.y,
      code:this.tempBubble.getData('code'),
      processed:false
    }

    this.bubbleGroup.add(new Bubble(this,coord.tilex,coord.tiley,this.tempBubble.getData('code'),this.width, this.bubbleRad,true, this.bubbleOffset).setData({xPos:tilePos.x,yPos:tilePos.y}));
    this.bubbleGroupGeom.add(new Bubble(this,coord.tilex,coord.tiley,this.tempBubble.getData('code'),this.width, this.bubbleGeomRad,false,this.bubbleGeomOffset));
    this.bubble.destroy(true);
  
    if(!this.gameOver){
      this.popHandler(tilePos.x, tilePos.y)
      this.bubble = new Bubble(this,this.width/2,this.bubbleSpawnY, this.nextColor,this.width, this.bubbleRad, true,this.bubbleOffset);
      this.nextColor = Phaser.Math.Between(0,6);
      this.nextBubble.changeColor(this.nextColor);
      this.switchButton.changeColor(this.nextColor);
      this.physics.add.overlap(this.gameOverColider,this.bubbleGroup,()=>{
        this.gameOverCheck = true;
      },undefined,this)
      this.physics.add.overlap(this.bubble,this.bubbleGroup,this.bubleOverlapHandler,undefined,this)
  
      this.boolOnCollision = false;
    }
  }

  private adjustBubbleCoordinate(bubTile):{x:number, y:number}{
    if(Math.abs(this.tempBubbleHit.getData('yPos') - bubTile.yPos)>=2){
      if(this.tempBubbleHit.y > bubTile.yCoord){
        bubTile.yPos += 1;
      }else{
        bubTile.yPos -= 1;
      }
      console.log("wadidaw");
    }
    let bubNeighbor = this.getNeighbor(bubTile);
    let trueNeighbor:boolean = false;
    
    for(let i = 0; i< bubNeighbor.length; i++){
      if(bubNeighbor[i].xCoord === this.tempBubbleHit.x && bubNeighbor[i].yCoord === this.tempBubbleHit.y){
        trueNeighbor = true;
        break;
      }
    }
   
    if(!trueNeighbor){
      console.log(bubTile);
      
      if(this.tempBubbleHit.x > bubTile.xCoord){
        if(bubTile.xPos+1 < this.bubbleStacks[bubTile.yPos].length){
          if(this.bubbleStacks[bubTile.yPos][bubTile.xpos+1] === undefined){
            bubTile.xPos += 1;
          }
        }
        
      }else{
        if(bubTile.xPos - 1 >= 0){
          if(this.bubbleStacks[bubTile.yPos][bubTile.xpos-1] === undefined){
            bubTile.xPos -= 1;
          }
          
        }
      }
      console.log(bubTile);
    }
    return {x:bubTile.xPos,y:bubTile.yPos}
  }

  private getBubbleCoordinate(column, row):{tilex:number, tiley:number}{
    const tilewidth = this.cameras.main.width/8;
    const tileheight = this.cameras.main.width/8-(this.width*0.014);
    let tilex:number = column * tilewidth;

    if(!this.inverted){
      if(row%2 !== 0){
        tilex += tilewidth/2;
      }
    }else{
      if(row%2 === 0){
        tilex += tilewidth/2;
      }
    }
    let tiley: number = row * tileheight;
    tilex+= tilewidth/2;
    tiley+= tileheight/2 + (this.height*0.081);
    
    return {tilex:tilex, tiley:tiley}
  }

  private snapBubble(bubble:Bubble):{x:number, y:number}{
    const tilewidth = this.cameras.main.width/8;
    const tileheight = this.cameras.main.width/8-(this.width*0.014);

    
    let odd = false;
    let xval:number = 0;
    let yval:number = 0;
    let centerx: number = bubble.x;
    let centery: number = bubble.y - (this.height*0.081);
    yval = Math.floor(centery/tileheight);
    let xoffset = 0;
    if(yval % 2){
      
      odd = true;
    }
    if(this.inverted){
      if(!odd){
        xoffset = tilewidth/2;
      }
    }else if(!this.inverted){
      if(odd){
        xoffset = tilewidth/2;
      }
    }

    xval = Math.floor((centerx - xoffset)/tilewidth);
    if(this.inverted){
      if(!odd){
        if(xval >=7){
          xval = 6;
        }
      }else{
        if(xval >=8){
          xval = 7;
        }
      }
    }else if(!this.inverted){
      if(odd){
        if(xval >=7){
          xval = 6;
        }
      }else{
        if(xval >=8){
          xval = 7;
        }
      }
    }
    if(xval < 0){
      xval = 0;
    }

    let test = Math.floor((centery-(this.height*0.081))/tileheight)
    return {x:xval ,y:yval}
  }
  //#endregion

  //#region pop and floating bubble
  private popHandler(tilex:number, tiley:number){
    let cluster = [];
    cluster = this.findcluster(tilex,tiley,true,true,false);
    if(cluster.length >= 3){
      
      this.popDelay = true;
      for(let idx = 0; idx< cluster.length; idx++){
        this.bubbleGroupGeom.children.each(c=>{
          const child = c as Phaser.Physics.Arcade.Sprite;
          if(child.x === cluster[idx].xCoord && child.y === cluster[idx].yCoord){
            child.destroy();
          }
        })
        this.bubbleGroup.children.each(c => {
          const child = c as Phaser.Physics.Arcade.Sprite;
          if(child.x === cluster[idx].xCoord && child.y === cluster[idx].yCoord){
            this.bubbleStacks[cluster[idx].yPos][cluster[idx].xPos] = undefined;
            this.tweens.add({
              targets: child,
              completeDelay:(idx*50),
              onComplete:()=>{
                  let popSound = this.sound.add('sfx');
                  popSound.play(this.sfxBubbleConfig);
                  child.anims.play('pop');
                  this.score += 10;
                  if(idx === cluster.length - 1){
                    this.floatHandler();
                  }
                child.on('animationcomplete',()=>{
                  child.destroy();
                  if(idx === cluster.length-1){
                    if(this.gameOverCheck){
                      this.gameOverCheck = false;
                    }
                    this.progressLevel();
                    this.popDelay  = false;
                    this.bubbleDelay = false;
                  }
                })
              }
            })           
          }
        }) 
      }
    }else{
     
      if(this.gameOverCheck){
        this.gameOver = true;
      }else{
        this.progressLevel();
        this.bubbleDelay = false;
      }
      
    }
  }
    private floatHandler(){
    let floatingCluster = this.findFloatingCluster();
    if(floatingCluster.length > 0){
      for(let fRow = 0; fRow< floatingCluster.length; fRow++){
        for(let fCol = 0; fCol<floatingCluster[fRow].length; fCol++){
          this.bubbleGroupGeom.children.each(c=>{
            const child = c as Phaser.Physics.Arcade.Sprite;
            if(child.x === floatingCluster[fRow][fCol].xCoord && child.y === floatingCluster[fRow][fCol].yCoord){
              child.destroy();
            }
          })
          this.bubbleGroup.children.each(c =>{
            const child = c as Phaser.Physics.Arcade.Sprite;
            if(child.x === floatingCluster[fRow][fCol].xCoord && child.y === floatingCluster[fRow][fCol].yCoord){
              this.bubbleStacks[floatingCluster[fRow][fCol].yPos][floatingCluster[fRow][fCol].xPos] = undefined;
              this.bubbleGroup.remove(child);
              this.score+=20;
              this.tweens.add({
                targets:child,
                duration:350,
                y:'+=100',
                onComplete:()=>{
                  child.anims.play('pop');
                  this.sfxBubble.play(this.sfxBubbleConfig);
                  child.on('animationcomplete',()=>{
                    child.destroy();
                    
                  })
                }
              })
            }
          })
        }
      }
    }
  }
  //#endregion
  
  //#region bubble cluster algorithm
  private findcluster(x:number, y:number,matchtype:boolean, reset:boolean, skipRemoved:boolean){
    if(reset){
      this.resetProcessed();
    }
    let targetTile = this.bubbleStacks[y][x]; 
    let toProcess = [targetTile];
    let foundCluster = []
    targetTile.processed = true;
    while(toProcess.length > 0){
      let currentTile = toProcess.pop();
      if(currentTile === undefined){
        continue;
      }
      if(!matchtype || (currentTile.code === targetTile.code) ){
        foundCluster.push(currentTile);
        let neighbor = this.getNeighbor(currentTile);
        for(let idx = 0; idx < neighbor.length; idx++){
          if(!neighbor[idx].processed){
            toProcess.push(neighbor[idx]);
            neighbor[idx].processed = true;
          }
        }
      }
    }
    return foundCluster;
  }

  private resetProcessed(): void{
    let row:number = this.bubbleStacks.length;
    let col:number = 0;
    for(let idxRow = 0; idxRow < row; idxRow++){
      col = this.getColNum(idxRow);
      for(let idxCol = 0; idxCol < this.bubbleStacks[idxRow].length; idxCol++){
        if(this.bubbleStacks[idxRow][idxCol] !== undefined){
          this.bubbleStacks[idxRow][idxCol].processed = false;
        }
       
      }
    }
  }

  private findFloatingCluster(){
    this.resetProcessed()
    let foundClusters = []
    let colnum:number;
    let FirstCoord:{tilex:number, tiley:number} = this.getBubbleCoordinate(0,0);
    for(let row = 0; row<this.bubbleStacks.length;row++){
      colnum = this.getColNum(row);
      for(let col = 0; col< colnum; col++){
        if(this.bubbleStacks[row][col] !== undefined){
          let tile = this.bubbleStacks[row][col];
          if(!tile.processed){
            
            let foundCluster = this.findcluster(col,row,false,false,true);
            if(foundCluster.length <= 0){
              continue;
            }
            let floating:boolean = true;
            for(let k = 0;k<foundCluster.length;k++){
              if(foundCluster[k].yCoord === FirstCoord.tiley){
                floating = false;
                break;
              }
            }
            if(floating){
              foundClusters.push(foundCluster);
            }
          }
        }
      }
    }
    return foundClusters;
  }

  private getNeighbor(tile){
    let neighbor = [];
    let offsetNum:number;
    let collNum:number;
    if(tile.yPos % 2 === 0){
      offsetNum = 0;
    }else{
      offsetNum = 1;
    }
    let currNeighbouroffsets = this.neighbouroffsets[offsetNum];
    for(let idx = 0; idx<currNeighbouroffsets.length;idx++){
      let x = tile.xPos + currNeighbouroffsets[idx][0];
      let y = tile.yPos + currNeighbouroffsets[idx][1];
      collNum = this.getColNum(y);
      if(x >= 0 && x < collNum && y >= 0 && y < this.bubbleStacks.length){
        if(this.bubbleStacks[y][x] !== undefined){
          neighbor.push(this.bubbleStacks[y][x])
        }
      }
    }
    return neighbor
  }
  //#endregion

  //#region levelProgression and newBubbleTile
  private progressLevel(){
     this.tileCountdown -= 1;
     if(this.tileCountdown <= 0){
       this.addNewBubbleTile();
     }
  }

  private addNewBubbleTile(){
    if(this.inverted){
      this.inverted = false;
      this.neighbouroffsets = [ 
                                [[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]], 
                                [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]]
                              ];  
    }else{
      this.inverted = true;
      this.neighbouroffsets = [ 
                                [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]],
                                [[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]]
                              ]; 
    }
    //#region making temp bubblestack
    let tempColNum = this.getColNum(0);
    let maxRowLength:number = this.bubbleStacks.length;
    this.tempBubbleStacks = [];
    let newColor = this.getNewColor(tempColNum);
    let tempArr = []
    for(let col = 0; col<tempColNum; col++){
      let newCoord:{tilex:number, tiley:number} = this.getBubbleCoordinate(col,0);
      tempArr.push({
        xCoord: newCoord.tilex,
        yCoord:newCoord.tiley,
        xPos: col,
        yPos: 0,
        code: newColor[col],
        processed: false,
        odd: false
      })
    }
    this.tempBubbleStacks.push(tempArr);
    //#endregion
    //#region moving bubble stack to temp bubblestack
    
    for(let row = 0; row < maxRowLength; row++){  
      tempArr = []
      for(let col = 0; col < this.bubbleStacks[row].length; col++){
        
        if(this.bubbleStacks[row][col] !== undefined){
          this.bubbleStacks[row][col].yPos +=1;
          let coord:{tilex:number, tiley:number} = this.getBubbleCoordinate(this.bubbleStacks[row][col].xPos, this.bubbleStacks[row][col].yPos);
          this.bubbleStacks[row][col].xCoord = coord.tilex;
          this.bubbleStacks[row][col].yCoord = coord.tiley;
          if(this.bubbleStacks[row][col].odd){
            this.bubbleStacks[row][col].odd = false;
          }else{
            this.bubbleStacks[row][col].odd = true;
          }
          tempArr.push(this.bubbleStacks[row][col]);

        }else{
          tempArr.push(undefined);
        }
      }
      this.tempBubbleStacks.push(tempArr);
    }
    //#endregion
    this.bubbleStacks = this.tempBubbleStacks;
    
  
    this.bubbleGroup.children.each(c =>{
      const child = c as Phaser.Physics.Arcade.Sprite;
      child.destroy(); 
    })
    this.bubbleGroupGeom.children.each(c =>{
      const child = c as Phaser.Physics.Arcade.Sprite;
      child.destroy(); 
    })
    for(let row = 0; row < this.bubbleStacks.length;row++){
      let colnum = this.getColNum(row);
      for(let col = 0; col < colnum; col++){
        if(this.bubbleStacks[row][col] !== undefined){
          this.bubbleGroup.add(new Bubble(this,this.bubbleStacks[row][col].xCoord,this.bubbleStacks[row][col].yCoord,this.bubbleStacks[row][col].code,this.width, this.bubbleRad,true, this.bubbleOffset).setData({xPos:col,yPos:row}));
          this.bubbleGroupGeom.add(new Bubble(this,this.bubbleStacks[row][col].xCoord,this.bubbleStacks[row][col].yCoord,this.bubbleStacks[row][col].code,this.width, this.bubbleGeomRad,false,this.bubbleGeomOffset));
        }
      }
    }
    this.ceilingColider = new CeilingCollider(this,this.width/2,this.height*0.0375,this.width,this.height*0.075);
    this.bubbleGroup.add(this.ceilingColider);
    this.levelCtd -= 1;
    if(this.levelCtd <= 0 && this.level < 4){
      this.levelCtd = 3;
      this.level += 1;
    }
    if(this.level == 1){
      this.tileCountdown = this.easyCountdown;
    }else if(this.level == 2){
      this.tileCountdown = this.mediumCountdown;
    }else if(this.level == 3){
      this.tileCountdown = this.hardCountdown;
    }else if(this.level == 4){
      this.tileCountdown = this.veryHardCountdown;
    }
    this.levelIndicator.changeLevel(this.level);
    
  }

  private getNewColor(idx:number){
    let newColor:Array<number> = []
    for(let i = 0; i<idx; i++){
      newColor.push(Phaser.Math.Between(0,6));
    }
    return newColor;
  }
  //#endregion
}

