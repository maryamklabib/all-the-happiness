// START HEROKU SETUP
var express = require("express");
var app = express();
app.get('/', function(req, res){ res.send('The robot is happily running.'); });
app.listen(process.env.PORT || 5000);
// END HEROKU SETUP


// Config.keys uses environment variables so sensitive info is not in the repo.
var config = {
    me: 'yalainspire', // The authorized account with a list to retweet.
    regexFilter: '', // Accept only tweets matching this regex pattern.
    regexReject: '(RT|@)', // AND reject any tweets matching this regex pattern.
	};

var twit = require('twit');
// var twitInfo = require('/Users/lababib/config.js');
// var twitter = new twit(twitInfo);
var twitter = new twit({
	//credentials
});

function find_tweet() {
	tweet_str_id = '';
	//get 100
	twitter.get('search/tweets', { q: 'happiness', count: 100 }, function(err, data, response) {
  	//iterate through them and check things
	  	// console.log(data);
	  	for (var i=0; i < data.statuses.length; i++) {
				if (data.statuses[i].retweeted == true && data.statuses[i].favorited == true && data.statuses[i].retweet_count > 100 || data.statuses[i].favorite_count > 100) {
					console.log(data.statuses[i].retweeted);
				  	console.log(data.statuses[i].favorited);
				  	console.log(data.statuses[i].text);
					tweet_str_id = data.statuses[i].id_str;
				}
			}
	})
	retweet(tweet_str_id);
};

function retweet(tweet_id) {
	twitter.post('statuses/retweet/' + tweet_id, function (err, data, response) {
  	console.log(data);
});	
};

//Every 10 minutes, call search_tweets_and_return_ids
find_tweet();