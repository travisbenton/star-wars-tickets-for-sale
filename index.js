var express = require('express');
var staticContent = require('express-static');
var Twitter = require('twitter');
var request = require('request');
var cheerio = require('cheerio');

var config = require('./config');

var TICKET_URL = 'https://drafthouse.com/ajax/.showtimes-show/0000/A000010000A000009999';
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

app.get('/', function(req, resp, next) {
  var client = new Twitter({
    consumer_key: config.twitter.CONSUMER_KEY,
    consumer_secret: config.twitter.CONSUMER_SECRET,
    access_token_key: config.twitter.ACCESS_TOKEN_KEY,
    access_token_secret: config.twitter.ACCESS_TOKEN_SECRET
  });

  client.get('statuses/user_timeline', twitterParams, function(error, tweets){
    if (!error) {
      req.tweets = tweets.map(function(tweet) { return tweet.text });
      next();
    }
  });

}, 
function(req, resp, next) {
  request(TICKET_URL, function (error, resp, body) {
    if (!error && resp.statusCode === 200) {
      var $ = cheerio.load(body);

      if ($('.Section-heading').text() !== 'Coming Soon') {
        req.forSale = 'YES!';
      } else {
        req.forSale = 'No';
      }

      next();
    }
  });
},
function(req, resp) {
  resp.render('index', { 
    tweets  : req.tweets,
    forSale : req.forSale
  });
});


server = app.listen(process.env.PORT || 5000, function(){
  console.log('server is running at %s', server.address().port);
});