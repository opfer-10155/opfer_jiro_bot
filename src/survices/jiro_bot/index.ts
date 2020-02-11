import limitter, {TWEET, SEARCH} from '../../middleware/limitter'
import Timer, { toMS } from '../../middleware/timer'
import client from '../../middleware/client'
import Resolver from '../../middleware/resolver'
import Twitter = require('twitter')
import { judge } from './components/judge'
import { keywords } from './constants/keywords'
import Phrases from './constants/phrase'
import handleError from '../../middleware/handleErrors'
import logger from '../../middleware/logger'

const resolver = new Resolver<Twitter.ResponseData>()
const started_at = new Date()

/**
 * ## Run main process every 1 minute
 * 1分に1回TLの取得とリプライを行う。
 */
const search_query = "#オプファーは二郎を奢れ"
const search_interval = 20 // sec
const search_timer = new Timer(
  () => {
    if (limitter.canSearch()) {
      client.search(search_query, 'recent')
      .then((tweets) => {
        limitter.countUp(SEARCH)
        tweets.statuses.forEach(
          (tweet) => {
            resolver.addUnresolved(tweet)
          }
        )
      })
      .catch((err) => {
        logger.error(__filename)
        handleError(err)
      })
    }
  },
  toMS.sec(search_interval)
)

const resolve_timer = new Timer(
  () => resolver.resolve(
    (tweet) => {
      if (limitter.canTweet()) {
        if (
          !resolver.isResolved(tweet, (a, b) => a.id == b.id) &&
          !tweet.retweeted
        ) {
          client.reply(
            tweet.user.screen_name,
            judge() ? Phrases.atari : Phrases.hazure_random(),
            tweet
          )
          .then(() => limitter.countUp(TWEET))
          .catch((err) => {
            logger.error(__dirname+__filename)
            handleError(err)
            resolver.addUnresolved(tweet)
          })
        }
      }
    }
  ),
  toMS.sec(1)
)


export default function activate() {
  search_timer.start()
  resolve_timer.start()
}
