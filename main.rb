require "twitter"
require "dotenv"

Dotenv.load

random = Random.new

client = Twitter::REST::Client.new do |config|
    config.consumer_key        = 	"aRrPoEjx8SfmDoWm8evJtZ48d"
    config.consumer_secret     = 	"lYh9jvxzoFTGxi5rbBHOCbd4guoNfcYUYQMT3T21huhqqSimNs"
    config.access_token        = 	"1014932745980502016-vZ24a4h2I7DZJeakjL35z1WHc8sNQq"
    config.access_token_secret =  "zV2T5YY1E20Bf2zrKlTmfARBeXiRcPhSKCzmfbZ0pw4M0"
end

    max_id = client.home_timeline.first.id
    1.times do
      client.home_timeline(max_id: max_id,count: 50).each do |tweet|

        puts(tweet.user.name)
        puts("@#{tweet.user.screen_name}")
        puts(tweet.text)
        puts("-----")
        max_id = tweet.id unless tweet.retweeted?

        if /#オプファーは二郎を奢れ/ =~ tweet.text
          ogoru = random.rand(1..260)
      
          if ogoru == 19
            client.update("@#{tweet.user.screen_name}\n奢ります", options = {:in_reply_to_status_id => tweet.id})
  
          else  

            File.open("variety.text", "r") do |bot|
              @bots = bot.read.split("\n")
            end
            hazure = @bots.sample

            client.update("@#{tweet.user.screen_name}\n#{hazure}", options = {:in_reply_to_status_id => tweet.id})
  
          end
        end
      end
      sleep 60
    end