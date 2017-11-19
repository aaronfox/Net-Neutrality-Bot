var Twit = require('twit');
var config = require('./config.js');

var Twitter = new Twit(config);
//=========
var express = require('express');
var app     = express();

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});




//=============
//T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
//  console.log(data)
//});

var retweet = function() {
  var params = {
    q: '#Puppy, #Dog, #Pupper, #Doggo, #Rarepupper',
    result_type: 'recent',
    lang: 'en'    
  };
    Twitter.get('search/tweets', params, function(err, data) {
      // if there no errors
        if (!err) {
          // grab ID of tweet to retweet
            var retweetId = data.statuses[0].id_str;
            // Tell TWITTER to retweet
            Twitter.post('statuses/retweet/:id', {
                id: retweetId
            }, function(err, response) {
                // if there was an error while tweeting
                if (err) {
                    console.log('Already retweeted that!');
                }
                else if (response) {
                    console.log('Retweeted!!!');
                }
                
            });
        }
        // if unable to Search a tweet
        else {
          console.log('Something went wrong while SEARCHING...');
            console.log('err == ' + err);
        }
    });
};

// grab & retweet as soon as program is running...
retweet();
// retweet in every 50 minutes
setInterval(retweet, 30000);

    
  
  
