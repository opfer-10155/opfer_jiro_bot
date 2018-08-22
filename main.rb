require "twitter"
require "dotenv"

Dotenv.load

random = Random.new

client = Twitter::REST::Client.new do |config|
  config.consumer_key        = ENV['MY_CONSUMER_KEY']        #Consumer Key (API Key)
  config.consumer_secret     = ENV['MY_CONSUMER_SECRET']     #Consumer Secret (API Secret)
  config.access_token        = ENV['MY_ACCESS_TOKEN']        #Access Token
  config.access_token_secret = ENV['MY_ACCESS_TOKEN_SECRET'] #Access Token Secret
  end
  
  max_id = client.home_timeline.first.id
  2.times do
    client.home_timeline(max_id: max_id,count: 200).each do |tweet|

      puts(tweet.user.name)
      puts("@#{tweet.user.screen_name}")
      puts(tweet.text)
      puts("-----")
      max_id = tweet.id unless tweet.retweeted?

      if /#オプファーは二郎を奢れ/ =~ tweet.text
        ogoru = random.rand(1..200)
    
        if ogoru == 19
          client.update("@#{tweet.user.screen_name}\n奢ります", options = {:in_reply_to_status_id => tweet.id})

        else  
          client.update("@#{tweet.user.screen_name}\n奢りません", options = {:in_reply_to_status_id => tweet.id})

        end
      end
    end
    sleep 60
  end