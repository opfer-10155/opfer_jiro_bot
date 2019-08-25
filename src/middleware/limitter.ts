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
      }
      case GET_TL: {
        limitter.getTL_count = 0
      }
      case SEARCH: {
        limitter.search_count = 0
      }
      default: {
        throw new Error('Unexpected Input')
      }
    }
  },

  countUp: (type: T) => {
    switch (type) {
      case TWEET: {
        limitter.tweet_count++
      }
      case GET_TL: {
        limitter.getTL_count++
      }
      case SEARCH: {
        limitter.search_count++
      }
      default: {
        throw new Error('Unexpected Input')
      }
    }
  }
}

export default limitter
