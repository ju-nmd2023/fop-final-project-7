let gameState = "game";
let centerX = 0;
let centerY = 0;

let unitTypes = [
  [255, 0, 0],
  [255, 255, 0],
  [255, 0, 255],
];
// let units = [];
let units = [
  unitTypes[0],
  unitTypes[1],
  unitTypes[2],
  unitTypes[1],
  unitTypes[1],
  unitTypes[2],
  unitTypes[0],
  unitTypes[1],
  unitTypes[2],
  unitTypes[0],
  unitTypes[1],
  unitTypes[2],
  unitTypes[2],
  unitTypes[1],
  unitTypes[2],
  unitTypes[0],
  unitTypes[1],
];

function setup() {
  rectMode(CENTER);
  ellipseMode(CENTER);
}

function draw() {
  background(143, 170, 244);

  switch (gameState) {
    case "start":
      if (createClickArea(width / 2, height / 2, 200, 75, 255)) {
        gameState = "game";
      }
      break;
    case "game":
      //necessary to center and calibrate click
      centerX = (5 * (width / 12) + 25 * 3) / 2;
      centerY = (5 * (width / 8) + 50 * 2) / 2;
      drawPlayingField();
      break;
  }
  drawHand();
}

function drawPlayingField() {
  for (let i = 0; i < 15; i++) { // it is a for loop that runs 15 times, 0 counts as one time.
    drawHitBox(i, units[i]);
  }
}

function drawHitBox(position, unit) {
  const w = width / 12;
  const h = width / 8;
  const row = position % 3;
  const col = Math.floor(position / 3);
  const x = (w + 25) * col;
  const y = (w + 50) * row;
  createClickArea(x, y, w, h, unit, position);
}

function createClickArea(x, y, w, h, unit, position) {
  let hue = unit;

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
    hue = [255];
    unitClick(unit, position);
  }
  push();
  translate(centerX, centerY);
  drawTestRectangle(x, y, w, h, hue);
  pop();
}

function unitClick(unit, position) {
  units[position] = "";
}

function drawHand() {
  fill(255);
  noCursor();
  if (mouseIsPressed) {
    fill(255, 0, 0);
  }
  ellipse(mouseX, mouseY, width / 17);
}

function drawTestRectangle(x, y, w, h, hue) {
  fill(hue);
  rect(x, y, w, h);
}
