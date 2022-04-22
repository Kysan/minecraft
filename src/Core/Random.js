import MyMath from "./MyMath";

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
      // this.data.set(id, .noise())
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

export default Random;
