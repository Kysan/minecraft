import { InstancedMesh, Object3D, Vector3 } from "three";
import { Color } from "three";
import { DynamicDrawUsage } from "three";
import { Matrix4 } from "three";
import TxLoader, { BlockType } from "../Core/MyTextureLoader";
import Block from "./Block";

class Instancer extends InstancedMesh {
  private instances: Map<number, Block>;
  private outOfBoundMat: Matrix4;
  private textureType: BlockType;
  /**
   *
   * @param {BufferGeometry} geometry
   * @param {Material | Material[]} material nom de l'asset à charger sur le model
   */
  constructor(geometry, material, textureType: BlockType) {
    super(geometry, material, 10000 * 3);

    this.instances = new Map();
    this.outOfBoundMat = new Matrix4();
    this.outOfBoundMat.setPosition(new Vector3(-10000, -10000, -10000));
    this.instanceMatrix.setUsage(DynamicDrawUsage);
    this.textureType = textureType;
  }

  /**
   *
   * @returns {number} id unique servant à identifier une instance
   */
  getUniqueId() {
    for (let id = 0; id < this.count; ++id) {
      if (!this.instances.has(id)) {
        return id;
      }
    }
    throw Error("maximum instance count reach");
  }

  /**
   *
   * @param {Matrix4} mat
   * @returns {number} l'id de l'instance
   */
  createInstance(object: Block) {
    const id = this.getUniqueId();
    this.setMatrixAt(id, object.matrix);
    this.instances.set(id, object);
    return id;
  }

  getBlock(id: number) {
    return this.instances.get(id);
  }

  /**
   *
   * @param {number} id
   * @param {Matrix4} mat
   */
  updateInstance(id, mat) {
    super.setMatrixAt(id, mat);
  }

  /**
   * @param {number} id
   */
  removeInstance(id) {
    this.instances.delete(id);
    this.setMatrixAt(id, this.outOfBoundMat);
  }

  setColor(id, r, g, b) {
    this.setColorAt(id, new Color(r, g, b));
    this.instanceColor!.needsUpdate = true;
  }

  getTextureType() {
    return this.textureType;
  }
}

export default Instancer;
