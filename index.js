var express = require('express');
var staticContent = require('express-static');
var Twitter = require('twitter');
var config = require('./config');
var app = express();
var twitterParams = {
  screen_name: config.twitter.HANDLE,
  count: 200
};
var server;

app.use(staticContent(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response, next) {
  var client = new Twitter({
    consumer_key: config.twitter.CONSUMER_KEY,
    consumer_secret: config.twitter.CONSUMER_SECRET,
    access_token_key: config.twitter.ACCESS_TOKEN_KEY,
    access_token_secret: config.twitter.ACCESS_TOKEN_SECRET
  });

  client.get('statuses/user_timeline', twitterParams, function(error, tweets){
    var tweetArr = [];

    if (!error) {
      tweets.forEach(function(tweet) {
        if (/\bstar wars\b/i.test(tweet.text)) {
          tweetArr.push(tweet.text);
        }
      });

      if (!tweetArr.length) {
        tweetArr.push('No recent Star Wars tweets :(');
      }

      request.data = tweetArr;
      next();
    }
  });

}, function(request, response) {
  response.render('index', { data: request.data });
});


server = app.listen(process.env.PORT || 5000, function(){
    console.log('server is running at %s', server.address().port);
});