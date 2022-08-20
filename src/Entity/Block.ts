import { Object3D, Vector3 } from "three";
import { BlockType } from "../Core/MyTextureLoader";
import Instancer from "./Instancer";
import InstancerManager from "./InstancerManager";

class Block extends Object3D {
  private instancer: Instancer;
  private _id: number;

  constructor(textureType: BlockType, x: number, y: number, z: number) {
    super();

    this.instancer = InstancerManager.get(textureType);
    this._id = this.instancer.createInstance(this);

    this.position.set(x, y, z);
    this.syncWithBuffer();
  }

  syncWithBuffer() {
    this.updateMatrix();
    this.instancer.updateInstance(this._id, this.matrix);
    this.instancer.instanceMatrix.needsUpdate = true;
  }

  delete() {
    this.instancer.removeInstance(this._id);
    this.instancer.instanceMatrix.needsUpdate = true;
  }

  move(x, y, z) {
    x += this.position.x;
    y += this.position.y;
    z += this.position.z;

    this.position.set(x, y, z);
    this.syncWithBuffer();
  }
}

export default Block;
