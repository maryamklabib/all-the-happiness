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
var twitInfo = require('./config.js');
var twitter = new twit(twitInfo);
var latest_twitter_id = "718474746355036161";

function find_tweet() {
	console.log('hi');
	var max_fav = 0;
	var tweet_id_str = '';
	twitter.get('search/tweets', { q: 'happiness', result_type: "popular", lang: 'en', count: 100, max_id: latest_twitter_id }, function(err, data, response) {
	  	for (var i=0; i < data.statuses.length; i++) {
  			if (data.statuses[i].text.slice(0,2) != 'RT') {
  				if (data.statuses[i].favorite_count > max_fav) {
  					//did we tweet this before?
  					max_fav = data.statuses[i].favorite_count;
  					tweet_id_str = data.statuses[i].id_str;
  					console.log(data.statuses[i].text);
  					console.log(data.statuses[i].favorite_count); 
  					console.log(data.statuses[i].id_str);
  					console.log('retweeted? : ' + data.statuses[i].retweeted); 
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

//Every 10 minutes, call search_tweets_and_return_ids
find_tweet();