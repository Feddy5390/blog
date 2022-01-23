export default class Render {
  constructor() {
    this.layers = [];
  }

  draw(ctx, img, sx, sy, sw, sh, x, y, width, height) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      img,
      sx, sy, sw, sh,
      x, y, width, height
    );
  }

  pushLayers(obj) {
    this.layers.push(obj);
  }

  drawLayers(ctx) {
    this.layers.forEach(layer => {
      ctx.drawImage(layer,
        0, 0, layer.width, layer.height,
        0, 0, layer.width, layer.height
      );
    });
  }

  drawText(ctx, text) {
    ctx.font = `${text.size} ${text.family}`;
    ctx.fillStyle = `${text.color}`;
    ctx.fillText(text.content, text.posX, text.posY);
  }
}
