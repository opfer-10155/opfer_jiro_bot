import client from './client'

const main = () => {
  client.getTL(20).then(
    (tweets) => {
        tweets.sort((a, b) => a.created_at > b.created_at)
        return tweets[0]
    }
  )
}

export default 