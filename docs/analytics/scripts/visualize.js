const d3 = require('d3-node')();
const fs = require('fs');

function visualizeData () {
    try {
        const summary = JSON.parse(fs.readFileSync('./analytics/data/level_summary.json'));
        const svg = d3.select(d3.create('svg')).attr('width', 400)
            .attr('height', 200);
        const dates = Object.keys(summary).sort();

        svg.selectAll('rect')
            .data(dates.map((date) => ({ date, count: summary[date] })))
            .enter()
            .append('rect')
            .attr('x', (d, i) => i * 40)
            .attr('y', (d) => 200 - d.count * 0.1) // Scale
            .attr('width', 30)
            .attr('height', (d) => d.count * 0.1)
            .attr('fill', 'blue');
        fs.writeFileSync('./analytics/data/level_completions.svg', d3.svgString());
        console.log('Visualization generated.');
    }
    catch (error) {
        console.error('Error visualizing data:', error);
    }
}

module.exports = visualizeData;
