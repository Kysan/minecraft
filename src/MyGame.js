import Block, { blockInstancer } from "./Entity/Block";
import GameEngine from "./Core/GameEngine";
import { Vector3 } from "three";
import { Mesh } from "three";
import { PlaneGeometry } from "three";
import { MeshBasicMaterial } from "three";
import { PointLight } from "three";
import { MeshStandardMaterial } from "three";
import { MeshToonMaterial } from "three";
import { MeshPhongMaterial } from "three";
import { AmbientLight } from "three";
import { PointLightHelper } from "three";
import SkyBox from "./Entity/SkyBox";
import Random from "./Core/Random";
import { InstancedMesh } from "three";
import { BoxGeometry } from "three";
import TxLoader from "./Core/TxLoader";
import { Object3D } from "three";
import { Vector4 } from "three";
import { Matrix4 } from "three";
import { DynamicDrawUsage } from "three";

const CHUNK_SIZE = 20;

class MyGame extends GameEngine {
  init() {
    this.skybox = new SkyBox(0, 0, 0);
    this.scene.add(this.skybox);
    this.scene.add(blockInstancer);

    let block = new Block(18, 0, 0);
    // block.remove()
    let z = 0;
    // let del = true;
    

    setInterval(()=>{
      let b = new Block(18, 0, z);
      console.log("new block")
      z++;
    }, 2000)
    // this.chunks = new Map();

    // block au spawn
    this.camera.position.set(18, 15, 23);
    // this.scene.add(new Block(18, 15, 23));

    // const block = new Block(10, 10, 10);
    



    // this.loadChunk(0, 0);
    // setInterval(() => this.handleChunks(), 500);
  }

  /**
   * génére les blocks d'un nouveau chunk (ne les ajoutes pas à la scene)
   * @param {number} chunkX
   * @param {number} chunkZ
   * @returns
   */
  generateChunk(chunkX, chunkZ) {
    chunkX *= CHUNK_SIZE;
    chunkZ *= CHUNK_SIZE;

    const blocks = [];

    for (let x = 0; x < CHUNK_SIZE; ++x) {
      for (let z = 0; z < CHUNK_SIZE; ++z) {
        const localX = chunkX + x;
        const localZ = chunkZ + z;

        const randY = Math.floor(this.rng.noise2D(localX / 5, localZ / 5) * 2);

        const b = new Block(localX, randY, localZ, "dirt");

        blocks.push(b);
      }
    }

    return blocks;
  }

  /**
   * décharge le chunk aux coordonnées données
   * @param {number} x
   * @param {number} z
   */
  unloadChunk(x, z) {
    const blocks = this.chunks.get(`${x}.${z}`);

    if (blocks) {
      blocks.forEach((block) => this.scene.remove(block));
    }
  }

  /**
   * charge le chunk aux coordonnées données
   * @param {number} x
   * @param {number} z
   */
  loadChunk(x, z) {
    let blocks = this.chunks.get(`${x}.${z}`);
    if (!blocks) {
      blocks = this.generateChunk(x, z);
      this.chunks.set(`${x}.${z}`, blocks);
      blocks.forEach((block) => {
        this.scene.add(block);
      });
    }
  }

  handleChunks() {
    const { camera: cam } = this;
    const chunkX = Math.floor(cam.position.x / CHUNK_SIZE);
    const chunkZ = Math.floor(cam.position.z / CHUNK_SIZE);

    // quand on tombe sur un nouveau chunk
    if (!this.chunks.has(`${chunkX}.${chunkZ}`)) {
      this.loadChunk(chunkX, chunkZ);
      /*
      // on calcul le position des 9(8) chunks qui sont autours
      const chunksToLoad = [];
      for (let x = -1; x <= 1; ++x) {
        for (let z = -1; z <= 1; ++z) {
          chunksToLoad.push(`${chunkX + x}.${chunkZ + z}`);
        }
      }

      // on décharge ceux qui ne sont pas dans les 9 autours
      Array.from(this.chunks.keys()).forEach((chunk) => {
        if (!chunksToLoad.includes(chunk)) {
          const [x, z] = chunk.split(".");
          console.warn("should unload ", x, z);
          this.unloadChunk(x, z);
        }
      });

      // et on charge ceux qui sont à charger
      chunksToLoad.forEach((chunk) => {
        const [x, z] = chunk.split(".");
        this.loadChunk(x, z);
      });
      */
    }
  }

  /**
   * est appelé à chaque frame
   * @param {number} delta temps depuis la dernière update
   */
  update(delta) {
    const { keys, camera: cam } = this;

    const dir = new Vector3();
    cam.getWorldDirection(dir);

    // document.getElementById("info").innerText = `
    // x: ${Math.round(cam.position.x, 3)}
    // y: ${Math.round(cam.position.y, 3)}
    // z: ${Math.round(cam.position.z, 3)}`;

    if (keys.isDown("z")) {
      cam.position.x += dir.x * delta * 1.5;
      cam.position.y += dir.y * delta * 1.5;
      cam.position.z += dir.z * delta * 1.5;
    }

    if (keys.isDown("s")) {
      dir.negate();
      cam.position.x += dir.x * delta;
      cam.position.y += dir.y * delta;
      cam.position.z += dir.z * delta;
    }

    if (keys.isDown("d")) {
      
      const angle = Math.atan2(dir.z, dir.x);
      dir.x = Math.cos(angle+Math.PI/2);
      dir.z = Math.sin(angle+Math.PI/2);

      cam.position.x += dir.x * delta;
      cam.position.y += dir.y * delta;
      cam.position.z += dir.z * delta;
    }

    if (keys.isDown("q")) {

      const angle = Math.atan2(dir.z, dir.x);
      dir.x = Math.cos(angle-Math.PI/2);
      dir.z = Math.sin(angle-Math.PI/2);

      cam.position.x += dir.x * delta;
      cam.position.y += dir.y * delta;
      cam.position.z += dir.z * delta;
    }


    if(keys.isDown("Shift")) {
      cam.position.y += delta
    }



    if(keys.isDown("Control")) {
      cam.position.y -= delta;
    }
    if (keys.isDown("f")) {
      // this.rng = new Random()
      // TODO: regenerer tout les chunks
    }
  }
}

export default MyGame;
