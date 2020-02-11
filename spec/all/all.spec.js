import Twitter = require('twitter')
import handleError from '../../src/middleware/handleErrors'
import limitter, {TWEET, SEARCH} from '../../src/middleware/limitter'
import resolver from '../../src/middleware/tweetResolver'
import client from '../../src/middleware/client'
import Phrases from '../../src/constants/phrase'
import { keywords } from '../../src/constants/keywords'
import Timer, {
  toMS,
  AUTOMATIC_TWEET,
  SEARCH_REGULAR,
  RESET_GETTL_COUNT,
  RESET_TWEET_COUNT
} from '../../src/middleware/timer'
import { isMainThread } from 'worker_threads'

describe('クライアントの正常な動作', () => {
  it('tweetの取得', () => {
    client.getTL()
      .then((tweets) => {
        expect(tweets.length).toBeGreaterThan(0)
      })
      .catch(handleError)
  })

  it('ツイート・リプライができる', () => {
    const text = 'test at ' + Date()
    client.tweet(text)
      .then(tweet => {
        
      })
  })
})
