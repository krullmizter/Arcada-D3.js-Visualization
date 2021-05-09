$('document').ready(() => {
      let targets = [],
          insults = [];

      loadTweets();

      function loadTweets() {
          const trumpTweets = 'data/trump_tweets.csv';

          d3.csv(trumpTweets)
            .then((tweets) => {
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
            const width = 1000, height = 1000, sizes = [2, 4, 6, 8, 10, 12, 14];
            
            const colors = [
                  '#0d6efd',
                  '#5cb85c',
                  '#5bc0de',
                  '#f0ad4e',
                  '#d9534f',
                  '#6610f2',
                  '#6f42c1',
                  '#d63384',
                  '#dc3545',
                  '#fd7e14',
                  '#ffc107',
                  '#198754',
                  '#20c997',
                  '#0dcaf0',
                  '#adb5bd',
                  '#292b2c'
           ];

            const svg = d3.select('#graph')
              .append('svg')
              .attr('viewBox', `0 0 ${width} ${height}`)

            const size = d3.scaleOrdinal()
              .domain(targets)
              .range(sizes)

            const color = d3.scaleOrdinal()
              .domain(insults)
              .range(colors)
            
            const circles = svg.selectAll('circle')
               .data(tweets)
               .enter()
                 .append('circle')
                 .classed('circle', true)
                 .attr('cx', width  / 2)
                 .attr('cy', height / 2)
                 .attr('r',    (d) => { return size(d.target) })
                 .attr('fill', (d) => { return color(d.insult) })
                 .attr('stroke', 'black')
                 .attr('stroke-width', .5);

            const simulations = d3.forceSimulation()
              .force('center',  d3.forceCenter().x(width / 2).y(height / 2))
              .force('charge',  d3.forceManyBody().strength(.1))
              .force('collide', d3.forceCollide().strength(.3).radius((d) => { return (size(d.target)+3) }).iterations(1))

            simulations
              .nodes(tweets)
              .on('tick', () => {
                circles
                  .attr('cx', (d) => { return d.x; })
                  .attr('cy', (d) => { return d.y; })
              });
      }

});

      