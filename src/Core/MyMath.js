class MyMath {
  // pas bon corrigé
  static lerp(coef, a, b) {
    return a * (1 - coef) + b * coef;
  }

  static clamp(value, min, max) {

    const cantGoAboveMax = Math.min(value, max)
    const cantGoUnderMinAndMax = Math.max(cantGoAboveMax, min)

    return cantGoUnderMinAndMax
  }
}

export default MyMath;
