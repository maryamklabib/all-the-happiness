// START HEROKU SETUP
var express = require("express");
var app = express();
app.get('/', function(req, res){ res.send('The robot is happily running.'); });
app.listen(process.env.PORT || 5000);

/// START TWIT SETUP
var twit = require('twit');
var twitInfo = require('./config.js');
var twitter = new twit(twitInfo);

var config = {
    filter: 'happiness',
    reject: '(RT|@)',
    words: 'happiness',
    result_type: 'recent',
    lang: 'en',
    count: 100,
	};

function can_retweet(tweet_info) {
	return tweet_info.text.match(config.filter)
	&& !tweet_info.text.match(config.reject)
	&& !tweet_info.retweeted;
}

function find_tweet() {
	var tweet_id_str = "";
	twitter.get('search/tweets', { 
		q: config.words, 
		result_type: config.result_type, 
		lang: config.lang, 
		count: config.count
	}, function(err, data, response) {
		fc = Math.max.apply(Math,data.statuses.map(function(s){return s.favorite_count;}));
		tweet_id_str = data.statuses.find(function(s){ return s.favorite_count == fc; }).id_str;
	}).catch(function (err) {
    	console.log('error ', err.stack);
  	}).then(function () {
  		latest_twitter_id = tweet_id_str;
	 	retweet(tweet_id_str);		
	})
};

function retweet(tweet_id) {
	twitter.post('statuses/retweet/' + tweet_id, 
		function (err, data, response) {
  			console.log(data);
		}.catch(function (err) {
    		console.log('error ', err.stack);
  		}));	
	};

//Every 20 minutes, call find_tweet and retweet the most favorited tweet since the last tweet we retweeted.
find_tweet();
setInterval(find_tweet, 1200000);
