define("middleware/timer", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    /**
     * 時間の単位をマイクロ秒にする
     */
    exports.toMS = {
        sec: function (n) { return n * 1000; },
        minute: function (n) { return exports.toMS.sec(n * 60); },
        hour: function (n) { return exports.toMS.minute(n * 60); }
    };
    exports.GETTL_REGULAR = 'GETTL';
    exports.SEARCH_REGULAR = 'SEARCH';
    exports.RESET_TWEET_COUNT = 'RESET_TWEET_COUNT';
    exports.RESET_GETTL_COUNT = 'RESET_GETTL_COUNT';
    exports.AUTOMATIC_TWEET = 'AUTOMATIC_TWEET';
    var timer = {
        start: function (type, callback, interval) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            timer[type] = new Timer(callback, interval, args);
            return timer[type].id;
        },
        stop: function (type) {
            if (timer[type]) {
                timer[type].stop();
                return true;
            }
            return false;
        },
        resume: function (type) {
            if (timer[type]) {
                timer[type].start();
                return true;
            }
            return false;
        }
    };
    exports["default"] = timer;
    var Timer = /** @class */ (function () {
        function Timer(callback, interval) {
            var _this = this;
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this.isStopped = false;
            this.stop = function () {
                _this.isStopped = true;
                clearInterval(_this.id);
            };
            this.callback = callback;
            this.interval = interval;
            this.id = setInterval(callback, interval, args);
        }
        Timer.prototype.start = function () {
            this.isStopped = false;
            this.id = setInterval(this.callback, this.interval, this.args);
        };
        return Timer;
    }());
});
define("middleware/handleErrors", ["require", "exports", "middleware/timer"], function (require, exports, timer_1) {
    "use strict";
    exports.__esModule = true;
    var Rate_Limit_Exceeded = 88;
    /**
     * ## ErrorHandlung
     * use *.catch(handleError)
     */
    function handleError(err) {
        var now = new Date();
        console.error("error occured at ", now);
        console.error(err);
        switch (err.code) {
            case Rate_Limit_Exceeded: {
                timer_1["default"].stop(timer_1.GETTL_REGULAR);
                setTimeout(function () { return timer_1["default"].resume(timer_1.GETTL_REGULAR); }, timer_1.toMS.minute(15));
            }
            default: {
                console.error('Uncaught expection');
            }
        }
    }
    exports["default"] = handleError;
});
define("middleware/limitter", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.TWEET = 'tweet';
    exports.GET_TL = 'getTL';
    exports.SEARCH = 'search';
    /**
     * ## API Limitter
     * RESTAPI利用制限に引っかかるとエラーするのでその対策
     */
    var limitter = {
        tweet_count: 0,
        getTL_count: 0,
        search_count: 0,
        limit_tweet_per_3h: 300,
        limit_get_timeline_per_15min: 15,
        limit_search_per_15min: 180,
        canTweet: function () { return limitter.tweet_count < limitter.limit_tweet_per_3h; },
        canGetTL: function () { return limitter.getTL_count < limitter.limit_get_timeline_per_15min; },
        canSearch: function () { return limitter.search_count < limitter.limit_search_per_15min; },
        reset: function (type) {
            switch (type) {
                case exports.TWEET: {
                    limitter.tweet_count = 0;
                }
                case exports.GET_TL: {
                    limitter.getTL_count = 0;
                }
                case exports.SEARCH: {
                    limitter.search_count = 0;
                }
                default: {
                    throw new Error('Unexpected Input');
                }
            }
        },
        countUp: function (type) {
            switch (type) {
                case exports.TWEET: {
                    limitter.tweet_count++;
                }
                case exports.GET_TL: {
                    limitter.getTL_count++;
                }
                case exports.SEARCH: {
                    limitter.search_count++;
                }
                default: {
                    throw new Error('Unexpected Input');
                }
            }
        }
    };
    exports["default"] = limitter;
});
define("middleware/client", ["require", "exports", "twitter"], function (require, exports, Twitter) {
    "use strict";
    exports.__esModule = true;
    var post_tweet = 'statuses/update';
    var get_timeline = 'statuses/home_timeline';
    var search = 'search/tweets.json';
    /**
     * ## Twitterクライアント
     * 各種動作をリクエストする
     */
    var client = {
        twitter: new Twitter({
            consumer_key: process.env.MY_CONSUMER_KEY,
            consumer_secret: process.env.MY_CONSUMER_SECRET,
            access_token_key: process.env.MY_ACCESS_TOKEN,
            access_token_secret: process.env.MY_ACCESS_TOKEN_SECRET
        }),
        /**
         * ## Automatic tweet
         * tweet automatically to check this app is running well
         * @param client instance
         */
        tweet: function (status) {
            return client.twitter.post(post_tweet, { status: status });
        },
        /**
         * ## Send Reply
         * tweetに対してリプライを送る
         * @param message tweet text
         * @param tweet reply target
         * @returns {Promise<Twitter.ResponseData>}
         */
        reply: function (message, tweet) {
            return client.twitter.post(post_tweet, {
                status: message,
                in_reply_to_status_id: tweet.id_str,
                auto_populate_reply_metadata: true
            });
        },
        /**
         * ## Get TimeLine
         * clientのユーザーのタイムラインを受け取ってArray<Tweet>のPromiseを返す
         * @returns {Promise<Twitter.ResponseData[]>} Object is tweet object
         */
        getTL: function () {
            return client.twitter.get(get_timeline, {
                count: 200
            });
        },
        search: function (keyword, since_id) {
            return client.twitter.get(search, {
                count: 200,
                q: keyword,
                since_id: since_id
            });
        }
    };
    exports["default"] = client;
});
define("middleware/judge", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var max = 125; // 確率の分母
    var atari = 26; // アタリの数字
    /**
     * ## random Int
     * get random number in range from 0 <= x < max
     * @param {number} max
     * @returns {number}
     */
    var randamInt = function (max) { return Math.floor(Math.random() * max); };
    exports.judge = function () { return (atari === randamInt(max)); };
});
define("constants/phrase", ["require", "exports", "fs"], function (require, exports, fs) {
    "use strict";
    exports.__esModule = true;
    var phrase_path = 'src/constants/phrase/variety.txt';
    var whisper_path = 'src/constants/phrase/whisper.txt';
    var randomInt = function (max) { return Math.floor(Math.random() * max); };
    var encode = { encoding: 'utf-8' };
    var phrases = fs.readFileSync(phrase_path, encode).split('$');
    var auto_message = fs.readFileSync(whisper_path, encode);
    var Phrases = {
        atari: '奢ります',
        hazure_random: function () { return phrases[randomInt(phrases.length)]; },
        auto: auto_message
    };
    exports["default"] = Phrases;
});
define("middleware/tweetResolver", ["require", "exports", "middleware/client", "middleware/limitter", "middleware/judge", "constants/phrase", "middleware/handleErrors"], function (require, exports, client_1, limitter_1, judge_1, phrase_1, handleErrors_1) {
    "use strict";
    exports.__esModule = true;
    var resolver = {
        unreplied: [],
        replied: [],
        /**
         * ## resolver Tweet
         * tweetに渡したツイートに判定and返信する
         * @param {Twitter.ResponseData} tweet resolveするtweet
         * @param {Client} client replyするクライアント
         * @param {Limitter} limitter API呼び出し回数を管理する
         * @return {Twitter.ResponseData} 入力で渡したtweet
         */
        resolveTweet: function (tweet) {
            if (limitter_1["default"].canTweet()) {
                if (judge_1.judge()) {
                    resolver.sendReply(phrase_1["default"].atari, tweet);
                }
                else {
                    resolver.sendReply(phrase_1["default"].hazure_random(), tweet);
                }
            }
            else {
                resolver.unreplied.push(tweet);
            }
        },
        resolveUnrepliedTweets: function () {
            resolver.unreplied.forEach(function (tweet, index) {
                resolver.resolveTweet(tweet);
                resolver.unreplied.splice(index, 1);
            });
        },
        sendReply: function (message, tweet) {
            return client_1["default"].reply(message, tweet)
                .then(function () {
                resolver.addResolved(tweet.id);
                limitter_1["default"].countUp(limitter_1.TWEET);
                return tweet;
            })["catch"](handleErrors_1["default"]);
        },
        /**
         * ## whether the tweet was replied
         * find the id from the list of replied tweets
         * @param {number} id of the tweet
         * @returns {boolean}
         */
        isResolved: function (id) { return resolver.replied.indexOf(id) > -1; },
        /**
         * ## insert to replied
         * insert a value to the head of the list
         * @param {number} val tweet
         */
        addResolved: function (tweet) {
            if (resolver.replied.length >= 500) {
                resolver.replied.splice(0, 1);
            }
            resolver.replied.push(tweet.id);
        }
    };
    exports["default"] = resolver;
});
define("constants/keywords", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.keywords = [
        '#オプファーは二郎を奢れ',
        '#オプファーは歌志軒を奢れ'
    ];
    /**
     * ## whether exist keyword in tweet.text
     * from tweet.text, find keyword
     * @param {string} text
     * @returns {boolean}
     */
    function findKeyword(text) {
        for (var i in exports.keywords) {
            if (text.indexOf(exports.keywords[i]) > -1) {
                return true;
            }
        }
        return false;
    }
    exports["default"] = findKeyword;
});
define("app", ["require", "exports", "middleware/handleErrors", "middleware/limitter", "middleware/tweetResolver", "middleware/client", "constants/phrase", "constants/keywords", "middleware/timer"], function (require, exports, handleErrors_2, limitter_2, tweetResolver_1, client_2, phrase_2, keywords_1, timer_2) {
    "use strict";
    exports.__esModule = true;
    process.on('uncaughtException', function (err) {
        console.error("Uncaught Expection " + err);
        handleErrors_2["default"](err);
    });
    /**
     * ## Reset get_timeline_count every 15 minutes
     * Rest APIの利用制限に対応するため、15分ごとにTLをGETした回数のカウントをリセットする
     */
    timer_2["default"].start(timer_2.RESET_GETTL_COUNT, function () { return limitter_2["default"].reset(limitter_2.SEARCH); }, timer_2.toMS.minute(15));
    /**
     * ## Reset get_timeline_count every 3 hours
     * 3時間ごとに自分がツイートした回数をリセットする
     */
    timer_2["default"].start(timer_2.RESET_TWEET_COUNT, function () { return limitter_2["default"].reset(limitter_2.TWEET); }, timer_2.toMS.hour(3));
    /**
     * ## Run main process every 1 minute
     * 1分に1回TLの取得とリプライを行う。
     */
    timer_2["default"].start(timer_2.SEARCH_REGULAR, function () {
        tweetResolver_1["default"].resolveUnrepliedTweets();
        keywords_1.keywords.forEach(function (keyword) {
            if (limitter_2["default"].canSearch()) {
                limitter_2["default"].countUp(limitter_2.SEARCH);
                client_2["default"].search(keyword)
                    .then(main)["catch"](handleErrors_2["default"]);
            }
        });
    }, timer_2.toMS.sec(20));
    /**
     * ## Automatic tweet every 12 hours
     * 12時間に1回自動ツイートする(生存確認)
     */
    timer_2["default"].start(timer_2.AUTOMATIC_TWEET, function () {
        if (limitter_2["default"].canTweet()) {
            limitter_2["default"].countUp(limitter_2.TWEET);
            client_2["default"].tweet(phrase_2["default"].auto)["catch"](handleErrors_2["default"]);
        }
    }, timer_2.toMS.hour(12));
    function main(tweets) {
        var t = tweets.statuses.filter(function (tweet) { return !tweetResolver_1["default"].isResolved(tweet.id) && !tweet.retweeted; });
        t.forEach(function (tweet) {
            tweetResolver_1["default"].resolveTweet(tweet);
        });
    }
});
