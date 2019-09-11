import fs = require('fs');

const phrase_path = './variety.txt'
const whisper_path = './whisper.txt'
const randomInt = (max: number) => Math.floor(Math.random() * max);

const encode       = { encoding: 'utf-8' }
const phrases      = fs.readFileSync(phrase_path, encode).split('$')
const auto_message = fs.readFileSync(whisper_path, encode)

const Phrases = {
  atari: '奢ります',
  hazure_random: () => phrases[randomInt(phrases.length)],
  auto: auto_message
}

export default Phrases