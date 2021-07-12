
let gameOn = false;
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let gridState = createBlankState(50);
let gridSize = 50;
let frameSpeed = 1;
let error = 0;
gridState[26][24] = 1;
gridState[26][26] = 1;
gridState[26][25] = 1;

canvas.addEventListener("click", function(e){canvasClicked(e)});


//input is the size of the array
function createBlankState (size){
  let result = new Array(size).fill(0).map(() => new Array(size).fill(0));
  return result;
}

//returns the next frame
//should leave "state" unchanged
function generateNewState(state, boardSize){
  let result = createBlankState (boardSize);
  for (let i = 0; i < boardSize; i++){
    for (let j = 0; j < boardSize; j++){
      if (
        state[i][j] === 0 &&
        countNeighbors(state, boardSize, i, j) === 3
      ){
        result[i][j] = 1;
      }
      if (
        state[i][j] === 1 &&
        (countNeighbors(state, boardSize, i, j) === 3 ||
        countNeighbors(state, boardSize, i, j) === 2)
      ){
        result[i][j] = 1;
      }
      // adding the random errors
      if ( Math.random() < error ){
        result[i][j] = 1 - result[i][j];
      }

    }
  }
  return result;
}

function drawBoardFromState(state, boardSize){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < boardSize; i++){
    for (let j = 0; j < boardSize; j++){
      if (state[i][j] === 1){
        ctx.beginPath();
        ctx.fillRect((i-1)*800/boardSize, (j-1)*800/boardSize, 800/boardSize, 800/boardSize);
        ctx.closePath();
      }else{
        ctx.beginPath();
        ctx.strokeRect((i-1)*800/boardSize, (j-1)*800/boardSize, 800/boardSize, 800/boardSize);
        ctx.closePath();
      }
    }
  }
}

function draw() {
  drawBoardFromState(gridState, gridSize);
}

// input is a board state and size, followed by the indices of the cell to check
// boardState should be unaltered
function countNeighbors(boardState, boardSize, i, j){
  let counter = 0;
  if (i-1 >= 0 && j-1 >= 0){
    if (boardState[i-1][j-1]){
      counter ++;
    }
  }
  if (j-1 >= 0){
    if (boardState[i][j-1]){
      counter ++;
    }
  }
  if (i+1 < boardSize && j-1 >= 0){
    if (boardState[i+1][j-1]){
      counter ++
    }
  }
  if (i+1 < boardSize){
    if (boardState[i+1][j]){
      counter ++
    }
  }
  if (i+1 < boardSize && j+1 < boardSize){
    if (boardState[i+1][j+1]){
      counter ++
    }
  }
  if (j+1 < boardSize){
    if (boardState[i][j+1]){
      counter ++
    }
  }
  if (i-1 >= 0 && j+1 < boardSize){
    if (boardState[i-1][j+1]){
      counter ++
    }
  }
  if (i-1 >= 0){
    if (boardState[i-1][j]){
      counter ++
    }
  }
  return counter;
}

function startButtonHandler(){
  gameOn = !gameOn;
  gameLoop();
}

function resetButtonHandler(){
  gameOn = false;
  gridState = createBlankState(gridSize);
  requestAnimationFrame(draw);
}

function gameLoop(){
  if (gameOn === true){
    let newGridState = generateNewState(gridState, gridSize);
    gridState = newGridState;
    requestAnimationFrame(draw);
    setTimeout(function(){gameLoop()}, 1000*frameSpeed);
  }
}

function canvasClicked(e){

  let canvasLeft = canvas.offsetLeft + canvas.clientLeft;
  let canvasTop = canvas.offsetTop + canvas.clientTop;
  let x = e.pageX - canvasLeft;
  let y = e.pageY - canvasTop;
  let i = Math.floor((x)*gridSize/800)+1;
  let j = Math.floor((y)*gridSize/800)+1;
  if (!gameOn){
    if (gridState[i][j] === 0){
      gridState[i][j] = 1;

    }else if (gridState[i][j] === 1){
      gridState[i][j] = 0;
    }
  }
  requestAnimationFrame(draw)
}

function changeSize(){
  let newSize = prompt("What would you like the side length to be:", gridSize);
  if (newSize === null){return;}
  newSize = parseInt(newSize);
  gridState = createBlankState(newSize);
  gridSize = newSize;
  requestAnimationFrame(draw);
}

function changeSpeed(){
  let newSpeed = prompt("What would you like the frame speed to be (seconds per frame):", frameSpeed);
  if (newSpeed === null){return;}
  newSpeed = parseInt(newSpeed);
  frameSpeed = newSpeed;
}

function changeError(){
  let newError = prompt("What would you like probability of a random switch to be:", error);
  if (newError === null){return;}
  newError = parseInt(newError);
  error = newError;
}


requestAnimationFrame(draw);
