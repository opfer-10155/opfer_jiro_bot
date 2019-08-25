import fs = require('fs');
import Twitter = require('twitter');

const limit_tweet_per_3h           = 300;
const limit_tweet_per_15min        = 25;
const limit_get_timeline_per_15min = 15;

let tweet_count = 0;
let getTL_count = 0;

const keywords   = ['#オプファーは二郎を奢れ', '#オプファーは歌志軒を奢れ'];
const max        = 150; // 確率の分母
const atari      = 26; // アタリの数字
let since_id     = undefined; // アタリ判定の重複をさけるためのもの
const unreplied = []; // まだ解決されてないツイート群
let replied: number[] = []; // 二重リプ対策用 リプし終わったtweet.idをしばらく格納する

const phrases = fs.readFileSync('src/phrase/variety.text', { encoding: 'utf-8' }).split('\n');
const sample_tweets = JSON.parse(fs.readFileSync('sample.json', { encoding: 'utf-8' }))

const client = new Twitter({
  consumer_key        : "aRrPoEjx8SfmDoWm8evJtZ48d",// process.env.MY_CONSUMER_KEY,
  consumer_secret     : "lYh9jvxzoFTGxi5rbBHOCbd4guoNfcYUYQMT3T21huhqqSimNs",//process.env.MY_CONSUMER_SECRET,
  access_token_key    : "1014932745980502016-vZ24a4h2I7DZJeakjL35z1WHc8sNQq",//process.env.MY_ACCESS_TOKEN,
  access_token_secret : "zV2T5YY1E20Bf2zrKlTmfARBeXiRcPhSKCzmfbZ0pw4M0"//process.env.MY_ACCESS_TOKEN_SECRET
});


// const timer1 = setInterval(
//   () => {
//     getTL_count = 0;
//   }, 
//   60 * 1000 * 15
// );

// const timer2 = setInterval(
//   () => {
      //   tweet_count = 0;
      //   replied = [];
      // },
//   60 * 1000 * 300
// )

// getTL(client)
// .then(() => { main(sample_tweets) })
// .catch((e) => { console.error(e) })
main(sample_tweets)
const timer3 = setInterval(
  () => {
    // resolveTweets();
    // getTL(client)
    // .then(() => { main(sample_tweets) })
    // .catch((e) => { console.error(e) })
    main(sample_tweets)
  },
  60 * 1000
);

// const timer4 = setInterval(
//   () => { whisper(client) },
//   60 * 1000 * 60 * 12
// )


function main (tweets: Twitter.ResponseData) {
  console.log('get TimeLine\n');
  let tmp = new Date('December 17, 1995 03:24:00');
  tweets.forEach((tweet: any) => {
    // save tweet_id which is most recent
    // const tweet_day = new Date(tweet.created_at);
    // if (tweet_day > tmp) {
    //   since_id = tweet.id;
    //   tmp = tweet_day;
    // }
    // whether keyword exist in tweet or not
    if (findKeyword(tweet.text) && !tweet.retweeted) {
      console.log('find keyword from  ' + tweet.source);

      if (tweet_count < limit_tweet_per_15min) {
        if(replied.indexOf(tweet.id) == -1) {
          if (atari === randamInt(max)) { reply(client, '奢ります', tweet); }
          else                          { reply(client, randomPhrase(), tweet); }
        }
      }

      else { unreplied.push(tweet) }
    }
  })
  console.log('unreplied')
  console.log(unreplied)
  console.log('replied')
  console.log(replied)
}


function resolveTweets () {
  unreplied.forEach((tweet) => {
    if (tweet_count < limit_tweet_per_15min) {
      if (atari === randamInt(max)) { reply(client, '奢ります', tweet); }
      else                          { reply(client, randomPhrase(), tweet); }
      unreplied.splice(unreplied.indexOf(tweet), 1)
    }
  })
}

function reply (client: Twitter, message : string, tweet: any) {
  tweet_count++
  console.log(tweet)
  // client.post('statuses/update', {
  //     status: message, 
  //     in_reply_to_status_id: tweet.id_str,
  //     auto_populate_reply_metadata: true
  // })
  // .then((tweet) => { console.log(tweet) })
  // .catch((e) => { console.error(e) })
  replied.push(tweet.id)
}

function getTL (client: Twitter) {
  /**
   * clientのユーザーのタイムラインを受け取ってArray<Tweet>のPromiseを返す
   */
  if (getTL_count < limit_get_timeline_per_15min) {
    getTL_count++
    return client.get('statuses/home_timeline', {
      count: 200,
      since_id: since_id,
    })
  }
}

function randamInt (max: number) {
  /**
   * range 0 < x < max
   */
  return Math.floor(Math.random() * max);
}

function randomPhrase () {
  return phrases[randamInt(phrases.length)];
}

function findKeyword (text: string) {
  for (const i in keywords ) {
    if (text.indexOf(keywords[i]) > -1) {
      return true
    }
  }
  return false
}
