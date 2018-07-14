require "twitter"
require "dotenv"

Dotenv.load

random = Random.new

client = Twitter::REST::Client.new do |config|
    config.consumer_key        = ENV["MY_CONSUMER_KEY"]
    config.consumer_secret     = ENV["MY_CONSUMER_SECRET"]
    config.access_token        = ENV["MY_ACCESS_TOKEN"]
    config.access_token_secret = ENV["MY_ACCESS_TOKEN_SECRET"]
  end

client_streaming = Twitter::Streaming::Client.new do |config|
    config.consumer_key = ENV["MY_CONSUMER_KEY"]
    config.consumer_secret = ENV["MY_CONSUMER_SECRET"]
    config.access_token = ENV["MY_ACCESS_TOKEN"]
    config.access_token_secret =  ENV["MY_ACCESS_TOKEN_SECRET"]
  end

  client_streaming.user do |tweet|
   
    if tweet.is_a?(Twitter::Tweet)
      puts(tweet.user.name)
      puts("@#{tweet.user.screen_name}")
      puts(tweet.text)
      puts("-----")
      z = random.rand(1..114514)
    
     if ((/#オプファーは二郎を奢れ/ =~ tweet.text) && (!tweet.index("RT"))

      if z == 810
        client.update("@#{tweet.user.screen_name}\n奢ります", options = {:in_reply_to_status_id => tweet.id})

      else  client.update("@#{tweet.user.screen_name}\n奢りません", options = {:in_reply_to_status_id => tweet.id})

      end

     end
     
    end
end