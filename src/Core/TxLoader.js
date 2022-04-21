import { MeshBasicMaterial } from "three";
import { Vector2 } from "three";
import { FrontSide } from "three";
import { DoubleSide } from "three";
import { BackSide } from "three";
import { Texture } from "three";
import { TextureLoader } from "three";

class _TxLoader extends TextureLoader {
  constructor() {
    super();
    this._textures_ = {
      dirtbackup: this.loadCube("textures/block/dirt", ".bmp", FrontSide),
      dirt: this.loadCube("textures/block/dirtv2", ".png", FrontSide),
      sky: this.loadCube("/textures/skybox/clouds1", ".bmp", BackSide),
    };
  }

  load(tx) {
    return this._textures_[tx];
  }

  /**
   *
   * @param {string} path chemin d'acces au fichier /Skybox/cloud1
   * @param {string} ext extension des fichiers '.bmp' '.png'
   * @returns {Texture}
   */
  loadCube(path, ext, side = FrontSide) {
    const textures = "north south up down west east".split(" ").map((dir) => {
      console.log(`${path}/${dir}${ext}`);
      const texture = super.load(`${path}/${dir}${ext}`);
      if (dir == "up") {
        texture.rotation += Math.PI / 2;
        texture.center = new Vector2(0.5, 0.5);
      }
      if (dir == "down") {
        texture.rotation += (3 * Math.PI) / 2;
        texture.center = new Vector2(0.5, 0.5);
      }

      const mesh = new MeshBasicMaterial({ map: texture, side });
      // mesh.side = BackSide;
      return mesh;
    });

    return textures;
  }
}

const TxLoader = new _TxLoader();

export default TxLoader;
