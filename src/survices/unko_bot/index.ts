import limitter, {TWEET, SEARCH} from '../../commons/limitter'
import Timer, { toMS } from '../../commons/timer'
import client from '../../commons/client'
import Resolver from '../../commons/resolver'
import Twitter = require('twitter')
import judge from './judge'
import handleError from '../../commons/handleErrors'
import logger from '../../commons/logger'
import search_query from './query'
import getMostRecentTweet from '../../commons/getMostRecentTweet'

const my_name = "opfer_jiro_bot"

// async () => {
//   const firstTweets = await client.getTL(200)
//   let mostRecentTweet = getMostRecentTweet(firstTweets)
//   const since_id = mostRecentTweet.id_str
//   const getTL_timer = new Timer(
//     async () => {
//       const tweets = await client.getTL(200, since_id/* search_query, 'recent' */)
//       tweets/*.statuses*/.forEach(tweet => {
//         if (
//           limitter.canTweet() &&
//           judge(tweet) &&
//           !tweet.retweeted &&
//           tweet.user.following)
//         {
//           // logger.debug(tweet.user.screen_name)
//           // logger.debugtweet.text)
//           // logger.debug(tweet.created_at)
//           client.reply(
//             'クソですか？',
//             tweet
//           )
//           .then(() => limitter.countUp(TWEET))
//           .catch((err) => {
//             logger.error(__dirname+__filename)
//             handleError(err)
//           })
//         }
//       })
//       .catch((err) => {
//         logger.error(__filename)
//         handleError(err)
//       })
//     },
//     toMS.sec(60)
//   )
// }

export default (tweets) => {
  tweets.forEach(tweet => {
    if (!('retweeted_status' in tweet)) {
      if (limitter.canTweet() &&
          judge(tweet)　&&
          tweet.user.screen_name !== my_name
      ) {
        console.log(tweet)
        client.reply(
          'クソですか？',
          tweet
        )
        .then(() => limitter.countUp(TWEET))
        .catch((err) => {
          logger.error(__dirname+__filename)
          handleError(err)
        })
      }
      if (
        limitter.canTweet() &&
        tweet.in_reply_to_screen_name === my_name &&
        tweet.user.screen_name !== my_name
      ) {
        console.log(tweet)
        client.reply(
          '好きになりましたか？',
          tweet
        )
        .then(() => limitter.countUp(TWEET))
        .catch((err) => {
          logger.error(__filename)
          handleError(err)
        })
      }
    }
  })
}
