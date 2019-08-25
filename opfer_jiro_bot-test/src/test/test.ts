import Twitter = require('twitter');
import * as fs from 'fs'

// const client = new Twitter({
//   consumer_key        : "aRrPoEjx8SfmDoWm8evJtZ48d",// process.env.MY_CONSUMER_KEY,
//   consumer_secret     : "lYh9jvxzoFTGxi5rbBHOCbd4guoNfcYUYQMT3T21huhqqSimNs",//process.env.MY_CONSUMER_SECRET,
//   access_token_key    : "1014932745980502016-vZ24a4h2I7DZJeakjL35z1WHc8sNQq",//process.env.MY_ACCESS_TOKEN,
//   access_token_secret : "zV2T5YY1E20Bf2zrKlTmfARBeXiRcPhSKCzmfbZ0pw4M0"//process.env.MY_ACCESS_TOKEN_SECRET
// });

// function whisper (client: Twitter) {
//   client.post('statuses/update', {
//     status: ''
//   })
//   .catch((e: any) => { console.error(e) })
// }

// whisper(client)


const phrases = fs.readFileSync('../phrase/variety.text', { encoding: 'utf-8' }).split('$');

function randomPhrase () {
  return phrases[randamInt(phrases.length)];
}

function randamInt (max: number) {
  /**
   * range 0 <= x < max
   */
  return Math.floor(Math.random() * max);
}

console.log(phrases)
console.log(randomPhrase())
