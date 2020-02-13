import limitter, {TWEET, SEARCH} from '../../commons/limitter'
import Timer, { toMS } from '../../commons/timer'
import client from '../../commons/client'
import handleError from '../../commons/handleErrors'
import getMostRecentTweet from '../../commons/getMostRecentTweet'
import createCache from '../../commons/cache'

const search_query = "#オプファーは二郎を奢れ"
const cache = createCache()

test('startした瞬間より前のツイートを取ってこない', async () => {
  const now = new Date()
  const firstTweets = await client.search(search_query, 'recent')
  expect(firstTweets.statuses.length === 0).toBeFalsy()
  const mostRecentTweet = getMostRecentTweet(firstTweets.statuses)
  await cache.set('since_id', mostRecentTweet.id_str)
  const res = await client.search(search_query, 'recent', cache.get('since_id'))
  const tweets = res.statuses
  expect(tweets).toEqual([])
})
