import { PerspectiveCamera } from "three";
import { WebGLRenderer } from "three";
import { Scene } from "three";
import InstancerManager, { Instancers } from "../Entity/InstancerManager";

import InputManger from "./InputManager";
import MyMath from "./MyMath";
import Random from "./Random";

class GameEngine {
  constructor() {
    this.scene = new Scene();
    this.keys = new InputManger(true);
    this.camera = this.getCamera();
    this.rng = new Random();
    this.renderer = this.getRenderer();
    InstancerManager.linkToScene(this.scene)
    this.init();

    let lastT = 0;
    const raf = (t) => {
      document.body.requestPointerLock();

      requestAnimationFrame(raf);
      this.update((t - lastT) / 100);
      lastT = t;
      this.renderer.render(this.scene, this.camera);
    };
    raf();
  }

  getCamera() {
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );

    this.setUpCameraHandlers(camera);
    return camera;
  }

  setUpCameraHandlers(camera) {
    camera.rotation.order = "YXZ";
    window.addEventListener("mousemove", ({ x, y, movementX, movementY }) => {
      const sensitivity = 1 / 200
      const { camera } = this;

      const rotY = camera.rotation.y - movementX * sensitivity;

      const rotX = camera.rotation.x - movementY * sensitivity
      camera.rotation.y = rotY;
      camera.rotation.x = MyMath.clamp(rotX, -Math.PI / 2, Math.PI / 2);
    });
  }

  getRenderer() {
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return renderer;
  }

  init() {
    console.log("init");
  }

  update(delta) { }
}

export default GameEngine;
