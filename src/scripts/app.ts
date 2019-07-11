import fs = require('fs');
import Twitter = require('twitter');
import handleError from '../middleware/hundleErrors';

const limit_tweet_per_3h           = 300;
const limit_get_timeline_per_15min = 15;

let tweet_count = 0;
let getTL_count = 0;

const keywords = [
  '#オプファーは二郎を奢れ',
  '#オプファーは歌志軒を奢れ'
];

const max        = 125; // 確率の分母
const atari      = 26; // アタリの数字
let since_id     = undefined;

const unreplied       = [];
let replied: number[] = [];

const phrase_path = 'src/phrase/variety.text'
const encode      = { encoding: 'utf-8' }
const phrases     = fs.readFileSync(phrase_path, encode).split('$');

const toMS = {
  sec: n => n * 1000,
  minute: n => toMS.sec(n * 60),
  hour: n => toMS.minute(n * 60)
}

const client = new Twitter({
  consumer_key        : process.env.MY_CONSUMER_KEY,
  consumer_secret     : process.env.MY_CONSUMER_SECRET,
  access_token_key    : process.env.MY_ACCESS_TOKEN,
  access_token_secret : process.env.MY_ACCESS_TOKEN_SECRET
});

/**
 * ## Reset get_timeline_count every 15 minutes
 * Rest APIの利用制限に対応するため、15分ごとにTLをGETした回数のカウントをリセットする
 */
const timer1 = setInterval(
  () => { getTL_count = 0; },
  toMS.minute(15)
);

/**
 * ## Reset get_timeline_count every 3 hours
 * 3時間ごとに自分がツイートした回数をリセットする
 */
const timer2 = setInterval(
  () => { tweet_count = 0; },
  toMS.hour(3)
);

/**
 * ## Run main process every 1 minute
 * 1分に1回TLの取得とリプライを行う。
 */
const timer3 = setInterval(
  () => {
    resolveTweets();
    getTL(client)
    .then(main)
    .catch(handleError)
  },
  toMS.minute(1)
);

/**
 * ## Automatic tweet every 12 hours
 * 12時間に1回自動ツイートする(生存確認)
 */
const timer4 = setInterval(
  () => { whisper(client) },
  toMS.hour(12)
)

function main (tweets: Twitter.ResponseData) {
  tweets.forEach((tweet: any) => {
    // whether keyword exist in tweet or not
    if (findKeyword(tweet.text) && !tweet.retweeted) {
      if (tweet_count < limit_tweet_per_3h) {
        if (atari === randamInt(max)) { reply(client, '奢ります'     , tweet) }
        else                          { reply(client, randomPhrase(), tweet) }
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

/**
 * ## Reply
 * tweetに対してリプライを送る
 * @param client instance
 * @param message tweet text
 * @param tweet reply target
 */
function reply (client: Twitter, message : string, tweet: any) {
  tweet_count++;
  if(!isResolved(tweet.id)) {
    insertToArray(replied, tweet.id)
    client.post('statuses/update', {
        status: message,
        in_reply_to_status_id: tweet.id_str,
        auto_populate_reply_metadata: true
    })
    .catch((e: any) => { console.error(e) })
  }
}

/**
 * ## Automatic tweet
 * tweet automatically to check this app is running well
 * @param client instance
 */
function whisper (client: Twitter) {
  tweet_count++;
  client.post('statuses/update', { status: '#オプファーは二郎を奢れ' })
  .catch(handleError)
}

/**
 * ## Get TimeLine
 * clientのユーザーのタイムラインを受け取ってArray<Tweet>のPromiseを返す
 * @param {Twitter} client instance
 * @returns {Promise<Object[]>} Object is tweet object
 */
function getTL (client: Twitter) {
  if (getTL_count < limit_get_timeline_per_15min) {
    getTL_count++;
    return client.get('statuses/home_timeline', {
      count: 200,
      since_id: since_id,
    })
  }
}

/**
 * ## random Int
 * get random number in range from 0 <= x < max
 * @param {number} max
 * @returns {number}
 */
const randamInt = (max: number) => Math.floor(Math.random() * max);

/**
 * ## random phrase
 * get random phrase from ../phrase/variety.txt
 * @returns {number}
 */
const randomPhrase = () => phrases[randamInt(phrases.length)];

/**
 * ## find keyword
 * from tweet.text, find keyword
 * @param {string} text
 * @returns {boolean}
 */
function findKeyword (text: string) {
  for (const i in keywords ) {
    if (text.indexOf(keywords[i]) > -1) {
      return true
    }
  }
  return false
}

/**
 * ## whether the tweet was replied
 * find the id from the list of replied tweets
 * @param {number} id of the tweet
 * @returns {boolean}
 */
const isResolved = (id: number) => replied.indexOf(id) > -1;

/**
 * ## insert
 * insert a value to the head of the list
 * @param {number[]}  arr Array
 * @param {number}    val
 */
function insertToArray (arr: number[], val: number) {
  if (replied.length >= 500) {
    replied.splice(0, 1)
  }
  replied.push(val)
}
