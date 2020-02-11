import limitter, {TWEET, SEARCH} from '../../middleware/limitter'
import Timer, { toMS } from '../../middleware/timer'
import client from '../../middleware/client'
import Resolver from '../../middleware/resolver'
import Twitter = require('twitter')
import judge from './judge'
import handleError from '../../middleware/handleErrors'
import logger from '../../middleware/logger'
import search_query from './query'

const resolver = new Resolver<Twitter.ResponseData>()

const getTL_timer = new Timer(
  () => {
    client.getTL(200/* search_query, 'recent' */)
    .then(tweets => {
      limitter.countUp(SEARCH)
      tweets/*.statuses*/.forEach(
        (tweet) => {
          resolver.addUnresolved(tweet)
        }
      )
    })
    .catch((err) => {
      logger.error(__filename)
      handleError(err)
    })
  },
  toMS.sec(60)
)

// const search_interval = 10
// const search_timer = new Timer(
//   () => {
//     client.search(search_query, 'recent')
//     .then(tweets => {
//       limitter.countUp(SEARCH)
//       tweets.statuses.forEach(
//         (tweet) => {
//           resolver.addUnresolved(tweet)
//         }
//       )
//     })
//     .catch((err) => {
//       logger.error(__filename)
//       handleError(err)
//     })
//   },
//   toMS.sec(search_interval)
// )


const resolve_timer = new Timer(
  () => resolver.resolve(
    (tweet) => {
      if (limitter.canTweet()) {
        if (
          !resolver.isResolved(tweet, (a, b) => a.id == b.id) &&
          !tweet.retweeted && tweet.user.following &&
          judge(tweet)
        ){
          // logger.debug(tweet.user.screen_name)
          // logger.debugtweet.text)
          // logger.debug(tweet.created_at)
          client.reply(
            'クソですか？',
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
  getTL_timer.start()
  resolve_timer.start()
}
