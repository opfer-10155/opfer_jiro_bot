import client from '../../commons/client'
import getMostRecentTweet from '../../commons/getMostRecentTweet'
import search_query from '../../survices/unko_bot/query'

const wait = (n: number) => {
  return new Promise<number>((resolve, reject) => {
    setTimeout(() => {
      resolve(n)
    }, n)
  })
}

test('since_idが有効である', async () => {
  const firstTweets = await client.getTL(200)
  let mostRecentTweet = getMostRecentTweet(firstTweets)
  const since_id = mostRecentTweet.id_str
  const secondTweets = await client.search("ちんちん", "recent", since_id)
  expect(secondTweets.statuses.filter(tweet => tweet.created_at < mostRecentTweet.created_at)).toEqual([])
  if (secondTweets.statuses) mostRecentTweet = getMostRecentTweet(secondTweets.statuses)
  const since_id2 = mostRecentTweet.id_str
  await wait(3 * 1000)
  const thirdTweets = await client.search(search_query, "recent", since_id2)
  expect(thirdTweets.statuses.filter(tweet => tweet.created_at < mostRecentTweet.created_at)).toEqual([])
})

test('unkoの場合', async () => {
  const firstTweets = await client.search(search_query, "recent")
  let mostRecentTweet = getMostRecentTweet(firstTweets.statuses)
  const since_id = mostRecentTweet.id_str
  await wait(3 * 1000)
  const secondTweets = await client.search(search_query, "recent", since_id)
  expect(secondTweets.statuses.filter(tweet => tweet.created_at < mostRecentTweet.created_at)).toEqual([])
})
