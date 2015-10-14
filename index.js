var express = require('express');
var staticContent = require('express-static');
var Twitter = require('twitter');

var config = require('./config');

var app = express();
var twitterParams = {
  screen_name: config.twitter.HANDLE,
  count: 50,
  include_rts: false
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
    if (!error) {
      request.data = tweets.map(function(tweet) { return tweet.text });
      next();
    }
  });

}, function(request, response) {
  response.render('index', { data: request.data });
});


server = app.listen(process.env.PORT || 5000, function(){
  console.log('server is running at %s', server.address().port);
});