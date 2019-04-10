import fs = require('fs');
import Twitter = require('twitter');

const limit_tweet_per_3h           = 300;
const limit_get_timeline_per_15min = 15;

let tweet_count = 0;
let getTL_count = 0;

const keywords   = ['#オプファーは二郎を奢れ', '#オプファーは歌志軒を奢れ'];
const max        = 125; // 確率の分母
const atari      = 26; // アタリの数字
let since_id     = undefined;

const unreplied       = [];
let replied: number[] = [];
const phrases = fs.readFileSync('src/phrase/variety.text', { encoding: 'utf-8' }).split('\n');

const client = new Twitter({
  consumer_key        : process.env.MY_CONSUMER_KEY,
  consumer_secret     : process.env.MY_CONSUMER_SECRET,
  access_token_key    : process.env.MY_ACCESS_TOKEN,
  access_token_secret : process.env.MY_ACCESS_TOKEN_SECRET
});


const timer1 = setInterval(
  () => {
    getTL_count = 0;
  }, 
  60 * 1000 * 15
);

const timer2 = setInterval(
  () => {
    tweet_count = 0;
    if (replied.length >= 200) { replied = []; }
  },
  60 * 1000 * 300
)

const timer3 = setInterval(
  () => {
    resolveTweets();
    getTL(client)
    .then( (tweets) => { main(tweets)     })
    .catch((e: any) => { console.error(e) })
  },
  60 * 1000
);

const timer4 = setInterval(
  () => { whisper(client) },
  60 * 1000 * 60 * 12
)

function main (tweets: Twitter.ResponseData) {

  tweets.forEach((tweet: any) => {

    // whether keyword exist in tweet or not
    if (findKeyword(tweet.text) && !tweet.retweeted) {

      if (tweet_count < limit_tweet_per_3h) {
        if(replied.indexOf(tweet.id) == -1) {
          if (atari === randamInt(max)) { reply(client, '奢ります', tweet); }
          else                          { reply(client, randomPhrase(), tweet); }
        }
      }
      else { unreplied.push(tweet) }
    }
  })
}

// unrepliedのtweet群を処理
function resolveTweets () {

  unreplied.forEach((tweet) => {

    if (tweet_count < limit_tweet_per_3h) {

      if (atari === randamInt(max)) { reply(client, '奢ります', tweet); }
      else                          { reply(client, randomPhrase(), tweet); }

      unreplied.splice(unreplied.indexOf(tweet), 1);
    }
  })
}

function reply (client: Twitter, message : string, tweet: any) {
  tweet_count++;
  replied.push(tweet.id);
  client.post('statuses/update', {
      status: message, 
      in_reply_to_status_id: tweet.id_str,
      auto_populate_reply_metadata: true
  })
  .catch((e: any) => { console.error(e) })
}

function whisper (client: Twitter) {
  tweet_count++;
  client.post('statuses/update', {
    status: '#オプファーは二郎を奢れ'
  })
  .catch((e: any) => { console.error(e) })
}

function getTL (client: Twitter) {
  /**
   * clientのユーザーのタイムラインを受け取ってArray<Tweet>のPromiseを返す
   */
  if (getTL_count < limit_get_timeline_per_15min) {
    getTL_count++;
    return client.get('statuses/home_timeline', {
      count: 200,
      since_id: since_id,
    })
  }
}

function randamInt (max: number) {
  /**
   * range 0 <= x < max
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
