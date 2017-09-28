

var tri = {
    h: 14,
    w: 14,
    dx: 5,
    dy: 10,
    x0: 100,
    y0:  150,
    cnt: 5
}

var confs = ['InfoVis', 'VAST', 'SciVis'],
    cnts = [5, 5, 5],
    ycoords = {}


var stacked_layout = function() {

    //flatten data
    papers = Array.prototype.concat.apply([], _.map(data, function(d) {return d.papers}))
    papers = Array.prototype.concat.apply([], _.map(papers, function(d) {return d.papers}))
    papers = _.groupBy(papers, function(p) {return p.conference;})
    for (var conf in papers) {
        papers[conf] = _.groupBy(papers[conf], function(p) {return p.year})
    }

    //sort papers by citation
    //

    //layout
    var k = -1,
        y = tri.y0;
    while (++ k < confs.length) {
        var conf = confs[k];
        var years = _.keys(papers[conf]).sort().reverse(),
            i = -1,
            x = tri.x0;
        while(++ i < years.length) {
            var year = years[i],
                lpapers = papers[conf][year],
                j = -1;

            while( ++ j < lpapers.length) {
                lpapers[j].x = j % cnts[k] * tri.w + x;
                lpapers[j].y = Math.floor(j / cnts[k]) * tri.h + y;
            }

            x += tri.w * cnts[k]  + tri.dx;

        }

        ycoords[conf] = y;

        y += tri.dy + tri.h * Math.ceil(_.max(_.values(papers[conf]), function(d) {return d.length;}).length / cnts[k]);
    }


    //update paper positions
    d3.selectAll('.papercell')
        .each(function(d) {
            d3.select(this)
                // .transition()
                // .duration(2000)
                .style('left', d.x)
                .style('top', d.y)
                .style('position', 'absolute');
        })

    d3.selectAll('.conflabel').remove();

    d3.select('#canvas')
        .selectAll('.conflabel')
        .data(confs)
        .enter()
        .append('div')
        .attr('class', 'conflabel')
        // .transition()
        // .delay(2000)
        .style('position', 'absolute')
        .style('left', 20)
        .style('top', function(c) {return ycoords[c];})
        .text(function(c) {return c;});
        // .attr('text-anchor', 'end');

    d3.selectAll('.yearlabel').remove();


    d3.select('#canvas')
        .selectAll('.yearlabel')
        .data(d3.range(2016, 1989, -1))
        .enter()
        .append('div')
        .attr('class', 'yearlabel')
        .style('position', 'absolute')
        .style('left', function(y, i) {
            return tri.x0 + (tri.cnt * tri.w + tri.dx ) * i + tri.cnt * tri.w / 4;
        })
        .style('top', tri.y0 - 20)
        .text(function(y) {return y;});
        // .attr('text-anchor', 'end');    


    d3.select('#details')
        // .transition()
        // .duration(2000)    
        .style('left', tri.x0)
        .style('top', y)
        .style('position', 'absolute');


    d3.select('#selection')
        // .transition()   
        // .duration(2000)    
        .style('left', tri.x0 + 800)
        .style('top', y)
        .style('position', 'absolute');


}


// triangular_layout();