import Twitter = require('twitter')
import client from './client'
import limitter, { TWEET } from './limitter'
import { judge } from './judge'
import Phrases from '../constants/phrase'
import handleError from './handleErrors'

const resolver = {
  unreplied: [],
  replied: [], // IDのみ格納

  /**
   * ## resolver Tweet
   * tweetに渡したツイートに判定and返信する
   * @param {Twitter.ResponseData} tweet resolveするtweet
   * @param {Client} client replyするクライアント
   * @param {Limitter} limitter API呼び出し回数を管理する
   * @return {Twitter.ResponseData} 入力で渡したtweet
   */
  resolveTweet: (tweet: Twitter.ResponseData) => {
    if (limitter.canTweet()) {
      if (judge()) {
        resolver.sendReply(Phrases.atari, tweet)
      }
      else {
        resolver.sendReply(Phrases.hazure_random(), tweet)
      }
    }
    else { resolver.unreplied.push(tweet) }
  },

  resolveUnrepliedTweets: () => {
    resolver.unreplied.forEach((tweet, index) => {
      resolver.resolveTweet(tweet)
      resolver.unreplied.splice(index, 1)
    })
  },

  sendReply: (message: string, tweet: Twitter.ResponseData) => {
    return client.reply(message, tweet)
      .then(() => {
        resolver.addResolved(tweet.id)
        limitter.countUp(TWEET)
        return tweet
      })
      .catch(handleError)
  },

  /**
   * ## whether the tweet was replied
   * find the id from the list of replied tweets
   * @param {number} id of the tweet
   * @returns {boolean}
   */
  isResolved: (id: number) => { return resolver.replied.indexOf(id) > -1 },

  /**
   * ## insert to replied
   * insert a value to the head of the list
   * @param {number} val tweet
   */
  addResolved: (tweet: Twitter.ResponseData) => {
    if (resolver.replied.length >= 500) {
      resolver.replied.splice(0, 1)
    }
    resolver.replied.push(tweet.id)
  }
}

export default resolver
