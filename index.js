// START HEROKU SETUP
var express = require("express");
var app = express();
app.get('/', function(req, res){ res.send('The robot is happily running.'); });
app.listen(process.env.PORT || 5000);

/// START TWIT SETUP
var twit = require('twit');
var twitInfo = require('./config.js');
var twitter = new twit(twitInfo);

function can_retweet(tweet_info) {
	return tweet_info.entities.hashtags.length == 0
	&& tweet_info.entities.user_mentions.length == 0
	&& tweet_info.entities.media == undefined
	&& tweet_info.entities.urls.length == 0
	&& tweet_info.entities.symbols.length == 0
	&& tweet_info.retweeted == false;
}

function find_tweet() {
	twitter.get('search/tweets', { 
		q: 'happiness',
		count: 100, 
		result_type: 'recent', 
		lang: 'en',
	}, function(err, data, response) {
		var retweetable = [];
		for (var i = 0; i < data.statuses.length; i++) {
			if (can_retweet(data.statuses[i])) {
				retweetable.push(data.statuses[i]);
			}	
		}
		if (retweetable.length != 0) {
			fc = Math.max.apply(Math,retweetable.map(function(s){return s.favorite_count;}));
			retweet(retweetable.find(function(s){ return s.favorite_count == fc; }).id_str);
		}
	}).catch(function (err) {
    	console.log('error ', err.stack);
  	})
};

function retweet(tweet_id) {
	twitter.post('statuses/retweet/' + tweet_id, 
		function (err, data, response) {
  			console.log(data);
		}).catch(function (err) {
    		console.log('error ', err.stack);
  		})};

//Every 20 minutes, call find_tweet and retweet the most favorited tweet since the last tweet we retweeted.
find_tweet();
setInterval(find_tweet, 1200000);
