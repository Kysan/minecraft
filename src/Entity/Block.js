import { Mesh } from "three";
import { Matrix4 } from "three";
import { Quaternion } from "three";
import { Object3D } from "three";
import { DynamicDrawUsage } from "three";
import { Vector3 } from "three";
import { BoxGeometry } from "three";
import TxLoader from "../Core/TxLoader";
import EntityInstancer from "./Instancer";


const blockInstancer = new EntityInstancer(new BoxGeometry(1, 1, 1),TxLoader._textures_.dirt )

export {blockInstancer};
class Block extends Object3D {
  /**
   * block de base du jeu
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {ColorRepresentation} color
   */
  constructor(x, y, z) {
    this.mat = new Object3D()
    this.position.set(x, y, z)
    this.updateMatrix()
    this.id = blockInstancer.createInstance(this);
  }

  set pos ({x,y,z}) {
    console.log({x, y, z})
  }

  syncWithBuffer() { 
    this.mat.updateMatrix()
    blockInstancer.updateInstance(this.id, this.matrix);
    blockInstancer.instanceMatrix.needsUpdate = true
  }

  remove() {
    blockInstancer.removeInstance(this.id)
    blockInstancer.instanceMatrix.needsUpdate = true
  }

}

export default Block;
