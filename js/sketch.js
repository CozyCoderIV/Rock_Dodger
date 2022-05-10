// Attributes
let title;
let icon;
let start;

// Player 
let player;
let plist = [];
let hlist = []; // heart list
let da; // rock distance A
let db; // rock distance B
let dc; // rock distance C
let dd; // rock distance D

let health = 3;
let score; // player score
let ss = false;
let gmove = false;
let hit = false;

// Rocks
let rockA;
let rockB;
let rockC;
let rockD;

let rockArrayA = [];
let rockArrayB = [];
let rockArrayC = [];
let rockArrayD = [];


let platform;
let cave;
let reset;

// Game State
let win = false; // boolean
let victory;
let vcave;
let dead = false; // boolean
let defeat;
let dcave;
let survive;

let d;

// Music 
let theme1;
let theme2;
let theme3;
let theme4;

// Images
let pimgA;
let pimgL;
let pimgR;

let ilist = [];
let speedScale = [];

// Time Attributes
let startTime = 120;
let endTime = 0;
let totalTime;

let run = false; // run boolean

// Arduino variables
let serialPDM;
let portName = "/dev/tty.usbmodem113401";

// Sound Variables
let sound0 = new Tone.Player('music/483502__dominikbraun__let-me-see-ya-bounce-8-bit-music.mp3').toDestination(); // Menu Music
let sound1 = new Tone.Player('music/396024__patricklieberkind__rhythmic-game-menu-ambience.wav').toDestination(); // GamePlay Music
let sound2 = new Tone.Player('music/475148__rezyma__victoryff-swf.mp3').toDestination();
let sound3 = new Tone.Player('music/533034__evretro__8-bit-game-over-sound-tune.wav').toDestination();// game over

let mcount = 0;

function preload(){
  // Upload Spritesheets
  pimgA = loadImage("media/Miner(Idle-512x512).png");
  pimgL = loadImage("media/Miner(Left-512x512).png");
  pimgR = loadImage("media/Miner(Right-512x512).png");
  pimgD = loadImage("media/Rock Dodger(Damage).png");
  pimgH = loadImage("media/Rock Dodger(HeartB).png");

  rockA = loadImage("media/Rock Dodger(RockA-512x512).png");
  rockB = loadImage("media/Rock Dodger(RockB-512x512).png");
  rockC = loadImage("media/Rock Dodger(RockC-512x512).png");
  rockD = loadImage("media/Rock Dodger(RockE-512x512).png");

  title = loadImage("media/RockDodger(Title-960x256).png");
  icon = loadImage("media/Rock Dodger(Icon).png");
  platform = loadImage("media/Rock Dodger(OP).png");
  survive = loadImage("media/Rock Dodger(Survive-Title).png");
  cave = loadImage("media/Rock Dodger(background).png");
  dcave = loadImage("media/Rock Dodger(DS2).png");
  vcave = loadImage("media/Rock Dodger(VS).png");
  defeat = loadImage("media/Rock Dodger(DEAD).png");
  victory = loadImage("media/Rock Dodger(WIN).png");

  
  // Set-Up Arduino Connection
  serialPDM = new PDMSerial(portName);
}
function setup() {
  createCanvas(600, 600);

  // Insatntiate Player
  player = new Player(pimgA, 3);
  score = 0;

  for(let i = 0; i < 1; i++){
    plist.push(new Player(pimgA, 4))
  }

  // Agregate speeds for speedScale
  for(let i = 1; i <= 5; i+= .5){
    speedScale.push(i);
  }

  // Aggregate Rock Arrays
  for(let x = 0; x < 5; x++){
    rockArrayA.push(new Rock(rockA, random(speedScale[2], speedScale[5]), 100, 100));
  }
  for(let j = 0; j < 5; j++){
    rockArrayB.push(new Rock(rockB, random(speedScale[3], speedScale[6]), 120, 120));
  }
  for(let k = 0; k < 3; k++){
    rockArrayC.push(new Rock(rockC, random(speedScale[4], speedScale[7]), 140, 140));
  }
  for(let f = 0; f < 2; f++){
    rockArrayD.push(new Rock(rockD, random(speedScale[5], speedScale[8]), 180, 180));
  }

}
function draw() {
  background(0);

  // Game Time 
  if((frameCount % 60 == 0 && startTime > 0) && run){
    startTime--;
  }
  // Game Rendering
  if(!run && !dead && !win){

    
    strokeWeight(.5);

    // Text Setup
    textSize(20);
    text("Dev. By: Otis Jackson IV", 175, 330);
    text("Art. By: Otis Jackson IV", 180, 360)

    textSize(30);
    fill(255);
    rect(225, 445, 110, 60);
    fill('rgb(97, 118, 255)');
    rect(230, 450, 100, 50);
    fill('yellow');
    start = text("Start", 245, 485);

    image(title, 100, 200, 400, 130);
    image(icon, 40, -55, 500, 500);

    strokeWeight(7);
    line(400, 590, 560, 445); // bottom line : R
    stroke('white');
    
    line(350, 590, 550, 410); // top line : R
    stroke('white');
    
    line(150, 10, 30, 140); // top line : L
    stroke('white');

    line(200, 10, 30, 190); // top line : L
    stroke('white');


  } else if(run && !dead && !win){
    background(0);

    /* Render Sprites */

    // Draw Background
    image(cave, 10, 10, 580, 580);

  
    strokeWeight(1);
    // Draw Score
    textSize(25);
    fill('yellow');
    text("Score: " + score, 440, 120);

    fill('rgb(97, 118, 255)')
    text("Time: " + startTime, 440, 150);

    // Draw Player
    if (plist[0].getHealth() > 0){
    for(let p = 0; p < plist.length; p++){
        if(plist[p].getX() <= -10){
            plist[p].setX(0);
        } else if(plist[p].getX() >= 530){
          plist[p].setX(520);
        }
        plist[p].draw();
      }
    }

    // Draw Level Designed Elements
    image(platform, 10, 200, 590, 360);
    image(survive, 150, 20, 300, 100);

    // Game Conditions
    if(plist[0].getHealth() == 3){
      image(pimgH, 440, 20, 90, 90);
      image(pimgH, 470, 20, 90, 90);
      image(pimgH, 500, 20, 90, 90);
    } else if(plist[0].getHealth() == 2){
      image(pimgH, 470, 20, 90, 90);
      image(pimgH, 500, 20, 90, 90);
    } else if (plist[0].getHealth() == 1){
      image(pimgH, 500, 20, 90, 90);
    } else if (plist[0].getHealth() <= 0) {
      dead = true;
      run = false;
      serialPDM.transmit("dead", dead);
    } 
    
    if(plist[0].getHealth() > 0 && startTime == endTime){
      win = true;
      run = false;
    }

    // Draw Rocks
    for(let x = 0; x < 5; x++){
      if(rockArrayA[x].getY() > plist[0].getY() && rockArrayA[x].getY() <  plist[0].getY() + 5){
        if(plist[0].getHealth() > 0){
          reset = true;
          serialPDM.transmit('resetA', reset); 
          score = score + 1;
          rockArrayA[x].reset();
        } else {
          reset = false; 
        }
      }
      rockArrayA[x].draw();



      // Hit mechanics
      for(let t = 0; t < 1; t++){
        da = dist(plist[t].getX(), plist[t].getY(), rockArrayA[x].getX(), rockArrayA[x].getY());
        if((da <= 25 && da >= 20) && rockArrayA[x].getY() < 380){
          console.log('hit');
          if(plist[0].getHealth() > 0){
            hit = true;
            plist[0].damage = true; //////
            serialPDM.transmit("hit", hit);
            plist[0].decreaseHealth(); ////////
            rockArrayA[x].setY(0);
          }
        }
      }
    }
    for(let j = 0; j < 5; j++){
      if(rockArrayB[j].getY() > plist[0].getY() && rockArrayB[j].getY() <  plist[0].getY() + 5){
        if(plist[0].getHealth() > 0){
          reset = true;
          serialPDM.transmit('resetB', reset); 
          score = score + 5;
          rockArrayB[j].reset();
        } else{
          reset = false;
        }
      }
      rockArrayB[j].draw();
      for(let i = 0; i < 1; i++){
        db = dist(plist[i].getX(), plist[i].getY(), rockArrayB[j].getX(), rockArrayB[j].getY());
        if((db <= 25 && db >= 20) && rockArrayB[j].getY() < 370){
          //  console.log('hit');
          if(plist[0].getHealth() > 0){
            hit = true;
            plist[0].damage = true; //////
            serialPDM.transmit("hit", hit);
            plist[0].decreaseHealth(); ////////
            console.log(plist[0].getHealth());  //////////
            rockArrayB[j].setY(0);
            rockArrayB[j].setX(random(width-100));
          }

        }
      }
    }
    for(let k = 0; k < 3; k++){
      if(rockArrayC[k].getY() > plist[0].getY() && rockArrayC[k].getY() <  plist[0].getY() + 5){
        if(plist[0].getHealth() > 0){
          reset = true;
          serialPDM.transmit('resetC', reset); 
          score = score + 10;
          rockArrayC[k].reset();
        } else{
          reset = false;
        }
      }
      rockArrayC[k].draw();
      for(let i = 0; i < 1; i++){
        dc = dist(plist[i].getX(), plist[i].getY(), rockArrayC[k].getX(), rockArrayC[k].getY());
        if((dc <= 30 && dc >= 20.5) && rockArrayC[k].getY() < 370){
          if(plist[0].getHealth() > 0){
            hit = true;
            plist[0].damage = true; //////
            serialPDM.transmit("hit", hit);
            plist[0].decreaseHealth(); ////////
            console.log(plist[0].getHealth()); //////////
            rockArrayC[k].setY(0);
          }
        }
      }
    }
    for(let f = 0; f < 2; f++){
      if(rockArrayD[f].getY() > plist[0].getY() && rockArrayD[f].getY() <  plist[0].getY() + 5){
        if(plist[0].getHealth() > 0){
          reset = true;
          serialPDM.transmit('resetD', reset); 
          score = score + 25;
          rockArrayD[f].reset();
        } else{
          reset = false;
        }
      }
      rockArrayD[f].draw();
      for(let i = 0; i < 1; i++){
        dd = dist(plist[i].getX(), plist[i].getY(), rockArrayD[f].getX(), rockArrayD[f].getY());
        if((dd <= 60 && dd >= 45) && rockArrayD[f].getY() < 340){
          if(plist[0].getHealth() > 0){
            hit = true;
            plist[0].damage = true; //////
            serialPDM.transmit("hit", hit);
            plist[0].decreaseHealth(); ////////
            console.log(plist[0].getHealth()); //////////
            rockArrayD[f].setY(0);
          }
        }
      }
    } 
  } else if (!run && dead && !win){

    // Draw Background
    image(dcave, 10, 10, 580, 580);

    // Draw Score
    textSize(25);
    text("Score: " + score, 245, 280);

    // Draw Level Designed Elements
    image(platform, 10, 200, 590, 360);
    image(defeat, 150, 20, 300, 200);

    // Music
    sound1.stop();

  } else if (!run && !dead && win){
        // Draw Background
        image(vcave, 10, 10, 580, 580);

        // Draw Score
        textSize(25);
        fill('white');
        text("Score: " + score, 245, 280);
    
        // Draw Level Designed Elements
        image(platform, 10, 200, 590, 360);

        image(victory, 150, 20, 300, 200);

        // Music
        sound1.stop();
  }
}

function mouseClicked(){
  mcount++;
  console.log(mcount);
  sound0.start();
  if((mouseX >= 230 && mouseX <= 330) && (mouseY >= 444 && mouseY <= 500)){
    run = true;
    console.log("true");
    sound0.stop();
    sound1.start();
  }
}
function keyPressed(){
  gmove = true;
  if(keyCode == RIGHT_ARROW && gmove){
    for(let o = 0; o < plist.length; o++){
      plist[o].go(1);
    }
  }
  if(keyCode == LEFT_ARROW && gmove){
    for(let o = 0; o < plist.length; o++){
      plist[o].go(-1);
    }
  }
}
function keyReleased(){
  gmove = false;
  for(let o = 0; o < plist.length; o++){
    plist[o].stop();
  }
  if(!run && dead && !win){
    playDefeat();
  }
  if(!run && !dead && win){
    playVictory();
  }
}
function playDefeat(){
  sound3.start();
}
function playVictory(){
  sound2.start();
}

class Player{
  // Constructor
  constructor(img, speed){
    this.img = img;
    this.speed = speed;

    this.sx = 0;
    this.x = 230;
    this.y = 380;

    this.move = 0;
    this.facing = 1;

    this.hitX1 = this.x + 30; // hit box coordinate
    this.hitX2 = this.x - 30; // hit box coordinate
    this.hitY = this.y - 30; // hit box coordinate

    this.dead = false;
    this.alive = true;
    this.damage = false;
    this.health = 3;

  }

  //Methods
  getX(){
    return this.x;
  }
  getY(){
    return this.y;
  }
  getImg(){
    return this.img;
  }
  getState(){
    return this.alive;
  }
  getHealth(){
    return this.health;
  }
  setX(newX){
    this.x = newX;
  }
  setHealth(newHP){
    this.health = newHP;
  }
  setImg(newImg){
    this.img = newImg; 
  }
  setSpeed(nspeed){
    this.speed = nspeed;
  }
  setState(nbool){
    this.alive = nbool;
  }


  // Methods
  draw(){
    if(this.alive){
      push();      
      image(pimgA, this.x, this.y, 120, 120);
      
      if(this.move == 1){
        this.damage = false;
        image(pimgR, this.x, this.y, 120, 120);
      }
      else if(this.move == -1){
        this.damage = false;
        image(pimgL, this.x, this.y, 120, 120);
      }

      if(this.damage){
        image(pimgD, this.x, this.y, 120, 120);
      }


      if(frameCount % 5 == 0){
        this.sx = (this.sx+1) % 8;
      }
      this.x += 5 * this.move;
      pop();
    }
  }
  go(direction){
    this.move = direction;
    this.facing = direction;
    this.sx = 3;
  }
  stop(){
    if(!gmove){
      this.move = 0;
    }
  }
  decreaseHealth(){
    this.health = this.health - 1;
  }
}
class Rock{
  // Constructor
  constructor(img, speed, w, h){
    this.img = img;
    this.speed = speed;
    this.sx = 0;
    this.x = random(width-100);
    this.y = random(0, 50);
    this.move = 1;
    this.w = w;
    this.h = h;
    this.d;
  }

  // Methods
  getX(){
    return this.x;
  }
  getY(){
    return this.y;
  }
  getImg(){
    return this.img;
  }
  getSpeed(){
    return this.speed;
  }


  setX(newX){
    this.x = newX;
  }
  setY(newY){
    this.y = newY;
  }
  setImg(nimg){
    this.img = nimg;
  }
  setSpeed(nspeed){
    this.speed = nspeed;
  }

  draw(){
    if(run){
      push();
      image(this.img, this.x, this.y, this.w, this.h);
      this.move = 1;
      if(this.y < 600){
        this.y += this.speed * this.move;
      }
      this.reset();
      pop();
    }
  }
  go(direction){
    this.move = direction;
    this.sx = 3;
  }
  reset(){
    if(this.y >= 600){
      this.y = 0;
      this.x = random(width-100);
    }
  }

}
