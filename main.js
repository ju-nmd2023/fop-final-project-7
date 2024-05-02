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
      createClickArea(x, y, w, h);
      push();
      translate(width / 4, height / 4);
      drawTestRectangle(x, y, w, h);
      pop();
      console.log(width);
    }
  }
}

// function buttonCoordinates(){

// }

function createClickArea(x, y, w, h) {
  //green default
  fill(0, 255, 0);
  if (
    mouseX >= x - w / 2 &&
    mouseX <= x + w / 2 &&
    mouseY >= y - h / 2 &&
    mouseY <= y + h / 2 &&
    mouseIsPressed == true
  ) {
    //red if user clicks
    fill(255, 0, 0);
  }
}

function drawTestRectangle(x, y, w, h) {
  rect(x, y, w, h);
}
