let gamestate = "start";

function setup() {
  rectMode(CENTER);
  ellipseMode(CENTER);
  noStroke();
}
function draw() {
  background(143, 170, 244);
  switch (gamestate) {
    case "start":
      translate(width / 4, height / 4);
      if (createClickArea(width / 4, height / 4, 200, 75)) {
        gamestate = "game";
      }
      break;
    case "game":
      push();
      translate(width / 4, height / 4);
      drawHitBoxes();
      pop();
      drawHand();
      break;
  }
}

// function buttonCoordinates(){

// }

function drawHand() {
  fill(255);
  noCursor();
  ellipse(mouseX, mouseY, width / 17);
  if (mouseIsPressed) {
    fill(255, 0, 0);
    ellipse(mouseX, mouseY, width / 17, width / 34);
  }
}

//progress notes

//make the coordinates into classes
//more than having 16 boxes

//hostile boxes
// power ups
// more code complexity
// stronger enemy click multiple times
//animate popup, add time window to click
//boss mode
//graphics last, use images
//might remove excessive comments

function drawHitBoxes() {
  const w = width / 12;
  const h = width / 8;
  for (let i = 0; i < 3; i++) {
    const y = 0 + (h + 25) * i;
    for (let i = 0; i < 5; i++) {
      const x = 0 + (w + 25) * i;
      createClickArea(x, y, w, h);
    }
  }
}

function createClickArea(x, y, w, h) {
  //green default
  fill(0, 255, 0);
  let xFix = mouseX - width / 4;
  let yFix = mouseY - height / 4;
  if (
    xFix >= x - w / 2 &&
    xFix <= x + w / 2 &&
    yFix >= y - h / 2 &&
    yFix <= y + h / 2 &&
    mouseIsPressed == true
  ) {
    //red if user clicks

    console.log("mega kill!!!");
    fill(255, 0, 0);
    return true;
  }
  drawTestRectangle(x, y, w, h);
}

function drawTestRectangle(x, y, w, h) {
  rect(x, y, w, h);
}
