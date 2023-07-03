function String (data) {
    for (let i=0; i < data.length; i++) {
        switch (data[i][0].substring(5,7)) {
          case '01' :
          case '02' :
          case '03' :
            data[i].push(data[i][0].substring(0,4) + ' Q1');
            break;
          case '04' :
          case '05' :
          case '06' :
            data[i].push(data[i][0].substring(0,4) + ' Q2');
            break;
          case '07' :
          case '08' :
          case '09' :
            data[i].push(data[i][0].substring(0,4) + ' Q3');
            break;
          case '10' :
          case '11' :
          case '12' :
            data[i].push(data[i][0].substring(0,4) + ' Q4');
            break;
        };
      };
  };
  
  const render = data => {
      const width = 1260;
      const height = 600;
      
      const xValue = d => d[0];
      const yValue = d => d[1];
      const textValue = d => d[2];
      const margin = { top: 40, right: 60, bottom: 40, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const barWidth = innerWidth / data.length;
      
      const Text = 'United States GDP';
      const XAxisPos = innerWidth / 2;
      const YAxisPos = 10;
    
      const yAxisLabelText = 'Gross Domestic Product';
      const yAxisLabelXPos = -100;
      const yAxisLabelYPos = 30;
      
      const svg = d3.select('body')
        .append('svg')
        .style('height', height)
        .style('width', width)
      
      const barchart = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
      
      barchart.append('text')
         .attr('id', 'title')
         .attr('x', XAxisPos)
         .attr('y', YAxisPos)
         .text(Text)
      
      const xScale = d3.scaleTime()
        .domain([new Date(data[0][0]), new Date(data[data.length - 1][0])])
        .range([0, innerWidth]);
      
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, yValue)])
        .range([innerHeight, 0]);
      
      const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")).tickSizeOuter(0);
      const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);
        
      barchart.append('g')
         .attr('id', 'x-axis')
         .attr('transform', `translate(0, ${innerHeight})`)
         .call(xAxis);
      
      const yAxisG = barchart.append('g')
         .attr('id', 'y-axis')
         .call(yAxis);
    
      yAxisG.append('text')
        .attr('id', 'yAxis-label')
        .attr('x', yAxisLabelXPos)
        .attr('y', yAxisLabelYPos)
        .attr('transform', 'rotate(-90)')
        .text(yAxisLabelText);
      
      let tooltip = d3.select('body').append('div')
        .attr('id', 'tooltip')
        .style('opacity', 0);
      
      barchart.selectAll('rect').data(data)
         .enter().append('rect')
         .attr('x', (d, i) => i * barWidth + 1.8)
         .attr('y', d => yScale(yValue(d)))
         .attr('width', barWidth)
         .attr('height', d => innerHeight - yScale(yValue(d)))
         .attr('class', 'bar')
         .attr('data-date', d => xValue(d))
         .attr('data-gdp', d => yValue(d))
         .on('mouseover', (d, i) => {
            tooltip.transition().duration(200).style('opacity', 0.9)
            tooltip.html(`${textValue(d)} </br>$${yValue(d)} Billion`)
              .style('left', d3.event.pageX + "px")
              .style('top', d3.event.pageY - 50 + "px")
              .attr('data-date', xValue(d));
         })
         .on('mouseout', d => {
            tooltip.transition().duration(500).style('opacity', 0);
         });
         
  };
  document.addEventListener('DOMContentLoaded', function() {
    const request = new XMLHttpRequest();
    request.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
    request.send();
    request.onload = function () {
      const json = JSON.parse(request.responseText);
      let data = json.data;
      String(data);
      render(data);
    };  
  });