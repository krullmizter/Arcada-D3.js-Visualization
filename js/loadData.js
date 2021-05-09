$('document').ready(() => {

    function loadTweets() {
        const trumpTweets = 'data/trump_tweets.csv';

        d3.csv(trumpTweets)
          .then((tweets) => {
                console.info('Trump Tweets \n', tweets);
          })
          .catch((err) => {
                console.warn('Error loading tweets', err);
          });
    }

    loadTweets();

});