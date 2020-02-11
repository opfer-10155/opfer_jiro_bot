import fs = require('fs');

// const phrase_path = './src/services/jiro_bot/constants/variety.txt'
// const whisper_path = './src/services/jiro_bot/constants/whisper.txt'
const randomInt = (max: number) => Math.floor(Math.random() * max);

// const encode       = { encoding: 'utf-8' }
// const phrases      = fs.readFileSync(phrase_path, encode).split('')
// const auto_message = fs.readFileSync(whisper_path, encode)

const phrases = [
  "奢りません",
  "は？奢りませんが",
  "はぁ？なんであんたなんかに奢らなきゃいけないのよ！バッカじゃないの！？",
  "逆にお前が奢れ",
  "ダブルアップチャンス！ｗ　#オプファーは二郎を奢れ",
  "駄目です",
  "なんだテメエ",
  "奢りません　奢りませんが　奢りません",
  "驕りません",
  "ちんぽ(ﾎﾞﾛﾝ)",
  "一万円くれたら奢ってあげるよ",
  "undefined",
  "奢りたい…奢りたいが…†俺は辞退する†",
  "新元号は…「不奢」です。",
  "奢るわけねーじゃんwwwww",
  "奢りまsE-eee-ee-eee AAAAE-A-E-I-E-A- JO-ooo-ooo-oooo EEEEO-A-AAA-AAA- O----------",
  "奢りません！なんで奢ってもらえなかったか、明日まで考えといてください。そしたら何か見えてくるはずです。",
  "あほしね",
  "たかが二郎、そう思ってないですか？それやったら明日も奢りませんよ",
  "YOU LOSE"
]

const Phrases = {
  atari: '奢ります',
  hazure_random: () => phrases[randomInt(phrases.length)]
}

export default Phrases