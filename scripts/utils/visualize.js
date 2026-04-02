const fs = require('fs');
const path = require('path');

async function visualizeData () {
	const inputPath = path.join(__dirname, '..', 'data', 'level_summary.json');
	const outputPath = path.join(__dirname, '..', 'data', 'level_completions.svg');

    try {
        const { D3Node } = await import('d3-node');
        const d3n = new D3Node();
        const summary = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
        const svg = d3n.createSVG(400, 200);
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
        fs.writeFileSync(outputPath, d3n.svgString());
        console.log('Visualization generated.');
    }
    catch (error) {
        console.error('Error visualizing data:', error);
    }
}

module.exports = visualizeData;

if (require.main === module)
    visualizeData().catch((error) => {
        console.error('Visualization failed:', error);
        process.exitCode = 1;
    });
