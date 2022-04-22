import { BoxGeometry } from "three";
import { Mesh } from "three";
import TxLoader from "../Core/TxLoader";

class SkyBox extends Mesh {
  constructor(x, y, z) {
    const textures = TxLoader._textures_.sky;
    super(new BoxGeometry(3000, 3000, 3000, 3000), textures);
    this.position.set(x, y, z);
  }
}

export default SkyBox;
