import Twitter = require('twitter')

const post_tweet = 'statuses/update'
const get_timeline = 'statuses/home_timeline'
const search = 'search/tweets.json'

/**
 * ## Twitterクライアント
 * 各種動作をリクエストする
 */
const client = {
  twitter: new Twitter({
    consumer_key        : process.env.MY_CONSUMER_KEY,
    consumer_secret     : process.env.MY_CONSUMER_SECRET,
    access_token_key    : process.env.MY_ACCESS_TOKEN,
    access_token_secret : process.env.MY_ACCESS_TOKEN_SECRET
  }),

  /**
   * ## Automatic tweet
   * tweet automatically to check this app is running well
   * @param client instance
   */
  tweet: (status: string) => {
    return client.twitter.post(
      post_tweet,
      { status }
    )
  },

  /**
   * ## Send Reply
   * tweetに対してリプライを送る
   * @param message tweet text
   * @param tweet reply target
   * @returns {Promise<Twitter.ResponseData>}
   */
  reply: (message : string, tweet: any) => {
    const username = tweet.user.screen_name
    return client.twitter.post(post_tweet, {
      status: `@${username} ${message}`,
      in_reply_to_status_id: tweet.id_str,
      auto_populate_reply_metadata: true
    })
  },

  /**
   * ## Get TimeLine
   * clientのユーザーのタイムラインを受け取ってArray<Tweet>のPromiseを返す
   * @returns {Promise<Twitter.ResponseData[]>} Object is tweet object
   */
  getTL: (count?: number, since_id?: string) => {
    return client.twitter.get(get_timeline, {
      count,
      since_id
    })
  },

  /**
   * ## Standard Search
   *
   */
  search: (query: string, type?: 'mixed' | 'recent' | 'popular', since_id?: string) => {
    return client.twitter.get(search, {
      count : 100,
      q     : query,
      result_type: type,
      since_id
    })
  }
}

export default client
