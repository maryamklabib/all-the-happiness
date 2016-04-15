# yala-inspire
####A twitter bot to make people happy. Follow [@yalainspire](https://twitter.com/yalainspire) today!

## Setup Your Own
1. [Install node.js & npm](http://nodejs.org/download/).
2. Clone this repo.
3. Run `npm install` to download dependencies.
4. Open `index.js` and replace the values in the `config` object with your own.
5. I stored my credentials in a `config.js` that looks like 
 ```module.exports = {
        consumer_key: "",
        consumer_secret: "",
        access_token: "",
        access_token_secret: ""
}``` and added it to my `.gitignore` for security.
6. [Create a twitter application](https://apps.twitter.com/app/new), grant it the necessary access, and generate your tokens/keys.
7. Deploy the bot to heroku (you can [use these instructions](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction) as a guide).
8. Keep it awake. Heroku puts apps to sleep if they're not being pinged. I used [Uptime Robot](https://uptimerobot.com), they have a free tier and it can ping your server every 5 minutes eternally.

##Credits
Huge shoutout to [bryanbraun](https://github.com/bryanbraun/twitter-listbot) for his tutorial and source code.
Huge shoutout to programmers that contribute to Node.js.

##To Do
- [x] every ten minutes retweet a tweet
- [x] check that we have never retweeted before
- [x] validate tweet against rejex expressions
- [x] update bio to say that its a bot
- [x] optimize for high favorites in search query
