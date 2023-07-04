const w = 1689
const h = 876
const padding = 118
const months = ["Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sep","Oct","Nov","Dec"]
const AxisLength = 476

const zColors = []
d3.schemeRdYlBu[4].forEach(color => zColors.unshift(color))

const svg = d3.select(".container")
              .append("svg")
              .attr("width", w)
              .attr("height", h)

const tooltip = d3.select("body")
                  .append("div")
                  .attr("id", "tooltip")

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
  .then(response => response.json())
  .then(data => {
    const dataset = data.monthlyVariance

    const xScale = d3.scaleBand()
                    .domain(dataset.map(d => d.year))
                    .range([padding, w-padding])

    const yScale = d3.scaleBand()
                    .domain([0,1,2,3,4,5,6,7,8,9,10,11])
                    .range([padding, h-padding])

    const zScale = d3.scaleQuantile()
                    .domain([d3.min(dataset, d => d.variance), d3.max(dataset, d => d.variance)])
                    .range(zColors)

    const legendScale = d3.scaleLinear()
                          .domain([d3.min(dataset, d => d.variance), d3.max(dataset, d => d.variance)])
                          .range([0, AxisLength])

    var xTickItems = []
    dataset.forEach(function(d) {
        if (d.year%10 == 0 && d.month == 1) {xTickItems.push(d.year)}
    })

    const xAxis = d3.axisBottom(xScale)
                    .tickValues(xTickItems)
                    .tickFormat(d3.format("d"))
                    .tickSizeOuter(0)

    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(t => months[t])
                    .tickSizeOuter(0)

    const legendAxis = d3.axisBottom(legendScale)
                      .tickValues(zScale.quantiles())
                      .tickFormat(d3.format("+.3f"))

    console.log(zScale.quantiles())

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
          .attr("class", "cell")
          .attr("data-year", d => d.year)
          .attr("data-month", d => d.month-1)
          .attr("data-temp", d => d.variance)
          .attr("x", d => xScale(d.year))
          .attr("y", d => yScale(d.month-1))
          .attr("width", xScale.bandwidth())
          .attr("height", yScale.bandwidth())
          .attr("fill", d => zScale(d.variance))
            .on("mouseover", function(e, d) {
              d3.select(this).attr("stroke", "black")
              tooltip.style("visibility", "visible")
                      .attr("data-year", () => d3.select(this).attr("data-year"))
                      .attr("data-month", () => d3.select(this).attr("data-month"))
                      .html(`${d.year} - ${months[d.month-1]}<br>${d.variance >= 0 ? "+" + d.variance : d.variance}`)
                      .style("left", `${e.clientX + 20}px`)
                      .style("top", `${e.clientY + 20}px`)
            })
            .on("mouseout", d => {
              d3.selectAll("rect").attr("stroke", "none")
            })

      svg.append("g")
          .attr("id", "title")
          .attr("transform", `translate(${w/2}, 50)`)
          .append("text")
            .text("Average Monthly Temperature at Central Park, New York")
            .attr("text-anchor", "middle")

      svg.append("g")
          .attr("id", "x-axis")
          .attr("transform", `translate(0, ${h - padding})`)
          .call(xAxis)

      svg.append("g")
          .attr("id", "y-axis")
          .attr("transform", `translate(${padding}, 0)`)
          .call(yAxis)

      svg.append("g")
          .attr("id", "legend")
          .attr("transform", `translate(${w/2 - AxisLength/2}, ${h - padding + 80})`)
          .call(legendAxis)
          .selectAll("rect")
              .data(zColors)
              .enter()
              .append("rect")
                .attr("width",  AxisLength / 9)
                .attr("height", 20)
                .attr("fill", d => d)
                .attr("transform", (d, i) => `translate(${AxisLength * i / 9}, -20)`)

  })