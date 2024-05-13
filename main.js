let gameState = "start";
let centerX = 0;
let centerY = 0;
let units = [];
const unitCount = 15;
let timer = 10;
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

function draw() {
  //background(143, 170, 244);
  background(143, 170, 244);

  switch (gameState) {
    case "start":
      drawTestRectangle(width / 2, height / 2, 200, 75, [160, 255, 190]);
      if (createClickArea(200, 200, 200, 75, 1)) {
        gameState = "game";
      }
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
        gameState = "gameOver";
      }
      break;

    case "gameOver":
      drawTestRectangle(width / 2, height / 2, 200, 75, [160, 255, 190]);
      //reset values

      if (createClickArea(200, 200, 200, 75, 1)) {
        timer = 10;
        points = 0;
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
    if (gameState === "game") {
      console.log("mega kill!!!");
      unitClick(position);
    } else {
      return true;
    }
  }
}

// this solution works with startscreen button, but not in game,
// they are intertwined

// function createClickArea(x, y, w, h, position) {
//   // Check if mouse is pressed within the button area
//   if (
//     mouseX >= width / 2 - 100 &&
//     mouseX <= width / 2 + 100 &&
//     mouseY >= height / 2 - 37.5 &&
//     mouseY <= height / 2 + 37.5 &&
//     mouseIsPressed
//   ) {
//     // If on start screen, change game state
//     if (gameState === "start") {
//       console.log("Start button clicked");
//       return true;
//     }
//   }
// }

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
  ellipse(mouseX, mouseY, width / 17);
  pop();
}

function drawTestRectangle(x, y, w, h, color) {
  fill(color);
  rect(x, y, w, h);
}

function timerCount() {
  fill(220, 100, 220);
  textSize(30);
  text("TIMER − " + Math.floor(timer) + "s", 500, 200);
}
function pointsCount() {
  fill(220, 100, 220);
  textSize(30);
  text("Points − " + points, 200, 30 / 1.06);
}
