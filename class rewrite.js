let gameState = "start";
let centerX = 0;
let centerY = 0;
let units = [];
const unitCount = 15;
let timer = 1000;
let points = 0;
let img;

function preload() {
  img = loadImage("img/cinnamonroll.jpg");
  startImage = loadImage("img/startscreen.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  ellipseMode(CENTER);
  noStroke();
  noCursor();
  textAlign(CENTER, CENTER);
}

function draw() {
  //background(143, 170, 244);
  background(215, 249, 255);

  switch (gameState) {
    case "start":
      //following 1 row part chatgpt "how to do this simpler (set up the object on one row)"
      const startButton = new Button(width / 2, height / 2, 100, 40, "Start", [
        "#00ff00",
        "#aaffaa",
      ]);
      if (startButton.listen()) {
        gameState = "game";
      }
      startButton.draw();

      break;
    case "game":
      background(img, windowWidth, windowHeight);

      if (units.length === 0) {
        populatePlayingField();
      }
      drawPlayingField();

      timer = timer - 1 / 60;
      if (timer <= 0) {
        gameState = "gameover";
        centerX = 0;
        centerY = 0;
      }
      break;

    case "gameover":
      background(34, 34, 34);

      //gameover screen and button appears
      drawTestRectangle(width / 2, height / 2, 200, 75, [255, 52, 52]);

      //reset values
      timer = 10;
      points = 0;

      break;
  }

  drawHand();
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
      this.state = "hover";
      if (mouseIsPressed) {
        this.state = "click";
      }
    }
  }
}

class Button extends ClickBox {
  constructor(x, y, w, h, text, hues, radius = 20, callback = true) {
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
    //Draw the rectangle
    if (this.state != "inactive") {
      console.log(this.state);
    }
    rect(this.x, this.y, this.w, this.h, this.r);
    pop();
    textSize(20);
    fill(0);
    //using this.text makes us being able to change the value inside, displays correct text
    text(this.text, this.x, this.y);
  }
}

//Unsure whether to call Unit or frenemies since its friends and enemies
class Unit extends ClickBox {
  constructor(index) {
    super();
    this.index = index;
    this.w = width / 17;
    this.h = width / 11;
    this.health = 1;
    this.maxPets = 1;
    this.lifetime = 1;
    this.pointsReward = 0;
    this.timeReward = 0;
    this.hues = ["#f00", "#fffeee", "#ff4747"];
  }
  listen() {
    super.listen();

    //frameRate returns the amount of frames in a second, so this should remove 1 lifetime every second.
    this.lifetime -= 1 / frameRate();

    if (this.state === "click" && (mouseButton === RIGHT || keyIsDown(SHIFT))) {
      this.maxPets -= 1; //reduces pet counter by one on click
    }
    if (this.state === "click" && mouseButton === LEFT) {
      this.health -= 1; //reduces health by one on click
    }
    if (this.health < 1 || this.lifetime < 1) {
      if (this.health < 1) {
        points += this.pointsReward;
        timer += this.timeReward;
      } else {
        timer -= this.timeReward; //time reward is currently time punishment aswell
      }
      units[this.index] = new Empty(this.index);
    }
  }
  draw() {
    switch (this.state) {
      case "hover":
        fill(this.hues[1]);
        break;
      case "click":
        fill(this.hues[2]);
        break;
      default:
        fill(this.hues[0]);
        break;
    }
    // const row = i % 3;
    // const col = Math.floor(i / 3);
    // const x = 25 * col;
    // const y = 50 * row;
    const col = this.index % 3;
    const row = Math.floor(this.index / 3);
    const y = (10 + this.h) * row;
    const x = (10 + this.w) * col;
    rect(x, y, this.w, this.h);
    if (this.state != "inactive") {
      console.log(this.state);
    }
  }
}

class Animal extends Unit {
  constructor(index) {
    super(index);
    this.hues = ["#0f0", "#fffeee", "#99ff99"];
  }
  listen() {
    super.listen();
  }
  draw() {
    super.draw();
  }
}

class BasicAnimal extends Animal {
  constructor(index) {
    super(index);
    this.health = 1;
    this.maxPets = this.health;
    this.lifetime = 60;
    this.pointsReward = 10;
    this.timeReward = 5;
  }
}

class Enemy extends Unit {
  constructor(index, health, lifetime, pointsReward, timeReward) {
    super(index, health, lifetime, pointsReward, timeReward);
  }
  listen() {
    super.listen();
  }
  draw() {
    super.draw();
  }
}

class BasicEnemy extends Enemy {
  constructor(index) {
    super(index);
    this.health = 1;
    this.maxPets = this.health;
    this.lifetime = 60;
    this.pointsReward = 10;
    this.timeReward = 5;
  }
}

class Empty extends Unit {
  constructor(position) {
    super(position);
    const timeFactor = 0.5 + Math.random() * 2;
    this.lifetime = 150 * timeFactor;
  }
  listen() {
    this.lifetime -= 1;
    if (this.lifetime < 1) {
      units[this.index] = newUnit(this.index);
    }
  }
  draw() {}
}

function drawPlayingField() {
  for (let i = 0; i < unitCount; i++) {
    units[i].draw();
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
  const type = Math.floor(Math.random() * 15);
  let unit;
  switch (type) {
    case 0:
      unit = new BasicAnimal(i);
      break;
    case 1:
      unit = new BasicEnemy(i);
      break;
    default: //need to track empty cells with empty unit type
      unit = new Empty(i);
      break;
  }
  return unit;
}

//doesnt create new
function unitClick(position) {
  //make the units place empty (todo - only few seconds then add a random new unit)
  if (units[position].lives > 0) {
    //reduce lives by one each click
    units[position].lives -= 1;
    console.log(units[position].lives);
  } else {
    points = points + units[position].points;
    units[position] = {
      color: [0, 0, 0, 0],
      lives: 3,
      lifetime: 100,
      points: -1,
    };
  }
}

function drawHand() {
  push();
  fill(255);
  noCursor();
  if (mouseIsPressed) {
    fill(255, 0, 0);
  }
  ellipse(mouseX, mouseY, width / 34 + height / 34);
  pop();
}

function drawTestRectangle(x, y, w, h, color) {
  fill(color);
  //make the unit smaller than the hitbox slightly, so the cursor hits easily
  rect(x, y, w / 1.2, h / 1.2, 20); //20 adds radius
}

function timerCount() {
  push();
  fill(220, 100, 220);
  textSize(30);
  textAlign(LEFT);
  text("TIMER − " + Math.floor(timer) + "s", width * 0.7, height * 0.05);
  pop();
}
function pointsCount() {
  push();
  fill(220, 100, 220);
  textSize(30);
  textAlign(RIGHT);
  text("Points − " + points, width * 0.3, height * 0.05);
  pop();
}