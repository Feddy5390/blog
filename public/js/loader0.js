// import Function from "./function.js";

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
  createTilesBuffer() {
    let resource = new Map();
    return new Promise(async (resolve, reject) => {
      for(let category in this.tilesetJSON) {
        let tmpImg = await this.loadImage(this.tilesetJSON[category].dir);

        for (let item in this.tilesetJSON[category].info) {
          for (let i = 0; i < 2; i++) {
            let bufferCanvas = document.createElement('canvas');
            let bufferCtx = bufferCanvas.getContext('2d');
            let info = this.tilesetJSON[category].info[item];
            // name, width, height, pos_x, pos_y, gird
            bufferCanvas.width = info[4][0] * this.cube.px;
            bufferCanvas.height = info[4][1] * this.cube.px;
            if(i) {
              bufferCtx.scale(-1, 1);
              bufferCtx.translate(-bufferCanvas.width, 0);
              item = item + '-mirror';
            }

            bufferCtx.imageSmoothingEnabled = false;
            bufferCtx.drawImage(
              tmpImg,
              info[2], info[3], info[0], info[1],
              0, 0, bufferCanvas.width, bufferCanvas.height
            );

            resource.set(item, bufferCanvas);
          }
        }
      }
      resolve(resource);
    })
  }

  // level cache
  createLevelBuffer(resource) {
    let levelBuffer = new Map();
    for (let tileName in this.levelJSON.layers) {
      let tmpCanvas = document.createElement('canvas');
      let tmpCtx = tmpCanvas.getContext('2d');
      let levelCanvas = document.createElement('canvas');
      let levelCtx = levelCanvas.getContext('2d');

      // levelCanvas.width = this.cube.px * this.cube.x;
      // levelCanvas.height = this.cube.px * this.cube.y;

      this.levelJSON.layers[tileName].forEach(item => {
        let bufferCanvas = resource.get(tileName);

        tmpCanvas.width = bufferCanvas.width * item[2];
        tmpCanvas.height = bufferCanvas.height * item[3];

        levelCanvas.width = tmpCanvas.width;
        levelCanvas.height = tmpCanvas.height;

        let pattern = tmpCtx.createPattern(bufferCanvas, 'repeat');
        tmpCtx.rect(0, 0, tmpCanvas.width, tmpCanvas.height);
        tmpCtx.fillStyle = pattern;
        tmpCtx.fill();

        // levelCtx.drawImage(
        //   tmpCanvas,
        //   0, 0, tmpCanvas.width, tmpCanvas.height,
        //   this.cube.px * item[0], (this.cube.y * this.cube.px) - tmpCanvas.height - (this.cube.px * item[1]), tmpCanvas.width, tmpCanvas.height
        // );

        levelCtx.drawImage(
          tmpCanvas,
          0, 0, tmpCanvas.width, tmpCanvas.height,
          0, 0, tmpCanvas.width, tmpCanvas.height
        );
      });
      levelBuffer.set(tileName, levelCanvas);
    }
    return levelBuffer;
  }

  async loading(cube, tilesetJSON, levelJSON) {
    this.cube = cube;
    this.tilesetJSON = await this.loadJson(tilesetJSON);
    this.levelJSON = await this.loadJson(levelJSON);

    this.resource = await this.createTilesBuffer(tilesetJSON);
    this.levelBuffer = this.createLevelBuffer(this.resource);
  }
}
