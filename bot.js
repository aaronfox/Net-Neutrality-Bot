var Twit = require('twit');
var config = require('./config.js');

var Twitter = new Twit(config);
//=========
var express = require('express');
var app     = express();

app.set('port', (process.env.PORT || 5000));

//For avoiding Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});

function tweetStatus(msg) {
    var tweet = {
        status: msg
    }
    
    Twitter.post('statuses/update', tweet, tweeted);
    
    function tweeted(err, data, res) {
        if (err) {
            console.log("Oh noes! Here's the error, champ: ");
            console.log(err);
        }
        else {
            console.log("Success! Tweeted that awful message of yours.");
        };
    }
}

// THE FOLLOWING  GOES HERE
function follow(screen_name) {
      Twitter.post('friendships/create', {screen_name}, function(err, response){
        if(err){
          console.log(err);
        } else {
          console.log(screen_name, ': **FOLLOWED**');
        }
      });
};

//follow('BennieGThompson');
//tweetStatus("I really love puppies, but net neutrality is more important right now!");

//=============
//T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
//  console.log(data)
//});

var retweet = function() {
  var params = {
    q: '#Puppy, #Dog',
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
//retweet();
// retweet in every 50 minutes
//setInterval(retweet, 30000);

var fs = require('fs-extra');

// Follows people based on CSV file
function csvHandler(){
  fs.readFile('115th-Congress-House-seeds.csv', function (err,data) {

  if (err) {
    return console.log(err);
  }

  //Convert and store csv information into a buffer. 
  bufferString = data.toString(); 

  //Store information for each individual person in an array index. Split it by every newline in the csv file. 
  arr = bufferString.split('\n'); 
//  console.log(arr); 
      for (var i = 3; i < arr.length; i++)
          {
              console.log('tryna follow ' + arr[i].substr(0, arr[i].length - 1));
              follow(arr[i].substr(0, arr[i].length - 1));
          }
});
};

//csvHandler();

// Key = Twitter ID, Value = boolean of replied to last tweet
var map = new Map();
//var idArray;
//Twitter.get('friends/ids', {screen_name: 'NedNuTrality'}, function (err, data, res) {
//    idArray = data.ids;
//    console.log(idArray);
//});
//console.log('idArray == ' + idArray[0]);

var tweetIdsToReply;
// Now, get latest tweets from people we follow

var notifyPolitician = function() {
    Twitter.get('statuses/home_timeline', {count: 5, exclude_replies: true}, function(err, data, res) {
        for (var i = 0; i < data.length; i++)
            {
                if(data[i].user.screen_name != 'NedNuTrality')
                    {
    //                    console.log(data[i].id + ' ' + data[i].text);
                        // REPLY TO POLITICIAN HERE
                        var hellos = ['Hi', 'Hello', 'Good day'];
                        var greetings = ['Could I talk to you about net neutrality today? It\'s really important to the future of the US.', 'Net Neutrality is one of the most important principles keeping the Internet alive in the US today.', 'I would like to talk about net neutrality and how it\'s vitally important to the US.'];
                        Twitter.post('statuses/update', {status: '@' + data[i].user.screen_name + ' ' + hellos[Math.floor(Math.random()*hellos.length)] + ', ' + greetings[Math.floor(Math.random()*greetings.length)] + ' Please support these regulations to ensure our Internet is safe and open to all. Please see @fightfortheftr for more info.', in_reply_to_status_id: data[i].id}, function(err, res) {
                            if (err)
                                {
                                    console.log("Error in replying to politician:");
                                    console.log(err);
                                }
                            else{
                                    console.log('Replied to: politician');
                            }
                        } );
                    }

            }
    });
}
notifyPolitician();

setInterval(notifyPolitician, 1000*60*30);
