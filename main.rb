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

    since_id = client.home_timeline.first.id
    #max_id = client.home_timeline.first.id
    525600.times do
      define_since_id = true
      client.home_timeline(since_id: since_id, count: 1000).each do |tweet|
        if define_since_id
          since_id = tweet.id
          define_since_id = false
        end
        #max_id = tweet.id unless tweet.retweeted?
        if !tweet.retweeted?
          if /#オプファーは二郎を奢れ/ =~ tweet.text
            ogoru = random.rand(1..100)
            puts(ogoru)
            puts(tweet.user.name)
            puts("@#{tweet.user.screen_name}")
            puts(tweet.text)
            puts("-----")
            if ogoru == 19
              client.update("@#{tweet.user.screen_name}\n奢ります", options = {:in_reply_to_status_id => tweet.id})
          
            else  

              File.open("variety.txt", "r") do |bot|
                @bots = bot.read.split("\n")
                hazure = @bots.sample
                client.update("@#{tweet.user.screen_name}\n#{hazure}", options = {:in_reply_to_status_id => tweet.id})
                puts(hazure)
              end
            end
          end
        end
      end
      sleep 64
    end
