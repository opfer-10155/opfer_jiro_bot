const keywords = ['クソ', 'うんこ', 'ウンコ', '糞', 'くそ', '大便', 'うんち', 'ウンチ']

export default function judge(tweet: any) {
  for(let i=0; i < keywords.length; i++) {
    if (tweet.text.indexOf(keywords[i]) > -1) return true
  }
  return false
}
