let gameState = "start";
let mouseWasPressed = false;
// let mouseState = "neutral";
let centerX = 0;
let centerY = 0;
let units = [];
const unitCount = 15;
let timer = 30;
let points = 0;
let value = 0;

let img;
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
  startBackground = loadImage("./background/startscreen.webp");
  levelBackground = loadImage("./background/backgroundgame.webp");

  //Load hands
  // gameTitle = loadFont("/fonts/gamefont.TTF");

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
    // loadImage("./hole/Holefront.webp"),
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
  //following 3 lines written by CHATGPT
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
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
      const startButton = new Button(width / 2, height / 2, 165, 52, "START", [
        "#82cb54",
        "#aaffaa",
      ]);

      textFont(gameTitle);
      textSize(width / 50 + height / 40);
      fill(124, 77, 46);
      text("HAMSTER GARDEN INVASION", width * 0.5, height * 0.1);

      textSize(width / 100 + height / 100);
      fill(124, 77, 46);
      text(
        "Press shift and click to pet cute hamsters",
        width * 0.5,
        height * 0.8
      );
      text("Click to attack evil hamsters", width * 0.5, height * 0.9);

      if (startButton.listen()) {
        gameState = "game";
      }
      startButton.draw();

      break;
    case "game":
      drawBackground(levelBackground);
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
      if (timer <= 0) {
        gameState = "gameover";
        centerX = 0;
        centerY = 0;
      }
      break;

    case "gameover":
      background(82, 56, 45);
      resetValues();

      textSize(width / 50 + height / 50);
      fill(255);
      text("GAME OVER :(", width * 0.5, height * 0.1);

      const gameoverButton = new Button(
        width / 2,
        height / 2,
        185,
        52,
        "Try again",
        ["#a50000", "#cc0a0a"]
      );

      if (gameoverButton.listen()) {
        gameState = "game";
      }
      gameoverButton.draw();

      break;
  }
  drawHand();
}

function drawStartScreen() {
  push();
  imageMode(CORNER);
  background(82, 211, 253);
  image(
    startBackground,
    0,
    height - 1.8 * startBackground.height,
    width,
    height
  );
  pop();
}

function drawBackground(img) {
  push();
  imageMode(CORNER);
  background(130, 203, 84);
  const ratio = img.height / img.width;

  image(
    levelBackground,
    0,
    // 0 - (width / 4 + (height / 4) * ratio),
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
  //reset values
  timer = 30;
  points = 0;
  //clear the array
  units = [];
}
class ClickBox {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.state = "inactive";
  }

  listen() {
    const wRadius = this.w / 2;
    const hRadius = this.h / 2;

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
      } else if (this.maxPets < 1) {
        points += this.pointsForPet;
      } else {
        timer += this.timeForDespawn;
      }
      this.lifeState = "dying";
    }

    if (this.animateY >= this.h && this.lifeState === "dying") {
      units[this.index] = new Empty(this.index);
    }
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

    if (this.lifeState === "dying") {
      this.animateY = this.animateY + 8;
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
    this.health = 3;
    this.maxPets = 1;
    this.lifetime = 10;
    this.pointsForKill = -25;
    this.timeForKill = -10;
    this.pointsForPet = 25;
    this.timeForDespawn = -5;
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
    this.timeForKill = -10;
    this.pointsForPet = 100;
    this.timeForDespawn = -5;
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
    this.timeForKill = -15;
    this.pointsForPet = 25;
    this.timeForDespawn = -5;
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
    this.timeForDespawn = -5;
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
    this.timeForDespawn = -10;
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

// function InputTracker() {
//   if (mouseIsPressed && mouseState !== "click") {
//     mouseState = "click";
//   }
// }

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
  const type = Math.floor(Math.random() * 50);
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
  push();
  fill(120, 190, 74);
  textSize(30);
  textAlign(LEFT);
  text("TIMER " + Math.floor(timer) + "s", width * 0.7, height * 0.05);
  pop();
}
function pointsDisplay() {
  //Animate points tally
  if (value < points) value++;
  else {
    value = points;
  }
  push();
  fill(120, 190, 74);
  textSize(30);
  textAlign(RIGHT);
  text("POINTS-" + value, width * 0.3, height * 0.05);
  pop();
}
