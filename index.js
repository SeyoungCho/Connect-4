"use strict";
document.addEventListener('DOMContentLoaded', ()=>{
  //colors
  const COLOR_BACKGROUND = "mintcream";
  const COLOR_FRAME = "dodgerblue";
  const COLOR_FRAME_BT = "royalblue";
  const COLOR_COMP = "red";
  const COLOR_COMP_DRK = "darkred";
  const COLOR_PLAYER = "yellow";
  const COLOR_PLAYER_DRK = "olive";
  //game parameters
  const GRID_COLS = 7;
  const GRID_ROWS = 6;
  const GRID_CIRCLE = 0.7;  //circle size as a fraction of cell size
  const MARGIN = 0.02; //margin as a fraction of the shortest screen dimenstion

  //classes
  class Cell{
    constructor(left, top, width, height, row, col){
      this.bot = top + height;
      this.left = left;
      this.right = left + width;
      this.top = top;
      this.width = width;
      this.height = height;
      this.row = row;
      this.col = col;
      this.cx = left + width / 2;
      this.cy = top + height / 2;
      this.r = width * GRID_CIRCLE / 2;
      this.owner = null;
    }

    //draw the circle or hole
    draw(/** @type {CanvasRenderingContext2D} */ ctx){
      //owner color
      let color = this.owner === null ? COLOR_BACKGROUND : this.owner ? COLOR_PLAYER : COLOR_COMP;
      //draw the circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2)
      ctx.fill();
    }
  }
  
  //game variables
  let grid = [];
  
  //set up the canvas and context
  const canv = document.createElement("canvas");
  document.body.appendChild(canv);
  const ctx = canv.getContext("2d");

  const createGrid = ()=>{
    grid = [];

    //set up cell size and margins
    let cell, marginX, marginY;

    //portrait
    if((width - margin * 2) * GRID_ROWS / GRID_COLS < height - margin * 2){
      cell = (width - margin * 2) / GRID_COLS;
      marginX = margin;
      marginY = (height - cell * GRID_ROWS) / 2;
    }
    //landscape
    else{
      cell = (height - margin * 2) / GRID_ROWS;
      marginX = (width - cell * GRID_COLS) / 2;
      marginY = margin;
    }

    //populate the grid
    for(let i = 0; i < GRID_ROWS; i++){
      grid[i] = [];
      for(let j = 0; j<GRID_COLS; j++){
        let left = marginX + j * cell;
        let top = marginY + i * cell;
        grid[i][j] = new Cell(left, top, cell, cell, i, j);
      }
    }
  }
  const newGame = ()=>{
    createGrid();
  }
  
  //dimensions 
  let height, width, margin;
  const setDimensions = ()=>{
    height = window.innerHeight;
    width = window.innerWidth;

    canv.height = height;
    canv.width = width;

    margin = MARGIN * Math.min(height, width);
    newGame();
  }
  setDimensions();
  
  window.addEventListener("resize", setDimensions);


  //event listener

  //game loop
  let timeDelta, timeLast;
  const drawBackground = ()=>{
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, width, height);
  }

  const drawGrid = ()=>{
    //frame and butt
    let cell = grid[0][0];
    let fh = cell.height * GRID_ROWS;
    let fw = cell.width * GRID_COLS;
    ctx.fillStyle = COLOR_FRAME;
    ctx.fillRect(cell.left, cell.top, fw, fh);
  }
  const loop = (timeNow)=>{
    //initialize timeLast
    if(!timeLast){
      timeLast = timeNow;
    }

    //calculate the time difference
    timeDelta = (timeNow - timeLast) / 1000;
    timeLast = timeNow;

    //update

    //draw
    drawBackground();
    drawGrid();
    //call the next frame
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

})