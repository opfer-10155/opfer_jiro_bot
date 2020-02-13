import client from '../../commons/client'
const search_query = "クソ"

it('鍵垢のツイートは検索できないのか', async () => {
  const res = await client.search(search_query, 'recent')
  const tweets = res.statuses
  console.log(tweets.map(tweet => tweet.user.screen_name))
  console.log(tweets.map(tweet => tweet.user.protected))
  expect(tweets.length == 0).toBeFalsy()
  expect(tweets.filter(tweet => tweet.user.protected).length === 0).toBeTruthy()
})
