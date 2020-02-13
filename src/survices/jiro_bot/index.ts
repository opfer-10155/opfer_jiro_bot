import limitter, {TWEET, SEARCH, GET_TL} from '../../commons/limitter'
import Timer, { toMS } from '../../commons/timer'
import client from '../../commons/client'
import { judge } from './components/judge'
import { keywords } from './constants/keywords'
import Phrases from './components/phrase'
import handleError from '../../commons/handleErrors'
import logger from '../../commons/logger'
import getMostRecentTweet from '../../commons/getMostRecentTweet'
import createCache from '../../commons/cache'

// const search_query = "#オプファーは二郎を奢れ"
// const search_interval = 60 // sec
// const cache = createCache()

// const resolve = async () => {
//   if (limitter.canGetTL()/*canSearch()*/) {
//     const res = await client.search(search_query, 'recent', cache.get('since_id'))
//     limitter.countUp(GET_TL/*SEARCH*/)
//     const tweets = res/*.statuses*/
//     tweets.forEach(tweet => {
//       if (limitter.canTweet() && !tweet.retweeted) {
//         const message = judge() ? Phrases.atari : Phrases.hazure_random()
//         client.reply(message, tweet)
//         .then(() => limitter.countUp(TWEET))
//         .catch((err) => {
//           logger.error(__filename)
//           handleError(err)
//         })
//       }
//     })
//     if (tweets.length !== 0) {
//       console.log(tweets)
//       const mostRecentTweet = getMostRecentTweet(tweets)
//       await cache.set('since_id', mostRecentTweet.id_str)
//     }
//   }
// }

// export default async () => {
//   const firstTweets = await client.getTL(/*search_query, 'recent'*/)
//   limitter.countUp(GET_TL/*SEARCH*/)
//   const mostRecentTweet = getMostRecentTweet(firstTweets/*.statuses*/)
//   await cache.set('since_id', mostRecentTweet.id_str)
//   /**
//    * ## Run main process every 1 minute
//    * 1分に1回TLの取得とリプライを行う。
//    */
//   const search_timer = new Timer(
//     resolve,
//     toMS.sec(search_interval)
//   )
//   search_timer.start()
// }

export default (tweets) => {
  tweets.forEach(tweet => {
    if (limitter.canTweet() &&
      !tweet.retweeted &&
      tweet.text.indexOf('#オプファーは二郎を奢れ') > -1)
    {
      console.log(tweet)
      const message = judge() ? Phrases.atari : Phrases.hazure_random()
      client.reply(message, tweet)
      .then(() => limitter.countUp(TWEET))
      .catch((err) => {
        logger.error(__filename)
        handleError(err)
      })
    }
  })
}
