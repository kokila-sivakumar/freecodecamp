const DATA = (arr) => {
    let base = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/',
        route = {
            
            movies: 'movie-data.json',
        };
    return base + route[arr];
};

function handleData(data, selected) {
    let margin = {
            top: 78,
            right: 17,
            bottom: 67,
            left: 88
        },
        width = 1000 - (margin.left + margin.right),
        height = 566 - (margin.top + margin.bottom),
        colors = ['#CB4433', '#BBC399', '#CC93EE', '#FFFC99', '#99CCE6' ];
    function handleRoot() {
        return d3.hierarchy(data)
            .eachBefore(d => d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name)
            .sum(d => d.value)
            .sort((a, b) => b.height - a.height || b.value - a.value);
    }

    function handleTileText(leaves) {
        let format = {
            movies: () => {
                leaves.forEach((el, i) => {
                    let title = el.data.name;

                    if (title.startsWith('The')) title = title.slice(4);
                    if (title.endsWith(' ')) title = title.slice(0, -1);

                    if (title.includes('Star Wars')) title = title.slice(0, title.indexOf('-') -
                        1);
                    if (title.includes('Lord of the Rings')) title = 'LotR:' + title.slice(title
                        .indexOf(':') + 1);
                    let re = [/of the/, /and the/, /at the/],
                        tests = re.map(regex => regex.test(title)),
                        ofThe = title.indexOf('of the'),
                        andThe = title.indexOf('and the'),
                        atThe = title.indexOf('at the'),
                        ins = {
                            1: 'of the',
                            2: 'and the',
                            3: 'at the'
                        };


                    if (tests.some(test => test === true)) {
                        ofThe > -1 ? title = title.replace('of the', '%_1') : title = title;
                        andThe > -1 ? title = title.replace('and the', '%_2') : title = title;
                        atThe > -1 ? title = title.replace('at the', '%_3') : title = title;
                    }

                    title = title.split(' ').map(el => el.includes('%_') ? ins[el.slice(2)] :
                        el);
                    leaves[i].data.title = title;
                });
            },
            games: () => {
                leaves.forEach((el, i) => {
                    let title = el.data.name;

                    if (title.startsWith('The')) title = title.slice(4);

                    if (title.includes('Call of Duty')) {
                        if (title.charAt(12) === ' ') {
                            title = 'CoD 4: ' + title.substring(16);
                        } else {
                            title = 'CoD: ' + title.substring(14);
                        }
                    }

                    if (title.includes('Grand Theft Auto')) {
                        if (title.includes(':')) {
                            title = 'GTA: ' + title.substring(18);
                        } else {
                            title = 'GTA ' + title.substring(18)
                        }
                    }

                    if (title.includes('Pokemon')) {
                        title = title.split('/');
                        title[1] = title[1].slice(8);
                        title = title.join('/');
                    }

                    title = title.split(' ');
                    leaves[i].data.title = title;
                });
            },
            kickstarter: () => {
                leaves.forEach((el, i) => {
                    let title = el.data.name;

                    if (title.includes(':')) {
                        title = title.split(':')
                        title = title[0];
                    }

                    if (title.includes('-')) {
                        title = title.split('-');
                        title = title[0];
                    }

                    if (title.includes(',')) {
                        title = title.split(',');
                        title = title[0];
                    }

                    if (title.includes('||')) {
                        title = title.split('||');
                        title = title[1];
                    }

                    if (title.includes('|')) {
                        title = title.split('|');
                        title = title[0];
                    }

                    if (title.startsWith(' ')) {
                        title = title.slice(1);
                    }

                    if (title.endsWith(' ')) {
                        title = title.slice(0, -1);
                    }

                    title = title.split(' ');
                    leaves[i].data.title = title;
                });
            }
        };

        format[selected]();
    }

    function handleTitle() {
        let title = {
            movies: 'Movie Sales',
        };

        return d3.select('.title')
            .append('h1')
            .attr('id', 'title')
            .attr('class', 'h1 text-center fade-in')
            .text(title[selected]);
    }
 
    function createDescription() {
        let description = {
        };
        return d3.select('.description')
            .append('h3')
            .attr('id', 'description')
            .attr('class', 'fade-in h4 text-center')
            .text(description[selected]);
    }

    function handleSVG() {
        return d3.select('.svg-parent')
            .append('svg')
            .attr('id', 'plot')
            .attr('viewBox', `0 0 1000 700`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .append('g')
            .attr('transform', `translate(50, ${margin.top-35})`);
    }

    function handleTooltip() {
        return d3.select('body')
            .append('div')
            .attr('id', 'tooltip')
            .style('transform', 'scale(0)')
            .style('opacity', 0);
    }

    function handleColor() {
        let color_scale = d3.scaleOrdinal()
            .domain(category)
            .range(colors);

        return {
            scale: color_scale
        };
    }

    function handleTreemap(svg, color) {
        let treeMap = d3.treemap()
            .size([width, height]);

        treeMap(root);

        let nodes = svg.selectAll('g')
            .data(leaves)
            .enter().append('g')
            .attr('transform', (d) => `translate(${d.x0}, ${d.y0})`)
            .append('svg')
            .attr('width', (d) => d.x1 - d.x0)
            .attr('height', (d) => d.y1 - d.y0);
        
        let tiles = nodes.append('rect')
            .attr('class', 'tile')
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
            .attr('stroke', 'white')
            .attr('fill', d => color.scale(d.data.category))
            .attr('data-name', d => d.data.name)
            .attr('data-value', d => d.data.value)
            .attr('data-category', d => d.data.category)
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);


        nodes.append('text')
            .attr('class', 'tile-text')
            .selectAll('tspan')
            .data(d => d.data.title)
            .enter().append('tspan')
            .attr('x', 4)
            .attr('y', (d, i) => 10 + i * 10)
            .attr('font-size', 10)
            .attr('fill', 'black')
            .text(d => d);
    }

    function handleLegend(svg, color) {
        let rect_w = (width / category.length) / 4,
            rect_h = 25,
            kickstarter = selected === 'kickstarter',
            shift_x = () => selected === 'movies' ? 40 : 20,
            calc_x = (i) => (i * 4) * rect_w + rect_w / 2,
            calc_y = rect_h * 2.5,
            g = svg.append('g')
            .attr('id', 'legend')
            .attr('transform', `translate(${shift_x()}, ${height})`);

        g.selectAll("rect")
            .data(category)
            .enter().append("rect")
            .attr('class', 'legend-item')
            .attr('x', (_, i) => rect_w * (i * 4))
            .attr('y', rect_h)
            .attr("height", rect_h)
            .attr("width", rect_w)
            .attr("fill", d => color.scale(d));

        svg.select('#legend')
            .selectAll('text')
            .data(category)
            .enter().append('text')
            .attr('class', 'legend-text')
            .attr('font-size', 14)
            .attr('fill', '#fd77af')
            .text(d => d);

        if (!kickstarter) {
            d3.selectAll('.legend-text')
                .attr('text-anchor', 'middle')
                .attr('x', (_, i) => calc_x(i))
                .attr('y', (_, i) => calc_y);
        } else {
            d3.selectAll('.legend-text')
                .attr('transform', (_, i) => `translate(${calc_x(i)}, ${calc_y}) rotate(45)`)
                .attr('x', 0)
                .attr('y', 0);

        }


    }

    function handleMouseOver() {
        let point = d3.select(this),
            value = +point.attr('data-value'),
            title = point.attr('data-name'),
            center = window.innerWidth / 2,
            pos_x = (d3.event.pageX > center) ? d3.event.pageX - 190 : d3.event.pageX + 20,
            pos_y = d3.event.pageY - 100,
            format = d3.format("$,.2s");

        value = value < 100 ? value * (10 ** 6) : value;

        tooltip.style('transform', 'scale(1)')
            .style('opacity', 1)
            .style('top', pos_y + 'px')
            .style('left', pos_x + 'px')
            .attr('data-value', value);

        tooltip.html(
            `<div>
                <div>${title}</div>
                <div>${format(value)}</div>
                
            </div>`
        );
    }

    function handleMouseOut() {
        tooltip.style('transform', 'scale(0)')
            .style('opacity', 0);
    }

    let root = handleRoot(),
        leaves = root.leaves(),
        category = data.children.map(el => el.name),
        tileText = handleTileText(leaves),
        tooltip = handleTooltip(),
        descr = createDescription().lower(),
        title = handleTitle().lower(),
        svg = handleSVG(),
        color = handleColor(),
        treeMap = handleTreemap(svg, color),
        legend = handleLegend(svg, color);
}

function handleClick(e) {
    let selected = e ? e.target.value : 'movies',
        items = ['#title', '#description', '#plot'];

    items.forEach(el => d3.select(el).remove());

    svgParent.classList.toggle('fade-in');

    d3.json(DATA(selected))
        .then(res => handleData(res, selected));
}

const svgParent = document.querySelector('.svg-parent');
svgParent.addEventListener('animationend', (e) => {
    e.target.classList.toggle('fade-in')
});

let dataset = document.querySelectorAll('input[name="data"]');
dataset.forEach(el => el.addEventListener('click', handleClick));
window.onLoad = handleClick();