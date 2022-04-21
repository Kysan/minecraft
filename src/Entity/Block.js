import { Mesh } from "three";
import { BoxGeometry } from "three";
import TxLoader from "../Core/TxLoader";

class Block extends Mesh {
  /**
   * block de base du jeu
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {ColorRepresentation} color
   */
  constructor(x, y, z, color) {
    const textures = TxLoader._textures_.dirt;
    super(new BoxGeometry(1, 1, 1), textures);
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }
}

export default Block;
