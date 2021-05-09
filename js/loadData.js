$('document').ready(() => {

    function loadTweets() {
        const trumpTweets = 'data/trump_tweets.csv';
        let trumpArray    = [];
    
        d3.csv(trumpTweets, (tweets) => {
            trumpArray.push(tweets);
        });
    
        console.info('Trump Tweets \n', trumpArray);
    }

    loadTweets();

});