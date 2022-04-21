import * as THREE from "three";

import InputManger from "./InputManager";

class GameEngine {
  constructor() {
    this.scene = new THREE.Scene();
    this.keys = new InputManger(true);
    this.camera = this.getCamera();

    this.renderer = this.getRenderer();

    let lastT = 0;
    const raf = (t) => {
      document.body.requestPointerLock();

      requestAnimationFrame(raf);
      this.update((t - lastT) / 100);
      lastT = t;
      this.renderer.render(this.scene, this.camera);
    };
    raf();

    this.init();
  }

  getCamera() {
    const camera = new THREE.PerspectiveCamera(
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
      const { camera } = this;
      camera.rotation.y -= movementX / 200;
      camera.rotation.x -= movementY / 200;
    });
  }

  getRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
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

  update(delta) {}
}

export default GameEngine;
