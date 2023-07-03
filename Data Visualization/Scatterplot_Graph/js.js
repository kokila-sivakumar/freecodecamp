const w = 876
const h = 545
const padding = 53

const colors = ["green", "yellow"]

const svg = d3.select(".container")
              .append("svg")
              .attr("width", w)
              .attr("height", h)

const tooltip = d3.select(".container")
                  .append("div")
                  .attr("id", "tooltip")

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(response => response.json())
  .then(data => {
    const dataset = data

    const xScale = d3.scaleLinear()
                    .domain([d3.min(dataset, d => d.Year), d3.max(dataset, d => d.Year)])
                    .range([padding, w - padding])
    const yScale = d3.scaleLinear()
                    .domain([d3.min(dataset, d => d.Seconds * 1000), d3.max(dataset, d => d.Seconds * 1000)])
                    .range([padding, h - padding])

    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d"))

    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat("%M:%S"))

    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
          .attr("class", "dot")
          .attr("data-xvalue", d => d.Year)
          .attr("data-yvalue", d => new Date(1000 * d.Seconds))
          .attr("r", 5)
          .attr("cx", d => xScale(d.Year))
          .attr("cy", d => yScale(d.Seconds * 1000))
          .style("fill", d => d.Doping ? colors[0] : colors[1])
            .on("mouseover", function(e, d) {
              tooltip.style("visibility", "visible")
                      .attr("data-year", () => d3.select(this).attr("data-xvalue"))
                      .html(`${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}<br>${d.Doping}`)
                      .style("left", `${e.clientX + 20}px`)
                      .style("top", `${e.clientY + 20}px`)

            })
            .on("mouseout", d => {
              tooltip.style("visibility", "hidden")
            })

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h - padding})`)
        .call(xAxis)

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis)
        .append("text")
          .attr("class", "y-axis-label")
          .attr("text-anchor", "middle")
          .text("Time ( in minutes )")
          .attr("fill", "black")
          .attr("transform", "rotate(-90)")
          .attr("y", - padding)
          .attr("x", - h / 2)
          .style("font-size", "16px")
          .attr("dy", "1em")

    const keys = ["Average power", "Daily Power Variation"]

    const legend = svg.append("g")
                      .attr("id", "legend")
                      .attr("transform", `translate(${w - 70}, ${h / 4})`)

    legend.selectAll("#legend-icons")
        .data(keys)
        .enter()
        .append("rect")
          .style("fill", (d,i) => colors[i])
          .attr("height", "16")
          .attr("width", "16")
          .attr("transform", (d,i) => `translate(0, ${-9 + i*30})`)

    legend.selectAll("#legend-labels")
        .data(keys)
        .enter()
        .append("text")
          .text((d,i) => keys[i])
          .attr("transform", (d,i) => `translate(-10, ${i*30})`)
          .style("alignment-baseline", "middle")
          .attr("text-anchor", "end")

  })
