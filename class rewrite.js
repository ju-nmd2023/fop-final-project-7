let gameState = "start";
let centerX = 0;
let centerY = 0;
let units = [];
const unitCount = 15;
let timer = 1;
let points = 0;
let img;

function preload() {
  img = loadImage("img/cinnamonroll.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  ellipseMode(CENTER);
  noStroke();
  noCursor();
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
    rect(this.x, this.y, this.w, this.h, this.r);
    pop();
  }
}

class Unit extends ClickBox {
  constructor(x, y, health, lifetime, pointsReward, timeReward) {
    super(x, y);
    this.w = 80;
    this.h = 120;
    this.health = health;
    this.maxPets = health;
    this.lifetime = lifetime;
    this.pointsReward = pointsReward;
    this.timeReward = timeReward;
    this.hues = ["#fff", "#fffeee", "#ff4747"];
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

    if (this.health < 1) {
      points += this.pointsReward;
      timer += this.timeReward;
    }
    if (this.lifetime < 1) {
      timer -= this.timeReward; //time reward is currently time punishment aswell
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
    rect(x, y, w, h);
  }
}

class Friend extends Unit {
  constructor(x, y, health, lifetime, pointsReward, timeReward) {
    super(x, y, health, lifetime, pointsReward, timeReward);
  }
  listen() {
    super.listen();
  }
  draw() {
    super.draw();
  }
}

class Enemy extends Unit {
  constructor(x, y, health, lifetime, pointsReward, timeReward) {
    super(x, y, health, lifetime, pointsReward, timeReward);
  }
  listen() {
    super.listen();
  }
  draw() {
    super.draw();
  }
}
// class Empty extends Unit {
//   constructor(x, y, lifetime) {
//     super(x, y, lifetime);
//   }
//   listen() {
//     if (this.state === "click" && mouseButton === LEFT) {
//       this.health -= 1; //reduces health by one on click
//     }
//     super.listen();
//   }
// }

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
      //necessary to center and calibrate click
      centerX = (5 * (width / 12) + 25 * 2.5) / 2;
      centerY = (5 * (width / 8) + 50) / 2;
      if (units.length === 0) {
        populatePlayingField();
      }
      drawPlayingField();
      handleUnits();
      timerCount();
      pointsCount();

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

      //gameover button appears
      if (createClickArea(width / 2, height / 2, 200, 75, 1)) {
        gameState = "game";
      }
      break;
  }

  drawHand();
}

function handleUnits() {
  for (let i = 0; i < unitCount; i++) {
    if (units[i].lifetime > 0) {
      units[i].lifetime -= 0.5;
    } else {
      units[i] = newUnit();
    }
  }
}

function drawPlayingField() {
  for (let i = 0; i < unitCount; i++) {
    drawHitBox(i, units[i]);
  }
}

//draws a wave of random units
function populatePlayingField() {
  for (let i = 0; i < unitCount; i++) {
    units.push(newUnit());
  }
}

// function deez() {}

function newUnit() {
  const type = Math.floor(Math.random() * 23);
  const timeFactor = 0.5 + Math.random() * 2;
  let unitType;
  switch (type) {
    case 0:
      unitType = { color: [255, 0, 0], lives: 1, lifetime: 100, points: 50 };
      break;
    case 1:
      unitType = { color: [0, 0, 255], lives: 10, lifetime: 100, points: 10 };
      break;
    case 2:
    case 3:
      unitType = { color: [0, 255, 0], lives: 15, lifetime: 100, points: 25 };
      break;
    default: //Empty unit
      unitType = {
        color: [0, 0, 0, 0],
        lives: 3,
        lifetime: 50 * timeFactor,
        points: -1, //remove points for missing
      };
      break;
  }
  return unitType;
}

function drawHitBox(position, unit) {
  const w = width / 12;
  const h = width / 8;
  const row = position % 3;
  const col = Math.floor(position / 3);
  const x = (w + 25) * col;
  const y = (w + 50) * row;

  //create the create click area
  createClickArea(x, y, w, h, position);
  push();
  translate(centerX, centerY);
  drawTestRectangle(x, y, w, h, unit.color);
  pop();
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
