export const keywords = [
  '#オプファーは二郎を奢れ',
  '#オプファーは歌志軒を奢れ'
];

/**
 * ## whether exist keyword in tweet.text
 * from tweet.text, find keyword
 * @param {string} text
 * @returns {boolean}
 */
export default function findKeyword (text: string) {
  for (const i in keywords) {
    if (text.indexOf(keywords[i]) > -1) {
      return true
    }
  }
  return false
}
