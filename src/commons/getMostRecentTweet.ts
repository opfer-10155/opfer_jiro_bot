const main = tweets => {
  if (tweets.length == 0) return null
  tweets.sort((a, b) => a.created_at > b.created_at)
  return tweets[0]
}

export default main
