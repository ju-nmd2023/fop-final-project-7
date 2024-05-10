let gameState = "game";
let centerX = 0;
let centerY = 0;
let units = [];
const unitCount = 15;
let timer = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  ellipseMode(CENTER);
  noStroke();
}

function draw() {
  background(143, 170, 244);

  switch (gameState) {
    case "start":
      if (createClickArea(width / 2, height / 2, 200, 75, 1)) {
        gameState = "game";
      }
      break;
    case "game":
      //necessary to center and calibrate click
      centerX = (5 * (width / 12) + 25 * 2.5) / 2;
      centerY = (5 * (width / 8) + 50) / 2;
      if (units.length === 0) {
        populatePlayingField();
      }
      drawPlayingField();
      handleUnits();
      break;
  }

  timerCount();
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
      unitType = { color: [255, 0, 0], lives: 5, lifetime: 100 };
      break;
    case 1:
      unitType = { color: [0, 0, 255], lives: 10, lifetime: 100 };
      break;
    case 2:
    case 3:
      unitType = { color: [0, 255, 0], lives: 15, lifetime: 100 };
      break;
    default: //Empty unit
      unitType = {
        color: [0, 0, 0, 0],
        lives: "empty",
        lifetime: 50 * timeFactor,
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
  drawTestRectangle(x, y, w, h, unit);
  pop();
}

function createClickArea(x, y, w, h, position) {
  let xFix = mouseX - centerX;
  let yFix = mouseY - centerY;
  if (
    xFix >= x - w / 2 &&
    xFix <= x + w / 2 &&
    yFix >= y - h / 2 &&
    yFix <= y + h / 2 &&
    mouseIsPressed == true
  ) {
    //red if user clicks

    console.log("mega kill!!!");
    unitClick(position);
  }
}

//doesnt create new
function unitClick(position) {
  //make the units place empty (todo - only few seconds then add a random new unit)
  if (units[position].lives > 0) {
    //reduce lives by one each click
    units[position].lives -= 1;
    console.log(units[position].lives);
  } else {
    units[position] = { color: [0, 0, 0, 0], lives: "god", lifetime: 100 };
  }
}

function drawHand() {
  push();
  fill(255);
  noCursor();
  if (mouseIsPressed) {
    fill(255, 0, 0);
  }
  ellipse(mouseX, mouseY, width / 17);
  pop();
}

function drawTestRectangle(x, y, w, h, unit) {
  fill(unit.color);
  rect(x, y, w, h);
}

function timerCount() {
  fill(220,100,220);
  textSize(30);
  text("TIMER − " + Math.floor(timer) + "s", 500, 30 / 1.06);
}
