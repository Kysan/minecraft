class MyMath {
  // pas bon corrigé
  static lerp(coef, a, b) {
    return a * (1 - coef) + b * coef;
  }
}

export default MyMath;
