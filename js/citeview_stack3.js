

var stk3 = {
    h: 14,
    w: 14,
    x0: 100,
    y0:  150,
    cnt: 120
}

stk3.cnt = stk2.cnt


var confs = ['InfoVis', 'VAST', 'SciVis'];

var stacked_layout3 = function() {

    //flatten data
    papers = Array.prototype.concat.apply([], _.map(data, function(d) {return d.papers}))
    papers = Array.prototype.concat.apply([], _.map(papers, function(d) {return d.papers}))

    papers = _.sortBy(papers, function(p) {return p.incites.length;}).reverse();

    //layout
    var y = stk3.y0,
        x = stk3.x0,
        i = -1;

    while(++i < papers.length) {
        papers[i].x = x + i % stk3.cnt * stk3.w;
        papers[i].y = y + Math.floor(i / stk3.cnt) * stk3.h;
    }

    var ymax = y + Math.floor(papers.length / stk3.cnt) * stk3.h;

    //update paper positions
    d3.selectAll('.papercell')
        .each(function(d) {
            d3.select(this)
                .style('left', d.x)
                .style('top', d.y)
                .style('position', 'absolute');
        })

    d3.selectAll('.yearlabel').remove();

    d3.selectAll('.conflabel').remove();

    d3.select('#canvas')
        .selectAll('.conflabel')
        .data(['All'])
        .enter()
        .append('div')
        .attr('class', 'conflabel')
        .style('position', 'absolute')
        .style('left', 20)
        .style('top', function(c) {return stk3.y0;})
        .text(function(c) {return c;});

    d3.select('#details')
        .style('left', stk3.x0)
        .style('top', ymax + 50)
        .style('position', 'absolute');


    d3.select('#selection')
        .style('left', stk3.x0)
        .style('top', ymax + 200)
        .style('position', 'absolute');

}

