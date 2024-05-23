let gameState = "start";
let mouseWasPressed = false;
// let mouseState = "neutral";

let units = [];
const unitCount = 15;
let timer = 60;
let oldTimer = timer;
let points = 0;
let oldPoints = 0;
let displayScore = 0;

let logo;
let startBackground;
let levelBackground;
let gameTitle;

let holeTextures;

let defaultHand;
let pettingHand;
let punchHand;
let shiftHand;

let basicEnemySprites;
let vikingEnemySprites;
let basicAnimalSprites;
let greenAnimalSprites;
let richAnimalSprites;

function preload() {
  logo = loadImage("./background/logo.webp");

  startBackground = loadImage("./background/startscreen.webp");
  levelBackground = loadImage("./background/backgroundgame.webp");

  gameTitle = loadFont("./fonts/gamefont.ttf");

  //Load hands
  //If shift pressed
  shiftHand = loadImage("./hands/Shift.webp");
  //If mouse pressed
  punchHand = loadImage("./hands/Punch.webp");
  //If shift and mouse pressed
  pettingHand = loadImage("./hands/Pet.webp");
  //Else
  defaultHand = loadImage("./hands/Normal.webp");

  //Mole hole parts
  holeTextures = [
    loadImage("./hole/HoleBack.webp"),
    loadImage("./hole/HoleFront.webp"),
  ];

  //Enemies basic
  basicEnemySprites = [
    loadImage("units/enemies/Basic/Happy.webp"),
    loadImage("units/enemies/Basic/Hover.webp"),
    loadImage("units/enemies/Basic/Normal.webp"),
    loadImage("units/enemies/Basic/Sad.webp"),
  ];

  //Viking
  vikingEnemySprites = [
    loadImage("units/enemies/Viking/Happy.webp"),
    loadImage("units/enemies/Viking/Hover.webp"),
    loadImage("units/enemies/Viking/Normal.webp"),
    loadImage("units/enemies/Viking/Sad.webp"),
  ];

  //Friendly animals :) basic
  basicAnimalSprites = [
    loadImage("units/friends/Basic/Happy.webp"),
    loadImage("units/friends/Basic/Hover.webp"),
    loadImage("units/friends/Basic/Normal.webp"),
    loadImage("units/friends/Basic/Sad.webp"),
  ];

  //Green bow tie animals, cute
  greenAnimalSprites = [
    loadImage("units/friends/Green/Happy.webp"),
    loadImage("units/friends/Green/Hover.webp"),
    loadImage("units/friends/Green/Normal.webp"),
    loadImage("units/friends/Green/Sad.webp"),
  ];

  //Rich animals
  richAnimalSprites = [
    loadImage("units/friends/Rich/Happy.webp"),
    loadImage("units/friends/Rich/Hover.webp"),
    loadImage("units/friends/Rich/Normal.webp"),
    loadImage("units/friends/Rich/Sad.webp"),
  ];
}

function setup() {
  frameRate(60);
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  ellipseMode(CENTER);
  noStroke();
  noCursor();

  textFont(gameTitle);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
}

//3 lines of code from https://p5js.org/reference/#/p5/windowResized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  //background(143, 170, 244);
  background(215, 249, 255);
  mousePressTracker();
  // mouseEventTracker();

  switch (gameState) {
    case "start":
      drawStartScreen();

      //following 1 row part chatgpt "how to do this simpler (set up the object on one row)"

      break;
    case "game":
      drawBackground();
      drawHeadsUpDisplay();

      if (units.length === 0) {
        populatePlayingField();
      }
      //For loop in draw because it limits animations to framerate
      for (let i = 0; i < unitCount; i++) {
        drawPlayingField(unitCount - i - 1);
      }
      //for loop in the function for unlimited speed maybe not necessary
      updatePlayingField();

      timer = timer - 1 / 60;
      //Changed so it is same as on screen timer
      if (oldTimer <= 0) {
        gameState = "gameover";
      }
      break;

    case "gameover":
      drawGameOverScreen();
      break;
  }
  drawHand();
}

function drawStartScreen() {
  push();
  imageMode(CORNER);
  background(82, 211, 253);
  const img = startBackground;
  const ratio = img.height / img.width;
  image(img, 0, 0, (height / ratio) * 1.1, height * 1.1);
  pop();

  const startButton = new Button(width / 2, height / 1.77, 165, 52, "START", [
    "#82cb54",
    "#aaffaa",
  ]);

  image(
    logo,
    width / 2,
    height / 4,
    Math.max(width, height) / 3,
    ((Math.max(width, height) / 3) * logo.height) / logo.width
  );

  //display cute hamsters
  image(basicAnimalSprites[1], width / 2 + 60, height / 1.4);
  image(basicAnimalSprites[2], width / 2 - 60, height / 1.4);
  image(richAnimalSprites[0], width / 2 + 20, height / 1.4);
  image(greenAnimalSprites[0], width / 2 - 20, height / 1.4);

  //display enemy hamsters
  image(basicEnemySprites[2], width / 2 + 60, height / 1.18);
  image(basicEnemySprites[3], width / 2 - 20, height / 1.18);
  image(vikingEnemySprites[0], width / 2 + 20, height / 1.18);
  image(vikingEnemySprites[1], width / 2 - 60, height / 1.18);
  textSize(width / 100 + height / 100);
  fill(124, 77, 46);
  text(
    "Press shift and click to pet cute hamsters",
    width * 0.5,
    height * 0.77
  );
  text("Click to attack evil rats", width * 0.5, height * 0.91);

  if (startButton.listen()) {
    gameState = "game";
  }
  startButton.draw();
}

function drawGameOverScreen() {
  background(82, 56, 45);

  textSize(width / 50 + height / 50);
  fill(255);
  text("GOOD GAME!", width * 0.5, height * 0.1);
  textSize(width / 70 + height / 70);

  //score increases slowly
  if (displayScore < points) {
    displayScore += 2;
  } else if (displayScore > points) {
    displayScore = points;
  }

  text("Score - " + displayScore, width * 0.5, height * 0.17);
  //display cute hamsters
  drawSpriteRow();

  textSize(width / 100 + height / 100);
  fill(124, 77, 46);

  const gameoverButton = new Button(
    width / 2,
    height / 1.7,
    190,
    54,
    "Play again",
    ["#00c46b", "#32f29c"]
  );

  if (gameoverButton.listen()) {
    resetValues();
    gameState = "game";
  }
  gameoverButton.draw();
}

function drawSpriteRow() {
  const spriteW = basicAnimalSprites[0].width * 2;
  const spriteH = basicAnimalSprites[0].height * 2;
  const spacing = spriteW * 1.2 - 21.5;

  //display gameover animals
  image(
    basicAnimalSprites[2],
    width / 2 - spacing * 2,
    height / 3,
    spriteW,
    spriteH
  );
  image(
    richAnimalSprites[1],
    width / 2 - spacing * 3,
    height / 3,
    spriteW,
    spriteH
  );

  image(
    greenAnimalSprites[0],
    width / 2 - spacing,
    height / 3,
    spriteW,
    spriteH
  );

  //display enemy hamsters
  image(
    basicEnemySprites[1],
    width / 2 + spacing,
    height / 3,
    spriteW,
    spriteH
  );
  image(
    vikingEnemySprites[1],
    width / 2 + spacing * 2,
    height / 3,
    spriteW,
    spriteH
  );
  image(
    vikingEnemySprites[0],
    width / 2 + spacing * 3,
    height / 3,
    spriteW,
    spriteH
  );
}

function drawBackground() {
  const img = levelBackground;
  push();
  imageMode(CORNER);

  //Same color as the grass, useful to the game scaleable
  background(130, 203, 84);
  const ratio = img.height / img.width;

  image(
    levelBackground,
    0,
    0 + Math.min(width, height) / 150 - Math.max(width, height) / 3,
    width,
    //Math for the height with same ratio as image done by chat gpt
    width * ratio
  );
  pop();
}

function drawHeadsUpDisplay() {
  timerDisplay();
  pointsDisplay();
}

function resetValues() {
  //base values
  timer = 60;
  points = 0;
  oldTimer = timer;
  oldPoints = 0;
  //clear the array
  units = [];
}
class ClickBox {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    //Default inactive meaning cursor isnt inside coordinates
    this.state = "inactive";
  }

  listen() {
    const wRadius = this.w / 2;
    const hRadius = this.h / 2;

    //check if cursor is inside coordinates
    //measures from centerpoint which is why radius is used. Probably radius is wrong word
    if (
      mouseX < this.x + wRadius &&
      mouseX > this.x - wRadius &&
      mouseY < this.y + hRadius &&
      mouseY > this.y - hRadius
    ) {
      if (mouseIsPressed && !mouseWasPressed) {
        this.state = "click";
        mouseWasPressed = true;
      } else {
        this.state = "hover";
      }
    } else {
      this.state = "inactive";
    }
  }
}

class Button extends ClickBox {
  constructor(x, y, w, h, text, hues, radius = 25, callback = true) {
    super(x, y, w, h);
    this.text = text;
    this.hues = hues;
    this.r = radius;
    this.do = callback;
  }
  listen() {
    super.listen();
    if (this.state === "click") {
      return this.do;
    }
  }
  draw() {
    push();
    //change color depending on where the cursor is.
    switch (this.state) {
      case "hover":
      case "click":
        fill(this.hues[1]);
        break;
      default:
        fill(this.hues[0]);
        break;
    }
    rect(this.x, this.y, this.w, this.h, this.r);
    pop();
    textSize(20);
    fill(255);
    //using this.text makes us being able to change the value inside, displays correct text
    text(this.text, this.x, this.y);
  }
}

//Unsure whether to call Unit or frenemies since its friends and enemies
class Square extends ClickBox {
  constructor(index) {
    super();
    this.index = index;
    this.w = (1.2 * width + height) * (43 / 1000);
    this.h = (1.2 * width + height) * (54 / 1000);
    this.animateY = this.h;
    this.health = 1;
    this.maxPets = 1;
    this.lifetime = 1;
    this.pointsForKill = 0;
    this.timeForKill = 0;
    this.pointsForPet = 0;
    this.timeForDespawn = 0;
    this.hues = ["#f00", "#fffeee", "#ff4747"];
    this.lifeState = "birth";
    this.sprites = basicAnimalSprites;
  }
  listen() {
    super.listen();
  }
  draw() {
    //The coordinates of the center of the playing field
    const centerX = width / 2;
    const centerY = height / 1.8;
    //Spacing between each hole
    const xSpacing = width / 68;
    const ySpacing = height / 34;
    //Calculating which row and column each unit index corresponds too
    const col = this.index % 3;
    const row = Math.floor(this.index / 3);
    //Draw the unit at the calculated coordinates, and calibrate to center
    this.x = centerX + (xSpacing + this.w) * (2 - row);
    this.y = centerY + (ySpacing + this.h) * (1 - col);

    //Always draw hole
    image(holeTextures[0], this.x, this.y + this.h / 2.4, this.w, this.w);
  }
}

class Unit extends Square {
  constructor(index) {
    super(index);
  }
  listen() {
    super.listen();

    //frameRate returns the amount of frames in a second, so this should remove 1 lifetime every second.
    this.lifetime -= 1 / frameRate();

    if (this.state === "click") {
      if (keyIsDown(16)) {
        this.maxPets -= 1; //reduces pet counter by one on click
      } else {
        this.health -= 1;
      }
    }

    if (
      (this.health < 1 || this.lifetime < 1 || this.maxPets < 1) &&
      this.lifeState !== "dying"
    ) {
      if (this.health < 1) {
        points += this.pointsForKill;
        timer += this.timeForKill;
        text(
          this.pointsForKill - (points - oldPoints) + " pts",
          this.x,
          this.y - this.animateY
        );
        text(
          this.timeForKill - (timer - oldTimer) + " s",
          this.x,
          this.y - 25 - this.animateY
        );
      } else if (this.maxPets < 1) {
        points += this.pointsForPet;
        text(
          this.pointsForPet - (points - oldPoints) + " pts",
          this.x,
          this.y - this.animateY
        );
      } else {
        timer += this.timeForDespawn;
        text(
          this.timeForDespawn - (points - oldPoints) + " s",
          this.x,
          this.y - this.animateY
        );
      }
      this.lifeState = "dying";
    }

    if (this.animateY >= this.h && this.lifeState === "dying") {
      units[this.index] = new Empty(this.index);
    }
  }

  draw() {
    super.draw();
    let sprite = this.sprites[2];

    if (
      this.state === "click" ||
      (mouseIsPressed && this.state !== "inactive")
    ) {
      if (keyIsDown(16)) {
        sprite = this.sprites[0];
      } else {
        sprite = this.sprites[3];
      }
    } else if (this.state === "hover") {
      sprite = this.sprites[1];
    }

    if (this.lifeState === "birth") {
      if (this.animateY > 0) {
        this.animateY = this.animateY - 8;
      } else {
        this.animateY = 0;
        this.lifeState = "alive";
      }
    }
    //Animate on death, and show text with points and time gained / lost
    if (this.lifeState === "dying") {
      this.animateY = this.animateY + 8;
      if (this.health < 1) {
        if (this.pointsForKill !== 0) {
          text(this.pointsForKill + " pts", this.x, this.y - this.animateY);
        }
        if (this.timeForKill !== 0) {
          text(this.timeForKill + " s", this.x, this.y - 25 - this.animateY);
        }
      } else if (this.maxPets < 1) {
        if (this.pointsForPet !== 0) {
          text(this.pointsForPet + " pts", this.x, this.y - this.animateY);
        }
      } else {
        if (this.timeForDespawn !== 0) {
          text(this.timeForDespawn + " s", this.x, this.y - this.animateY);
        }
      }
    }

    image(sprite, this.x, this.y + this.animateY, this.w, this.h);
    push();
    //Same as background
    fill(130, 203, 84);
    rect(this.x, this.y + this.h + 2, this.w, this.h);
    pop();
    image(holeTextures[1], this.x, this.y + this.h / 2.4, this.w, this.w);

    if (this.state != "inactive") {
      console.log(this.state);
    }
  }
}

class Animal extends Unit {
  constructor(index) {
    super(index);
  }
}

class BasicAnimal extends Animal {
  constructor(index) {
    super(index);
    this.health = 2;
    this.maxPets = 1;
    this.lifetime = 10;
    this.pointsForKill = -35;
    this.timeForKill = -25;
    this.pointsForPet = 25;
    this.timeForDespawn = -10;
    this.sprites = basicAnimalSprites;
  }
}
class RichAnimal extends Animal {
  constructor(index) {
    super(index);
    this.health = 1;
    this.maxPets = 7;
    this.lifetime = 7;
    this.pointsForKill = -50;
    this.timeForKill = -25;
    this.pointsForPet = 100;
    this.timeForDespawn = -10;
    this.sprites = richAnimalSprites;
  }
}

class GreenAnimal extends Animal {
  constructor(index) {
    super(index);
    this.health = 1;
    this.maxPets = 5;
    this.lifetime = 10;
    this.pointsForKill = -100;
    this.timeForKill = -50;
    this.pointsForPet = 25;
    this.timeForDespawn = -15;
    this.sprites = greenAnimalSprites;
  }
}

class Enemy extends Unit {
  constructor(index, health, lifetime, pointsReward, timeReward) {
    super(index, health, lifetime, pointsReward, timeReward);
  }
}

class BasicEnemy extends Enemy {
  constructor(index) {
    super(index);
    this.health = 1;
    this.maxPets = this.health;
    this.lifetime = 7;
    this.pointsForKill = 0;
    this.timeForKill = 5;
    this.pointsForPet = -50;
    this.timeForDespawn = -10;
    this.sprites = basicEnemySprites;
  }
}
class VikingEnemy extends Enemy {
  constructor(index) {
    super(index);
    this.health = 5;
    this.maxPets = 3;
    this.lifetime = 15;
    this.pointsForKill = 0;
    this.timeForKill = 15;
    this.pointsForPet = -50;
    this.timeForDespawn = -15;
    this.sprites = vikingEnemySprites;
  }
}

class Empty extends Square {
  constructor(position) {
    super(position);
    const timeFactor = 0.5 + Math.random() * 2;
    this.lifetime = 3 * timeFactor;
  }
  listen() {
    this.lifetime -= 1 / frameRate();
    if (this.lifetime < 1) {
      units[this.index] = newUnit(this.index);
    }
  }
  draw() {
    super.draw();
  }
}

function mousePressTracker() {
  if (mouseWasPressed && !mouseIsPressed) {
    mouseWasPressed = false;
  }
}

function drawPlayingField(i) {
  units[i].draw();
}

function updatePlayingField() {
  for (let i = 0; i < unitCount; i++) {
    units[i].listen();
  }
}

//draws a wave of random units
function populatePlayingField() {
  for (let i = 0; i < unitCount; i++) {
    units.push(newUnit(i));
  }
}

function newUnit(i) {
  //If player is doing well more units spawn
  const chance = Math.max(20, 150 - Math.max(50, timer * 1.5));
  const type = Math.floor(Math.random() * chance);
  let unit;
  switch (type) {
    case 0:
    case 1:
    case 2:
      unit = new BasicAnimal(i);
      break;
    case 3:
      unit = new RichAnimal(i);
      break;
    case 4:
    case 5:
      unit = new GreenAnimal(i);
      break;
    case 6:
    case 7:
    case 8:
      unit = new BasicEnemy(i);
      break;
    case 9:
    case 10:
      unit = new VikingEnemy(i);
      break;

    default: //need to track empty cells with empty unit type
      unit = new Empty(i);
      break;
  }
  return unit;
}

function drawHand() {
  // so that it is possible to change the value of default hand
  let activeHand = defaultHand;

  if (mouseIsPressed) {
    if (keyIsDown(16)) {
      activeHand = pettingHand;
    } else {
      activeHand = punchHand;
    }
  } else if (keyIsDown(16)) {
    activeHand = shiftHand;
  }

  image(
    activeHand,
    mouseX,
    mouseY,
    width / 26 + height / 11,
    width / 26 + height / 11
  );
}

function timerDisplay() {
  if (oldTimer < timer) oldTimer++;
  else if (oldTimer > timer + 1) {
    oldTimer -= 1;
  }

  push();
  fill(120, 190, 74);
  textSize(30);
  textAlign(LEFT);
  text(
    "TIME-" + Math.floor(Math.max(oldTimer, 0)) + "s",
    width * 0.7,
    height * 0.05
  );
  pop();
}
function pointsDisplay() {
  if (points < 0) {
    points = 0;
  }

  //Animate points tally
  if (oldPoints < points) oldPoints++;
  else if (oldPoints !== points) {
    oldPoints -= 1;
  }

  push();
  fill(120, 190, 74);
  textSize(30);
  textAlign(RIGHT);
  text("POINTS-" + oldPoints, width * 0.3, height * 0.05);
  pop();
}
