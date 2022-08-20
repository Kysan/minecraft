import GameEngine from "./Core/GameEngine";
import SkyBox from "./Entity/SkyBox";

import InputManger from "./Core/InputManager";
import Block from "./Entity/Block";
import {
  AmbientLight,
  Camera,
  DirectionalLight,
  Raycaster,
  Vector3,
} from "three";
import { BlockType } from "./Core/MyTextureLoader";
import InstancerManager from "./Entity/InstancerManager";

const CHUNK_SIZE = 20;
const MAP_SIZE = 20;

class MyGame extends GameEngine {
  private raycaster: Raycaster;
  init() {
    this.scene.add(new SkyBox(0, 0, 0) as any);

    const ambientLight = new AmbientLight(0x606060);
    this.scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff);
    directionalLight.position.set(1, 0.75, 0.5).normalize();
    this.scene.add(directionalLight);
    this.camera.position.set(0, 7, 13);

    const blocks: Block[] = [];

    // * on ajoute des blocs
    for (let x = 0; x < MAP_SIZE; ++x) {
      for (let z = 0; z < MAP_SIZE; ++z) {
        const randY = Math.floor(this.rng.noise2D(x, z, 4, 0.1));
        const block = new Block(BlockType.DirtWithGrass, x, randY, z);
        for (let y = randY; y >= 0; --y) {
          blocks.push(new Block(BlockType.ClassicDirt, x, y, z));
        }
        blocks.push(block);
      }
    }

    // setInterval(() => {
    //   blocks.forEach((block) => {
    //     // block.rotateX(Math.PI / 100);
    //     block.move(0, 0, 0);
    //   });
    // }, 100);
  }

  /**
   * est appelé à chaque frame
   * @param {number} delta temps depuis la dernière update
   */
  update(delta) {
    const { keys, camera: cam } = this;
    this.handleInputs(keys, delta);
    (document as any).getElementById("info").innerText = `
    x: ${Math.round(cam.position.x)}
    y: ${Math.round(cam.position.y)}
    z: ${Math.round(cam.position.z)}`;
  }

  handleInputs(keys: InputManger, delta: number) {
    const { camera: cam } = this;
    const camDir = new Vector3();
    cam.getWorldDirection(camDir);
    camDir.normalize();

    if (keys.isDown("z")) {
      cam.position.x += camDir.x * delta * 1.5;
      cam.position.y += camDir.y * delta * 1.5;
      cam.position.z += camDir.z * delta * 1.5;
    }

    if (keys.isDown("s")) {
      camDir.negate();
      cam.position.x += camDir.x * delta;
      cam.position.y += camDir.y * delta;
      cam.position.z += camDir.z * delta;
    }

    if (keys.isDown("d")) {
      const angle = Math.atan2(camDir.z, camDir.x);
      camDir.x = Math.cos(angle + Math.PI / 2);
      camDir.z = Math.sin(angle + Math.PI / 2);

      cam.position.x += camDir.x * delta;
      cam.position.y += camDir.y * delta;
      cam.position.z += camDir.z * delta;
    }

    if (keys.isDown("q")) {
      const angle = Math.atan2(camDir.z, camDir.x);
      camDir.x = Math.cos(angle - Math.PI / 2);
      camDir.z = Math.sin(angle - Math.PI / 2);

      cam.position.x += camDir.x * delta;
      cam.position.y += camDir.y * delta;
      cam.position.z += camDir.z * delta;
    }

    if (keys.isDown("Shift")) {
      cam.position.y += delta;
    }

    if (keys.isDown("Control")) {
      cam.position.y -= delta;
    }
    if (keys.isDown("f")) {
      // this.rng = new Random()
      // TODO: regenerer tout les chunks
    }

    this.handleCamToBlocIntersect(cam);
  }

  handleCamToBlocIntersect(cam: Camera) {
    const camDir = new Vector3();
    cam.getWorldDirection(camDir);
    camDir.normalize();

    this.raycaster = new Raycaster(this.camera.position, camDir);

    InstancerManager.forEach((instancer) => {
      const intersections = this.raycaster.intersectObject(instancer);
      if (intersections) {
        console.log({ intersections });
      }

      if (intersections.length > 0) {
        const blockId = intersections[0].instanceId;
        const block = instancer.getBlock(blockId!);
        this.onBlockIntersect(instancer.getTextureType(), block!);
      }
    });
  }

  onBlockIntersect(blockType: BlockType, block: Block) {
    if (blockType == BlockType.ClassicDirt) {
      block.delete();
    }
  }
}

export default MyGame;
