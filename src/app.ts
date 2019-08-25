import Twitter = require('twitter')
import handleError from './middleware/handleErrors'
import limitter, {TWEET, SEARCH} from './middleware/limitter'
import resolver from './middleware/tweetResolver'
import client from './middleware/client'
import Phrases from './constants/phrase'
import { keywords } from './constants/keywords'
import Timer, {
  toMS,
  AUTOMATIC_TWEET,
  SEARCH_REGULAR,
  RESET_GETTL_COUNT,
  RESET_TWEET_COUNT
} from './middleware/timer'

process.on('uncaughtException', (err: any) => {
  console.error(`Uncaught Expection ${err}`)
  handleError(err)
});

/**
 * ## Reset get_timeline_count every 15 minutes
 * Rest APIの利用制限に対応するため、15分ごとにTLをGETした回数のカウントをリセットする
 */
Timer.start(
  RESET_GETTL_COUNT,
  () => limitter.reset(SEARCH),
  toMS.minute(15)
)

/**
 * ## Reset get_timeline_count every 3 hours
 * 3時間ごとに自分がツイートした回数をリセットする
 */
Timer.start(
  RESET_TWEET_COUNT,
  () => limitter.reset(TWEET),
  toMS.hour(3)
)

/**
 * ## Run main process every 1 minute
 * 1分に1回TLの取得とリプライを行う。
 */
Timer.start(
  SEARCH_REGULAR,
  () => {
    resolver.resolveUnrepliedTweets()
    keywords.forEach((keyword) => {
      if (limitter.canSearch()) {
        limitter.countUp(SEARCH)
        client.search(keyword)
          .then(main)
          .catch(handleError)
      }
    })
  },
  toMS.sec(20)
)

/**
 * ## Automatic tweet every 12 hours
 * 12時間に1回自動ツイートする(生存確認)
 */
Timer.start(
  AUTOMATIC_TWEET,
  () => {
    if (limitter.canTweet()) {
      limitter.countUp(TWEET)
      client.tweet(Phrases.auto)
        .catch(handleError)
    }
  },
  toMS.hour(12)
)

function main (tweets: Twitter.ResponseData) {
  const t = tweets.statuses.filter((tweet) => !resolver.isResolved(tweet.id) && !tweet.retweeted)
  t.forEach((tweet) => {
    resolver.resolveTweet(tweet)
  })
}
