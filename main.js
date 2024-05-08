let gamestate = "game";
//All squares on the field, in order.
let unitTypes = ["143, 170, 244", "0, 0, 255", "0, 255, 0", "255, 0, 0"];

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
      populateField();
      pop();
      drawHand();
      break;
  }
}

function populateField() {
  for (let i = 0; i < 15; i++) { //it is a for loop that runs 15 times, one is at 0.
    let rng = Math.random() * 10;
    switch (rng) {
      case 1:
        drawUnit(i, unitTypes[1]);
        break;
      case 2:
      case 3:
        drawUnit(i, unitTypes[2]);
        break;
      case 4:
      case 5:
        drawUnit(i, unitTypes[3]);
        break;
      default:
        drawUnit(i, unitTypes[0]);
        break;
    }

  }
}

function drawUnit(square, type) {
  drawHitBox(square, type);
}

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

function drawHitBox(square, type) {
  const w = width / 12;
  const h = width / 8;
  const row = square % 3;
  const col = Math.floor(square / 3);
  const x = (w + 25) * col;
  const y = (w + 50) * row;
createClickArea(x,y,w,h,type);
}

//create enemies at random, pop up once, dissappear forever replaced by new enemy.
function generateEnemyOrFriend() {
  //foes or enemies
  const foeWeak = {
    health: 1,
    foe: true,
    lifeTime: 25,
    timeChange: -4,
    points: 0,
  };
  const foeRich = {
    health: 1,
    foe: true,
    lifeTime: 10,
    timeChange: -4,
    points: 100,
  };
  const foeStrong = {
    health: 5,
    foe: true,
    lifeTime: 30,
    timeChange: -15,
    points: 0,
  };

  //Friends / mice bunnies etc
  const friendWeak = {
    health: 1,
    foe: true,
    lifeTime: 25,
    timeChange: -4,
    points: 0,
  };
  const friendRich = {
    health: 1,
    foe: true,
    lifeTime: 10,
    timeChange: -4,
    points: 100,
  };
  const friendStrong = {
    health: 5,
    foe: true,
    lifeTime: 30,
    timeChange: -15,
    points: 0,
  };
}

function createClickArea(x, y, w, h, type) {
  let hue = type;
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
    hue = [255, 0, 0];
    // return true;
  }
  drawTestRectangle(x, y, w, h, hue);
}

function drawTestRectangle(x, y, w, h, hue) {
  fill(hue);
  rect(x, y, w, h);
}