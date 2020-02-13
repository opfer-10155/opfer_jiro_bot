/**
 * 解決したツイート群と、未解決ツイート群を保存するクラス
 */
export default class Resolver<T> {
  unresolved: T[] = []
  resolved: T[] = []

  /**
   * ## resolver Tweet
   * tweetに渡したツイートに判定and返信する
   * @param {T} obj resolveするオブジェクト
   * @param {T => void} handler resolve関数
   * @return {void}
   */
  resolve = (handler: (_: T) => void) => {
    if (this.unresolved.length > 0) {
      const obj = this.unresolved[0]
      this.unresolved = this.unresolved.slice(1)
      handler(obj)
      this.addResolved(obj)
    }
  }

  addResolved = (obj: T) => {
    if (this.resolved.length >= 500) {
      this.resolved = this.resolved.slice(0, 1)
    }
    this.resolved.push(obj)
  }

  addUnresolved = (obj: T) => {
    this.unresolved.push(obj)
  }

  /**
   * ## whether the tweet was replied
   * find the id from the list of replied tweets
   * @param {number} id of the tweet
   * @returns {boolean}
   */
  isResolved = (obj: T, handler: (a: T, b: T) => boolean) => {
    if (this.resolved.length == 0) return false
    else {
      for(let i=0; i<this.resolved.length; i++) {
        if (handler(obj, this.resolved[i])) return true
      }
      return false
    }
  }

  /**
   * ## insert to replied
   * insert a value to the head of the list
   * @param {number} val tweet
   */
  // addResolved = (tweet: Twitter.ResponseData) => {
  //   if (resolver.replied.length >= 500) {
  //     resolver.replied.splice(0, 1)
  //   }
  //   resolver.replied.push(tweet.id)
  // }
}
