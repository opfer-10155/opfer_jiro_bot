import Twitter = require('twitter');
export default function getTL (client: Twitter, since_id: number) {
  return client.get('statuses/home_timeline', {
    count: 200,
    since_id: since_id,
  })
}
