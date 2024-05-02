function setup() {
  rectMode(CENTER);
}
function draw() {
  for (let i = 0; i < 3; i++) {
    const x = width / 2 - (width / 5) * i;
    const y = height / 2;
    const w = width / 5;
    const h = width / 10;
    createClickArea(x, y, w, h);
    console.log(width);
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
  rect(x, y, w, h);
}
