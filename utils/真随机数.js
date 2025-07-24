function secureRandomInt(min, max) {
  const range = max - min + 1; // 创建一个足够大的随机数，以减少模偏差
  const randomValue = new Uint32Array(1);
  crypto.getRandomValues(randomValue);

  return min + (randomValue[0] % range);
}

console.log(secureRandomInt(1, 6)); // 模拟安全的骰子
console.log(secureRandomInt(1000, 9999)); // 生成一个安全的 4 位验证码
