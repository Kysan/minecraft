import Block from "./Entity/Block";
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

// v € [0; 1]
class MyMath {
  // pas bon corrigé
  static lerp(coef, a, b) {
    return a * (1 - coef) + b * coef;
  }
}

class Random {
  constructor() {
    // a modifier pour rajouter un syteme de seed
    // http://sdz.tdct.org/sdz/bruit-de-perlin.html
    this.data = new Map();
  }

  randForNoise(x, y) {
    const id = x + "." + y;
    if (!this.data.has(id)) {
      this.data.set(id, Math.random() * 4);
    }
    return this.data.get(id);
  }

  noise2D(x, y) {
    /**
     * on a une grille de carre
     * on met un point P à un endroit au hasard
     * ex: x=3.2 y=5.5
     *
     * maintenant on veut les 4 coins du carré qui l'entour
     * A --- B
     * | p   |
     * C --- D
     *
     * on a juste à viré les flotants pour le récupérer
     * A = 3.2 -> 3
     * C = 5.5 -> 5
     *
     *
     */
    let x1 = Math.floor(x);
    let x2 = x1 + 1;
    let y1 = Math.floor(y);
    let y2 = y1 + 1;

    let A = this.randForNoise(x1, y1);
    let B = this.randForNoise(x2, y1);
    let C = this.randForNoise(x1, y2);
    let D = this.randForNoise(x2, y2);

    // on interpole sur les x
    const qx = x - Math.floor(x);
    // 5.3 -> 0.3
    // 0.7 A et 0.3 B  (le plus proche à le plus grand impacte)

    const p1 = MyMath.lerp(qx, A, B);
    const p2 = MyMath.lerp(qx, C, D);

    // et maintenant sur les y
    const qy = y - Math.floor(y);
    // 5.4 -> bas(0.6) > haut(0.4)
    const final = MyMath.lerp(qy, p1, p2);

    return final;
  }
}

class MyGame extends GameEngine {
  init() {
    const { camera } = this;

    camera.position.y = 6;
    camera.position.z = 6;
    this.blocks = [];

    this.skybox = new SkyBox();
    this.skybox.position.set(0, 0, 0);
    this.scene.add(this.skybox);

    const light = new PointLight(0xffffff, 10, 100000);
    light.position.set(730, 980, 1288);

    this.scene.add(light);
    this.scene.add(new PointLightHelper(light, 1));

    this.camera.position.set(18, 15, 23);
    this.scene.add(new Block(18, 15, 23, 0xff00ff));
    this.generateBlocks();
  }

  async addPlane() {
    this.plane = new Mesh(
      new PlaneGeometry(400, 400, 20, 20),
      new MeshStandardMaterial({ color: 0xaaaaaa })
    );

    const centerX = 0;
    const centerY = 0;

    const rng = new Random();

    const vertices = this.plane.geometry.getAttribute("position");

    for (let i = 0; i < vertices.count; ++i) {
      const x = vertices.getX(i);
      const y = vertices.getY(i);
      const z = vertices.getZ(i);

      const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      // vertices.setXYZ(i, x, 0, z);
      vertices.setX(i, x);
      vertices.setY(i, y);
      vertices.setZ(i, rng.noise2D(x, y));
    }

    this.plane.rotation.x -= Math.PI / 2;
    this.plane.position.set(0, 0, 0);
    this.scene.add(this.plane);
  }

  async generateBlocks() {
    for (let block of this.blocks) {
      this.scene.remove(block);
    }
    this.blocks = [];

    const chunckSize = 10;
    const rng = new Random();
    for (let x = 0; x < chunckSize; ++x) {
      for (let z = 0; z < chunckSize; ++z) {
        // await new Promise((r) => setTimeout(r, 20));
        const v = Math.floor(rng.noise2D(x, z));
        const color = 0x00ff00; //Math.floor(Math.random() * 0xffffff);

        const b = new Block(x, v, z, color);
        this.blocks.push(b);
        this.scene.add(b);
      }
    }
  }

  update(delta) {
    const { keys, camera } = this;

    const dir = new Vector3();
    camera.getWorldDirection(dir);

    document.getElementById("info").innerText = `
    x: ${Math.round(camera.position.x, 3)}
    y: ${Math.round(camera.position.y, 3)}
    z: ${Math.round(camera.position.z, 3)}`;

    if (keys.isDown("z")) {
      camera.position.x += dir.x * delta * 10;
      camera.position.y += dir.y * delta * 10;
      camera.position.z += dir.z * delta * 10;
    }

    if (keys.isDown("s")) {
      dir.negate();
      camera.position.x += dir.x * delta;
      camera.position.y += dir.y * delta;
      camera.position.z += dir.z * delta;
    }

    if (keys.isDown("d")) {
      dir.cross(camera.up);
      camera.position.x += dir.x * delta;
      camera.position.y += dir.y * delta;
      camera.position.z += dir.z * delta;
    }

    if (keys.isDown("q")) {
      dir.cross(camera.up);
      dir.negate();
      camera.position.x += dir.x * delta;
      camera.position.y += dir.y * delta;
      camera.position.z += dir.z * delta;
    }

    if (keys.isDown("f")) {
      // if (this.blocks != []) {
      //   this.generateBlocks();
      // }
    }
  }
}

export default MyGame;
