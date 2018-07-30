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

client_streaming = Twitter::Streaming::Client.new do |config|    
  config.consumer_key        = ENV['MY_CONSUMER_KEY']        #Consumer Key (API Key)
  config.consumer_secret     = ENV['MY_CONSUMER_SECRET']     #Consumer Secret (API Secret)
  config.access_token        = ENV['MY_ACCESS_TOKEN']        #Access Token
  config.access_token_secret = ENV['MY_ACCESS_TOKEN_SECRET'] #Access Token Secret
  end

  client_streaming.user do |tweet|
   
    if tweet.is_a?(Twitter::Tweet)
      puts(tweet.user.name)
      puts("@#{tweet.user.screen_name}")
      puts(tweet.text)
      puts("-----")
      
    
     if /#オプファーは二郎を奢れ/ =~ tweet.text
      z = random.rand(1..260)
    
      if ｚ == 19

        client.update("@#{tweet.user.screen_name}\n奢ります", options = {:in_reply_to_status_id => tweet.id})

      else  
        client.update("@#{tweet.user.screen_name}\n奢りません", options = {:in_reply_to_status_id => tweet.id})

      end

     end
     
    end
end