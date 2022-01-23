function drawGrid(canvas, ctx, cubePx, color, lineWidth) {
  for(let i = cubePx + 0.5 ; i < canvas.width; i += cubePx){
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
  }
  for(let j = cubePx + 0.5 ; j < canvas.height; j += cubePx){
    ctx.moveTo(0, j);
    ctx.lineTo(canvas.width, j);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  ctx.beginPath();
}

export {
  drawGrid
};
