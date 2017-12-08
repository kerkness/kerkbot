
console.log("Starting up Kerkbot");
console.log("");
console.log("");



// Get the arguments
var search = process.argv.slice(2);
var resultType = process.argv.slice(3);  // recent, mixed, popular

if( ! resultType ){
    resultType = 'mixed'
}

if( ! search ){
    search = '@artmoi'
}


// Require the dependencies
var twit = require('twit');

// Require our config (remember to rename config-sample.js)
var config = require('./config.js');
var Inspector = require('./shared/inspector.js');

var Twitter = new twit(config);


var retweet = function() {

    var params = {
        q: search,  // REQUIRED
        result_type: resultType,
        lang: 'en',
        count: 100,
        include_entities:true
    }
    // for more parameters, see: https://dev.twitter.com/rest/reference/get/search/tweets

    Twitter.get('search/tweets', params, function(err, data) {
        // if there no errors
        if (!err) {

            if( data.statuses.length < 1 )
            {
                console.log("No tweeks matching " + params.q);
                return;
            }

            // Loop over the found tweets
            data.statuses.map(function($status, $index){


                console.log("TweetID: " + $status.id_str);
                console.log($status.text);
                console.log($status.user.screen_name);
                console.log($status.user.followers_count);
                if( Inspector.isInfluencer($status.user) )
                {
                    console.log("INFLUENCER");
                }

                console.log("");
                console.log("");
                console.log("");

            });

            console.log("");
            console.log("FULL STATUS EXAMPLE");
            console.log("");

            console.log(data.statuses[0]);

            // Tell TWITTER to retweet
            // Twitter.post('statuses/retweet/:id', {
            //     id: retweetId
            // }, function(err, response) {
            //     if (response) {
            //         console.log('Retweeted!!!');
            //     }
            //     // if there was an error while tweeting
            //     if (err) {
            //         console.log('Something went wrong while RETWEETING... Duplication maybe...');
            //     }
            // });

        }
        // if unable to Search a tweet
        else {
            console.log('Something went wrong while SEARCHING...');
        }
    });
}


retweet();