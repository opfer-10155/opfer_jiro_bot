import handleError from './commons/handleErrors'
import limitter, {TWEET, SEARCH, GET_TL} from './commons/limitter'
import Timer, { toMS } from './commons/timer'
import jiro_bot from './survices/jiro_bot'
import unko_bot from './survices/unko_bot'
import getMostRecentTweet from './commons/getMostRecentTweet'
import client from './commons/client'
import createCache from './commons/cache'

process.on('uncaughtException', (err: any) => {
  console.error(`Uncaught Expection ${err}`)
  handleError(err)
});

/**
 * ## Reset get_timeline_count every 15 minutes
 * Rest APIの利用制限に対応するため、15分ごとにTLをGETした回数のカウントをリセットする
 */
setInterval(
  () => limitter.reset(GET_TL),
  toMS.minute(15)
)


/**
 * ## Reset search_count every 15 minutes
 * Rest APIの利用制限に対応するため、15分ごとにTLをGETした回数のカウントをリセットする
 */
setInterval(
  () => limitter.reset(SEARCH),
  toMS.minute(15)
)


/**
 * ## Reset get_timeline_count every 3 hours
 * 3時間ごとに自分がツイートした回数をリセットする
 */
setInterval(
  () => limitter.reset(TWEET),
  toMS.hour(3)
)

const cache = createCache()
const since_id_key = 'since_id'

const main = async () => {
  const firstTweets = await client.getTL(200)
  limitter.countUp(GET_TL)
  const mostRecentTweet = getMostRecentTweet(firstTweets)
  await cache.set(since_id_key, mostRecentTweet.id_str)
  const getTL_timer = new Timer(
    async () => {
      if (limitter.canGetTL()) {
        const tweets = await client.getTL(200, cache.get(since_id_key))
        jiro_bot(tweets)
        unko_bot(tweets)
        if (tweets.length !== 0) {
          const mostRecentTweet = getMostRecentTweet(tweets)
          await cache.set('since_id', mostRecentTweet.id_str)
        }
      }
    },
    toMS.minute(1)
  )
  getTL_timer.start()
}

main()

// jiro_bot_activate()
// unko_bot_activate()
