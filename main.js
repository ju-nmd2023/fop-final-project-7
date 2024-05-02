function setup() {
  rectMode(CENTER);
}
function draw() {
  const w = width / 12;
  const h = width / 8;
  for (let i = 0; i < 3; i++) {
    const y = 0 + (h + 25) * i;
    for (let i = 0; i < 5; i++) {
      const x = 0 + (w + 25) * i;
      translate(width / 4, height / 4);
      createClickArea(x, y, w, h);
    }
  }
}

// function buttonCoordinates(){

// }

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
    fill(255, 0, 0);
    console.log("mega kill!!!");
  }
  drawTestRectangle(x, y, w, h);
}

function drawTestRectangle(x, y, w, h) {
  rect(x, y, w, h);
}
