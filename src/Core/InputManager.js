class InputManger {
  constructor(log = false) {
    // * KEYBOARD
    this.keys = {};

    window.addEventListener("keydown", (e) => {
      // e.preventDefault();
      this.keys[e.key] = true;
      if (log) console.log("down", e.key);
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
      if (log) console.log("up", e.key);
    });

    document.addEventListener("visibilitychange", () => {
      console.log("focus change");
      this.keys = {};
    });
  }

  isDown(key) {
    return this.keys[key];
  }

  isUp(key) {
    return !this.keys[key];
  }

  onMouseMove(cb) {
    window.addEventListener("mousemove", cb);
  }
}

export default InputManger;
