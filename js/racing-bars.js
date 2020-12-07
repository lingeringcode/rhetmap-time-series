export function paintBarViz(data) {

  const halo = function(text, strokeWidth) {
    text.select(function() {
      return this.parentNode.insertBefore(this.cloneNode(true), this); })
        .style('fill', '#ffffff')
        .style( 'stroke','#ffffff')
        .style('stroke-width', strokeWidth)
        .style('stroke-linejoin', 'round')
        .style('opacity', 1);
  }
  
  let svg = d3.select("#bar-chart").append("svg")
    .attr("width", 960)
    .attr("height", 600)

  let tickDuration = 2500

  let top_n = 12
  let height = 600
  let width = 960

  const margin = {
    top: 80,
    right: 0,
    bottom: 5,
    left: 0
  };

  let barPadding = (height-(margin.bottom+margin.top))/(top_n*5)

  let caption = svg.append('text')
    .attr('class', 'caption')
    .attr('x', width)
    .attr('y', height-5)
    .style('text-anchor', 'end')
    .html('Source: <a href="http://rhetmap.org/market-comparison/">rhetmap.org</a>')

  let week = 1
    data.forEach(d => {
      d.posting_total = +d.posting_total,
      d.last_posting_total = +d.last_posting_total,
      d.posting_total = isNaN(d.posting_total) ? 0 : d.posting_total,
      d.week = +d.week,
      d.colour = d3.hsl(Math.random()*360,0.75,0.75)
    });
  
  let weekSlice = data.filter(d => d.week == week && !isNaN(d.posting_total))
    .sort((a,b) => b.posting_total - a.posting_total)
    .slice(0, top_n);

  weekSlice.forEach(function(d,i) { 
    d.rank = i;
  });

  let x = d3.scaleLinear()
    .domain([0, d3.max(weekSlice, function(d) {
        if (d.posting_total > 0) { return d.posting_total }
        else if (d.posting_total == 0) { return 0 }
      })]
    )
    .range([margin.left, width-margin.right-65]);

  let y = d3.scaleLinear()
    .domain([top_n, 0])
    .range([height-margin.bottom, margin.top]);

  let xAxis = d3.axisTop()
    .scale(x)
    .ticks(width > 500 ? 5:2)
    .tickSize(-(height-margin.top-margin.bottom))
    .tickFormat(d => d3.format(',')(d));

  svg.append('g')
    .attr('class', 'axis xAxis')
    .attr('transform', `translate(0, ${margin.top})`)
    .call(xAxis)
    .selectAll('.tick line')
    .classed('origin', d => d == 0);

  //Initial bar declaration
  svg.selectAll('rect.bar')
    .data(weekSlice, d => d.job_year)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', x(0)+1) //Initial x decl
    .attr('width', function(d){
      let increment = x(d.posting_total)-x(0)-1;
      if (increment > 0) { return increment }
      else if (increment <= 0) { return 0 }
    })
    .attr('y', d => y(d.rank)+5)
    .attr('height', y(1)-y(0)-barPadding)
    .style('fill', d => d.colour);
  
  svg.selectAll('text.label')
    .data(weekSlice, d => d.job_year)
    .enter()
    .append('text')
    .attr('class', 'label')
    .attr('x', d => x(d.posting_total)-8) //changes x position of job_year label
    .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
    .style('text-anchor', 'end')
    .html(d => d.job_year);
     
  svg.selectAll('text.valueLabel')
    .data(weekSlice, d => d.job_year)
    .enter()
    .append('text')
    .attr('class', 'valueLabel')
    .attr('x', d => x(d.posting_total)+5)
    .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
    .text(d => d.posting_total);

  let weekText = svg.append('text')
    .attr('class', 'weekText')
    .attr('x', width-margin.right)
    .attr('y', height-25)
    .style('text-anchor', 'end')
    .html("Week "+week)
    .call(halo, 10);
    
  let ticker = d3.interval(e => {

    weekSlice = data.filter(d => d.week == week && !isNaN(d.posting_total))
      .sort((a,b) => b.posting_total - a.posting_total)
      .slice(0,top_n);

    weekSlice.forEach(function(d,i) {
      d.rank = i;
    });

    x.domain([0, d3.max(weekSlice, d => d.posting_total)]); 
    
    svg.select('.xAxis')
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .call(xAxis);
  
      let bars = svg.selectAll('.bar').data(weekSlice, d => d.job_year);
  
      bars
        .enter()
        .append('rect')
        .attr('class', d => `bar ${d.job_year.replace(/\s/g,'_')}`)
        .attr('x', x(0)+1)
        .attr( 'width', function(d) {
          if (d.posting_total != 0) {
            return x(d.posting_total)-x(0)-1
          }
          else if (d.posting_total == 0) {
            return x(d.last_posting_total)-x(0)
          }
        })
        .attr('y', d => y(top_n+1)+5)
        .attr('height', y(1)-y(0)-barPadding)
        .style('fill', d => d.colour)
        .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('y', d => y(d.rank)+5);
        
      bars
        .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('width', function(d) { 
            if (d.posting_total != 0) {
              return x(d.posting_total)-x(0)-1
            }
            else if (d.posting_total == 0) {
              return x(d.last_posting_total)-x(0)
            }
          })
          .attr('y', d => y(d.rank)+5);
          
      bars
        .exit()
        .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('width', d => x(d.posting_total)-x(0)-1)
          .attr('y', d => y(top_n+1)+5)
          .remove();

      let labels = svg.selectAll('.label').data(weekSlice, d => d.job_year);
    
      labels
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', function(d) {
          if (d.posting_total != 0){
            return x(d.posting_total)-8
          }
          if (d.posting_total == 0){
            return x(d.posting_total)
          }
        })
        .attr('y', d => y(top_n+1)+5+((y(1)-y(0))/2))
        .style('text-anchor', 'end') 
        .html(d => d.job_year)    
        .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
            
  
      labels
        .transition()
        .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('x', function(d) {
            if (d.posting_total != 0){
              return x(d.posting_total)-8
            }
            if (d.posting_total == 0){
              return x(d.posting_total)
            }
          })
          .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
    
      labels
        .exit()
        .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('x', function(d) {
            if (d.posting_total != 0){
              return x(d.posting_total)-8
            }
            if (d.posting_total == 0){
              return x(d.posting_total)
            }
          })
          .attr('y', d => y(top_n+1)+5)
          .remove();
            
      let valueLabels = svg.selectAll('.valueLabel').data(weekSlice, d => d.job_year);

      valueLabels
        .enter()
        .append('text')
        .attr('class', 'valueLabel')
        .attr('x', function(d) {
          if (d.posting_total != 0){
            return x(d.posting_total)-5
          }
          if (d.posting_total == 0){
            return x(d.posting_total)
          }
        })
        .attr('y', d => y(top_n+1)+5)
        .text(d => Number(d.last_posting_total))
        .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
          
      valueLabels
        .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('x', d => x(d.posting_total)+5)
          .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
          .tween("text", function(d) {
            if (!isNaN(d.last_posting_total) && (d.posting_total != 0)
              && (d.last_posting_total != 0)) {
                let i = d3.interpolateRound(d.last_posting_total, d.posting_total);
                return function(t) {
                  this.textContent = d3.format(',')(i(t));
                };
            }
            else if (!isNaN(d.last_posting_total) && (d.posting_total == 0)
              && (d.last_posting_total == 0)) {
              let i = d3.interpolateRound((d.last_posting_total+d.last_posting_total), d.posting_total);
              // return function(t) {
              //   this.textContent = d3.format(',')(i(t));
              // };
              return t
            }
          });
    
    valueLabels
      .exit()
      .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .attr('x', function(d) {
          if (d.posting_total != 0){
            return x(d.posting_total)-8
          }
          if (d.posting_total == 0){
            return x(d.posting_total)
          }
        })
        .attr('y', d => y(top_n+1)+5)
        .remove();
  
    weekText.html("Week "+week);
    
    if(week == 17) ticker.stop();
    week = week+1;
  }, tickDuration);

}