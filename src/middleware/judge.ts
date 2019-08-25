const max        = 125 // 確率の分母
const atari      = 26  // アタリの数字

/**
 * ## random Int
 * get random number in range from 0 <= x < max
 * @param {number} max
 * @returns {number}
 */
const randamInt = (max: number) => Math.floor(Math.random() * max);

export const judge = () => (atari === randamInt(max))
