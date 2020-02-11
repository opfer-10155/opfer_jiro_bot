type T = 'tweet' | 'getTL' | 'search'
export const TWEET = 'tweet'
export const GET_TL = 'getTL'
export const SEARCH = 'search'

/**
 * ## API Limitter
 * RESTAPI利用制限に引っかかるとエラーするのでその対策
 */
const limitter = {
  tweet_count:  0,
  getTL_count:  0,
  search_count: 0,

  limit_tweet_per_3h: 300,
  limit_get_timeline_per_15min: 15,
  limit_search_per_15min: 180,

  canTweet: () => { return limitter.tweet_count < limitter.limit_tweet_per_3h },
  canGetTL: () => { return limitter.getTL_count < limitter.limit_get_timeline_per_15min },
  canSearch: () => { return limitter.search_count < limitter.limit_search_per_15min },

  reset: (type: T) => {
    switch (type) {
      case TWEET: {
        limitter.tweet_count = 0
        break
      }
      case GET_TL: {
        limitter.getTL_count = 0
        break
      }
      case SEARCH: {
        limitter.search_count = 0
        break
      }
      default: {
        throw new Error(`Unexpected Input ${type}`)
      }
    }
  },

  countUp: (type: T) => {
    switch (type) {
      case TWEET: {
        limitter.tweet_count++
        break;
      }
      case GET_TL: {
        limitter.getTL_count++
        break;
      }
      case SEARCH: {
        limitter.search_count++
        break;
      }
      default: {
        throw new Error(`Unexpected Input ${type}`)
      }
    }
  }
}

export default limitter
