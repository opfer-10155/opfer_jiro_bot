import handleError from './middleware/handleErrors'
import limitter, {TWEET, SEARCH, GET_TL} from './middleware/limitter'
import Timer, { toMS } from './middleware/timer'
import jiro_bot_activate from './survices/jiro_bot'
import unko_bot_activate from './survices/unko_bot'
import client from './middleware/client'

process.on('uncaughtException', (err: any) => {
  console.error(`Uncaught Expection ${err}`)
  handleError(err)
});


/**
 * ## Reset get_timeline_count every 15 minutes
 * Rest APIの利用制限に対応するため、15分ごとにTLをGETした回数のカウントをリセットする
 */
const RESET_GETTL_COUNT = new Timer(
  () => limitter.reset(GET_TL),
  toMS.minute(15)
)


/**
 * ## Reset search_count every 15 minutes
 * Rest APIの利用制限に対応するため、15分ごとにTLをGETした回数のカウントをリセットする
 */
const RESET_SEARCH_COUNT = new Timer(
  () => limitter.reset(SEARCH),
  toMS.minute(15)
)


/**
 * ## Reset get_timeline_count every 3 hours
 * 3時間ごとに自分がツイートした回数をリセットする
 */
const RESET_TWEET_COUNT = new Timer(
  () => limitter.reset(TWEET),
  toMS.hour(3)
)

client.getTL(200).then(
  (tweets) => console.log(JSON.stringify(tweets))
)

// RESET_GETTL_COUNT.start()
// RESET_SEARCH_COUNT.start()
// RESET_TWEET_COUNT.start()
// jiro_bot_activate()
// unko_bot_activate()
