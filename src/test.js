const Twitter = require('twitter')

const twitter = new Twitter({
  consumer_key: 'K3jDBEzIT4odZ0XtHvTAfgd5k',
  consumer_secret: 's6ehFYyZ393iJQTq7RRybxyXTwkVRiFo023f7xKgzeRtdD6f4w',
  access_token_key: '1014932745980502016-Qv8JawMysf3NLaN26WHHNqSesbJti5',
  access_token_secret: '3V4amMQlhgxoLgvXawsVDikX53HNH1AcLDfM7HmicrMV5'
})

const url = 'search/tweets.json'
const get_timeline = 'statuses/home_timeline'
const keyword = '#オプファーは二郎を奢れ'

let since_id;
twitter.get(get_timeline, {count: 5})
  .then((tweets) => {
    console.log(tweets[0].id)
    since_id = tweets[0].id
  })

console.log(since_id)

const params = {
  count : 5,      // 取得するtweet数
  q     : keyword,  // 検索キーワード
  since_id
}

twitter.get(url, params)
  .then((tweets) => {
    tweets.statuses.forEach(t => {
      console.log(t.text)
      console.log(t.created_at)
      console.log('---------------------------------')
    })
  })
  .catch((err) => { console.error(err) })