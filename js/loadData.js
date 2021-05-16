$('document').ready(() => {
  let dates   = [],
      targets = [],
      insults = [],
      tweets  = [];
      
    loadTweets();
    
    function loadTweets() {
      const trumpTweets = 'data/trump_tweets.csv';
      
      d3.csv(trumpTweets)
        .then((data) => {
          for (let i = 0; i < data.length; i++) {
            dates.push(data[i].date);
            targets.push(data[i].target);
            insults.push(data[i].insult);
            tweets.push(data[i].tweet);
          }
          
          drawGraph(data);
        })

        .catch((err) => {
          console.warn('Error loading tweets', err);
        });      
    }

    function drawGraph(data) {
      const width = 1000, height = 1000, sizes = [2, 4, 6, 8, 10, 12];
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

      const color = d3.scaleOrdinal()
        .domain(targets)
        .range(colors)

      const size = d3.scaleOrdinal()
        .domain(insults)
        .range(sizes)
    
      const tooltip = d3.select('body')
        .append('div')
          .attr('class', 'tooltip')
          .attr('opacity', 0);

      const mouseover = (event, tweet) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);

          tooltip.html(
            '<strong>' + tweet.insult + '</strong> <br/>'
            + tweet.date + ' ' + tweet.target + '<br/><br/>'
            + tweet.tweet
          )

          .style('left', (event.pageX + 8) + 'px')
          .style('top', (event.pageY - 94) + 'px');
      }

      const mouseleave = () => {
        tooltip.transition()
          .duration(400)
          .style('opacity', 0);
      }

      const circles = svg.selectAll('circle')
        .data(data).enter()
          .append('circle')
            .classed('circle', true)
              .attr('cx', width)
              .attr('cy', height)
              .attr('r',    d => size(d.target) )
              .attr('fill', d => color(d.insult) )
              .attr('stroke', 'black')
              .attr('stroke-width', .5)
                .on('mouseover', mouseover)
                .on('mouseout', mouseleave)
              .call(d3.drag()
                  .on('drag', dragging));
        
      function dragging(event, d) {
        d3.select(this)
          .attr('cx', d.x = event.x)
          .attr('cy', d.y = event.y);
      }

      const simulations = d3.forceSimulation()
        .force('center',  d3.forceCenter().x(width / 2).y(height / 2))
        .force('charge',  d3.forceManyBody().strength(.2))
        .force('collide', d3.forceCollide().strength(.3).radius( d => (size(d.target)+3) ).iterations(1))

        simulations
        .nodes(data)
          .on('tick', () => {
              circles
                .attr('cx', d => d.x )
                .attr('cy', d => d.y )
          });
    }
});