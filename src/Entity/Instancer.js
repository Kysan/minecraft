import { BufferGeometry } from "three";
import { Vector3 } from "three";
import { DynamicDrawUsage } from "three";
import { Matrix4 } from "three";
import { InstancedMesh } from "three";
import TxLoader from "../Core/TxLoader";





class EntityInstancer extends InstancedMesh {

    /**
     * 
     * @param {BufferGeometry} geometry 
     * @param {Material | Material[]} material nom de l'asset à charger sur le model
     */
    constructor(geometry, material) {    
        super(geometry, material, 10000);
        this.instances = new Set();
        this.outOfBoundMat = new Matrix4();
        this.outOfBoundMat.setPosition(new Vector3(-10000, -10000, -10000));
        this.instanceMatrix.setUsage(DynamicDrawUsage)
    }

    /**
     * 
     * @returns {number} id unique servant à identifier une instance
     */
    getUniqueId() {
        for(let id = 0; id < this.count; ++id) {
            if(!this.instances.has(id)) {
                this.instances.add(id);
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
    createInstance(mat) {
        const id = this.getUniqueId()
        const mat_ = new Matrix4()
        this.setMatrixAt(id, mat_);
        this.instances.add(id);
        return id;
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

    /**
     * 
     * @param {number} id id de l'instance
     * @returns {Matrix4}
     */
    getInstance(id) {
        let mat = new Matrix4()
        this.getMatrixAt(id, mat);
        return mat;
    }

}



export default EntityInstancer