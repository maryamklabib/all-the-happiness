// START HEROKU SETUP
var express = require("express");
var app = express();
app.get('/', function(req, res){ res.send('The robot is happily running.'); });
app.listen(process.env.PORT || 5000);
// END HEROKU SETUP

//hash to organize all the tidbits
var config = {
    me: 'yalainspire', // The authorized account with a list to retweet.
    filter: 'happiness', // Accept only tweets matching this regex pattern.
    reject: '(RT|@)', // AND reject any tweets matching this regex pattern.
	};

var twit = require('twit');
var twitInfo = require('./config.js');
var twitter = new twit(twitInfo);
var latest_twitter_id = "";
var my_twitter_id = "716378885311610881";

function we_never_retweeted(tweet_id) {
	console.log('never');
	twitter.get('statuses/retweeters/ids', { id: tweet_id }, function(err, data, response) {
		console.log('in get');
		console.log(data);
		for (var i = 0; i < data["ids"].length; i++) {
			console.log(data.ids[i]);
			console.log(my_twitter_id);
			if (data.ids[i] == my_twitter_id) {
				return false;
			}
		}
		return true;		
	}).catch(function (err) {
    	console.log('caught error', err.stack)
	})
};
function can_retweet(tweet_info) {
	//must match this regex
	var a = tweet_info.text.match(config.filter);
	//must not match this regex
	var b = tweet_info.text.match(config.reject);
	//must not be previously retweeted
	var c = we_never_retweeted(tweet_info.id_str);
	return a && b && c; 		 
}

function find_tweet() {
	console.log('hi');
	var max_fav = 0;
	var tweet_id_str = "";
	twitter.get('search/tweets', { q: 'happiness', result_type: "recent", lang: 'en', count: 50, max_id: latest_twitter_id }, function(err, data, response) {
	  	for (var i=0; i < data.statuses.length; i++) {
	  		if (can_retweet(data.statuses[i])) {  			
  				if (data.statuses[i].favorite_count > max_fav) {  					
	  					max_fav = data.statuses[i].favorite_count; 
	  					tweet_id_str = data.statuses[i].id_str;
  				}
  			}
		}
	}).catch(function (err) {
    	console.log('caught error', err.stack)
  	}).then(function () {
  		latest_twitter_id = tweet_id_str;
		console.log('final');
		console.log("id_str: " + tweet_id_str);
	 	retweet(tweet_id_str);		
	})
};

function retweet(tweet_id) {
	twitter.post('statuses/retweet/' + tweet_id, function (err, data, response) {
  	console.log(data);
	});	
};

//Every 10 minutes, call find_tweet and retweet the most favorited tweet since the last tweet we retweeted.
find_tweet();
setInterval(find_tweet, 600000);
