import { BoxGeometry, BufferGeometry, Scene } from "three";
import MyTextures, { BlockType } from "../Core/MyTextureLoader";
import Instancer from "./Instancer";

class InstancerManager {
  private scene: Scene;
  private instancersMeshs: Map<BlockType, Instancer>;
  constructor() {
    this.instancersMeshs = new Map();
  }

  get(textureName: BlockType) {
    let instancer = this.instancersMeshs.get(textureName);

    if (!instancer) {
      instancer = new Instancer(
        new BoxGeometry(1, 1, 1) as any,
        MyTextures.get(textureName),
        textureName
      );
      this.instancersMeshs.set(textureName, instancer);
      if (this.scene) {
        this.scene.add(instancer);
      }
    }

    return instancer;
  }

  linkToScene(scene: Scene) {
    this.scene = scene;

    this.instancersMeshs.forEach((instancer) => this.scene.add(instancer));
  }

  forEach(
    func: (
      value: Instancer,
      key: BlockType,
      map: Map<BlockType, Instancer>
    ) => void
  ) {
    this.instancersMeshs.forEach(func);
  }
}

export default new InstancerManager();
