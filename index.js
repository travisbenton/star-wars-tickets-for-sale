var Twitter = require('twitter');
var request = require('request');
var cheerio = require('cheerio');
var nodemailer = require('nodemailer');

var config = require('./config');
 
var transporter = nodemailer.createTransport({
  service: config.email.SERVICE,
  auth: {
    user: config.email.USER,
    pass: config.email.PASS
  }
});
 
var client = new Twitter({
  consumer_key: config.twitter.CONSUMER_KEY,
  consumer_secret: config.twitter.CONSUMER_SECRET,
  access_token_key: config.twitter.ACCESS_TOKEN_KEY,
  access_token_secret: config.twitter.ACCESS_TOKEN_SECRET
});
 
var params = {
  screen_name: config.twitter.HANDLE
};

function sendMail(subject, text) {
  var mailOptions = {
    from: config.email.USER,
    to: config.email.USER,
    subject: subject,
    text: text
  };

  // send mail with defined transport object 
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    }

    console.log('Message sent: ' + info.response);
  });
}

client.get('statuses/user_timeline', params, function(error, tweets){
  if (!error) {
    tweets.forEach(function(tweet) {
      if (/\bstar wars\b/i.test(tweet.text)) {
        sendMail('Star Wars Tweets!', tweet.text += '. https://drafthouse.com/show/star-wars-the-force-awakens');
      }
    });
  }
});

request('https://drafthouse.com/ajax/.showtimes-show/0000/A000010000A000009999', function (error, response, body) {
  if (!error && response.statusCode === 200) {
    var $ = cheerio.load(body);

    if ($('.Section-heading').text() !== 'Coming Soon') {
      sendMail('TICKETS ON SALE!!', 'https://drafthouse.com/show/star-wars-the-force-awakens');
    }
  }
});