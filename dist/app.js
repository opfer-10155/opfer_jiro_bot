define("app", ["require", "exports", "fs", "twitter"], function (require, exports, fs, Twitter) {
    "use strict";
    exports.__esModule = true;
    var limit_tweet_per_3h = 300;
    var limit_get_timeline_per_15min = 15;
    var tweet_count = 0;
    var getTL_count = 0;
    var keywords = ['#オプファーは二郎を奢れ', '#オプファーは歌志軒を奢れ'];
    var max = 125; // 確率の分母
    var atari = 26; // アタリの数字
    var since_id = undefined;
    var unreplied = [];
    var replied = [];
    var phrases = fs.readFileSync('src/phrase/variety.text', { encoding: 'utf-8' }).split('$');
    var client = new Twitter({
        consumer_key: process.env.MY_CONSUMER_KEY,
        consumer_secret: process.env.MY_CONSUMER_SECRET,
        access_token_key: process.env.MY_ACCESS_TOKEN,
        access_token_secret: process.env.MY_ACCESS_TOKEN_SECRET
    });
    var timer1 = setInterval(function () { getTL_count = 0; }, 60 * 1000 * 15);
    var timer2 = setInterval(function () { tweet_count = 0; }, 60 * 1000 * 60 * 3);
    var timer3 = setInterval(function () {
        resolveTweets();
        getTL(client)
            .then(function (tweets) { main(tweets); })["catch"](function (e) { console.error(e); });
    }, 60 * 1000);
    var timer4 = setInterval(function () { whisper(client); }, 60 * 1000 * 60 * 12);
    function main(tweets) {
        tweets.forEach(function (tweet) {
            // whether keyword exist in tweet or not
            if (findKeyword(tweet.text) && !tweet.retweeted) {
                if (tweet_count < limit_tweet_per_3h) {
                    if (!isResolved(tweet.id)) {
                        if (atari === randamInt(max)) {
                            reply(client, '奢ります', tweet);
                        }
                        else {
                            reply(client, randomPhrase(), tweet);
                        }
                    }
                }
                else {
                    unreplied.push(tweet);
                }
            }
        });
    }
    // unrepliedのtweet群を処理
    function resolveTweets() {
        unreplied.forEach(function (tweet) {
            if (tweet_count < limit_tweet_per_3h) {
                if (atari === randamInt(max)) {
                    reply(client, '奢ります', tweet);
                }
                else {
                    reply(client, randomPhrase(), tweet);
                }
                unreplied.splice(unreplied.indexOf(tweet), 1);
            }
        });
    }
    function reply(client, message, tweet) {
        tweet_count++;
        insertToArray(replied, tweet.id);
        client.post('statuses/update', {
            status: message,
            in_reply_to_status_id: tweet.id_str,
            auto_populate_reply_metadata: true
        })["catch"](function (e) { console.error(e); });
    }
    function whisper(client) {
        tweet_count++;
        client.post('statuses/update', { status: '#オプファーは二郎を奢れ' })["catch"](function (e) { console.error(e); });
    }
    function getTL(client) {
        /**
         * clientのユーザーのタイムラインを受け取ってArray<Tweet>のPromiseを返す
         */
        if (getTL_count < limit_get_timeline_per_15min) {
            getTL_count++;
            return client.get('statuses/home_timeline', {
                count: 200,
                since_id: since_id
            });
        }
    }
    function randamInt(max) {
        /**
         * range 0 <= x < max
         */
        return Math.floor(Math.random() * max);
    }
    function randomPhrase() {
        return phrases[randamInt(phrases.length)];
    }
    function findKeyword(text) {
        for (var i in keywords) {
            if (text.indexOf(keywords[i]) > -1) {
                return true;
            }
        }
        return false;
    }
    function isResolved(id) {
        return replied.indexOf(id) > -1;
    }
    function insertToArray(arr, val) {
        if (replied.length >= 200) {
            replied.splice(0, 1);
        }
        replied.push(val);
    }
});