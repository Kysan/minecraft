import { BoxGeometry } from "three";
import { Mesh } from "three";
import MyTextures, { BlockType } from "../Core/MyTextureLoader";
import TxLoader from "../Core/MyTextureLoader";

class SkyBox extends Mesh {
  constructor(x, y, z) {
    const textures = MyTextures.get(BlockType.Sky) as any;
    super(new BoxGeometry(3000, 3000, 3000, 3000), textures);
    // this.position.set(x, y, z);
  }
}

export default SkyBox;
