require "twitter"
require "dotenv"

Dotenv.load

random = Random.new

client = Twitter::REST::Client.new do |config|
    config.consumer_key        = 	ENV["LSVzWsXghGep2a2GVCpaw83Ej"]
    config.consumer_secret     = 	ENV["zUQRTAv7kovDEi3Jks2GJ4UO0sIkVhxs8bmFHqdCngLFCsg1bM"]
    config.access_token        = 	ENV["3094838904-OofN3rhmGSFBfShZXUbDIYUb4Mo38yDZwk4HbmT"]
    config.access_token_secret = ENV["FbhgZzLuxXYq4fJo9kkQgVz1QTYQ43tZxvbaDkdRSB8RJ"]
  end

client_streaming = Twitter::Streaming::Client.new do |config|
    config.consumer_key = ENV["LSVzWsXghGep2a2GVCpaw83Ej"]
    config.consumer_secret = ENV["zUQRTAv7kovDEi3Jks2GJ4UO0sIkVhxs8bmFHqdCngLFCsg1bM"]
    config.access_token = ENV["3094838904-OofN3rhmGSFBfShZXUbDIYUb4Mo38yDZwk4HbmT"]
    config.access_token_secret =  ENV["FbhgZzLuxXYq4fJo9kkQgVz1QTYQ43tZxvbaDkdRSB8RJ"]
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