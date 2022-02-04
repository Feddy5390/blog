export default class Loader {
  loadJson(dir) {
    return fetch(dir).then(r => r.json());
  }

  loadImage(dir) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.src = dir;
    })
  }

  // tiles cache
  async createTilesBuffer() {
    let tilesBuffer = new Map();

    for (let index in this.tilesetJsonParse) {
      const tileObj = this.tilesetJsonParse[index];
      const tmpImg = await this.loadImage(tileObj.imageDir);

      for (let tileName in tileObj.tiles) {
        const bufferCanvas = document.createElement('canvas');
        const bufferCtx = bufferCanvas.getContext('2d');
        const tile = tileObj.tiles[tileName];

        bufferCanvas.width = tile.size[0] * this.cube.px;
        bufferCanvas.height = tile.size[1] * this.cube.px;

        if (
          tile.attribute !== null
          && tile.attribute.indexOf('mirror') != '-1'
        ) {
          bufferCtx.scale(-1, 1);
          bufferCtx.translate((bufferCanvas.width * -1), 0);
          tileName = tileName + '-mirror';
        }

        bufferCtx.imageSmoothingEnabled = false;
        bufferCtx.drawImage(
          tmpImg,
          tile.position[2], tile.position[3], tile.position[0], tile.position[1],
          0, 0, bufferCanvas.width, bufferCanvas.height
        );

        tilesBuffer.set(tileName, bufferCanvas);
      }
    }

    return tilesBuffer;
  }

  // level cache(background only)
  createLevelBuffer() {
    const levelCanvas = document.createElement('canvas');
    const levelCtx = levelCanvas.getContext('2d');
    levelCanvas.width = this.levelJsonParse.size[0] * this.cube.px;
    levelCanvas.height = this.levelJsonParse.size[1] * this.cube.px;

    for (let tileName in this.levelJsonParse.map) {
      if(this.tilesetSetting[tileName].attribute.indexOf('background') != '-1') {
        const tilesBuffer = this.tilesBuffer.get(tileName);
        const levelMapArr = this.levelJsonParse.map[tileName];

        levelMapArr.forEach((item) => {
          const bufferCanvas = document.createElement('canvas');
          const bufferCtx = bufferCanvas.getContext('2d');
          bufferCanvas.width = item[2] * tilesBuffer.width;
          bufferCanvas.height = item[3] * tilesBuffer.height;

          let pattern = bufferCtx.createPattern(tilesBuffer, 'repeat');
          bufferCtx.rect(0, 0, bufferCanvas.width, bufferCanvas.height);
          bufferCtx.fillStyle = pattern;
          bufferCtx.fill();

          levelCtx.drawImage(
            bufferCanvas,
            0, 0, bufferCanvas.width, bufferCanvas.height,
            item[0] * this.cube.px, item[1] * this.cube.px, bufferCanvas.width, bufferCanvas.height
          );
        });
      }
    }
    return levelCanvas;
  }

  async loading(cube, tilesetJson, levelJson) {
    this.cube = cube;

    this.tilesetJsonParse = await this.loadJson(tilesetJson);
    this.levelJsonParse = await this.loadJson(levelJson);

    this.tilesetSetting = {};
    this.tilesetJsonParse.forEach((tileObj) => {
      for (let tileName in tileObj.tiles) {
        this.tilesetSetting[tileName] = tileObj.tiles[tileName];
      }
    });

    // create buffer
    this.tilesBuffer = await this.createTilesBuffer();
    this.levelBuffer = this.createLevelBuffer();
  }
}
