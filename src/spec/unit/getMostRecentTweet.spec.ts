import getMostRecentTweet from '../../commons/getMostRecentTweet'
import mockTL from '../../mock/mockTL.json'

test('最も最近のツイートを取得できている', () => {
  const mostRecentTweet = getMostRecentTweet(mockTL);
  let flag = true;
  mockTL.forEach((tweet) => {
    flag = tweet.created_at < mostRecentTweet.created_at
  })
  expect(flag).toBeTruthy()
})
