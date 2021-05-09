$('document').ready(() => {
      let targets = [],
          insults = [];

      loadTweets();

      function loadTweets() {
          const trumpTweets = 'data/trump_tweets.csv';

          d3.csv(trumpTweets)
            .then((tweets) => {
                  console.info('Trump Tweets 🇺🇸 \n', tweets);
                  
                  for (let i = 0; i < tweets.length; i++) {
                        targets.push(tweets[i].target);
                        insults.push(tweets[i].insult);
                  }

                  drawGraph(tweets);
            })
            .catch((err) => {
                  console.warn('Error loading tweets', err);
            });      
      }

      function drawGraph(tweets) {
            const width = 500, height = 500, sizes = [5, 75];
            
            const colors = [
                  '#0275d8', 
                  '#5cb85c',
                  '#5bc0de',
                  '#f0ad4e',
                  '#d9534f',
                  '#292b2c'
            ];

            const svg = d3.select('#graph')
              .append('svg')
                .attr('width', width)
                .attr('height', height)

            const size = d3.scaleOrdinal()
              .domain(targets)
              .range(sizes)

            const color = d3.scaleOrdinal()
              .domain(insults)
              .range(colors)
            
            svg.selectAll('circle')
               .data(tweets)
               .enter()
                 .append('circle')
                 .classed('circle', true)
                 .attr('cx', width  / 2)
                 .attr('cy', height / 2)
                 .attr('r',    (data) => { return size(data.target) })
                 .attr('fill', (data) => { return color(data.insult) })
                 .attr('stroke', 'black')
                 .attr('stroke-width', 2);
      }

});

      