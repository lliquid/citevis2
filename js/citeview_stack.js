

var tri = {
    h: 12,
    w: 12,
    dx: 10,
    dy: 10,
    x0: 100,
    y0:  200,
    cnt: 5
}

var confs = ['InfoVis', 'VAST', 'SciVis']


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
                lpapers[j].x = j % tri.cnt * tri.w + x;
                lpapers[j].y = Math.floor(j / tri.cnt) * tri.h + y;
            }

            x += tri.w * tri.cnt  + tri.dx;

        }

        y += tri.dy + tri.h * Math.ceil(_.max(_.values(papers[conf]), function(d) {return d.length;}).length / tri.cnt);
    }


    //update paper positions
    d3.selectAll('.papercell')
        .each(function(d) {
            d3.select(this)
                .style('left', d.x)
                .style('top', d.y)
                .style('position', 'absolute');
        })

    d3.selectAll('.yearlabel').remove();


    d3.select('#details')
        .style('left', tri.x0)
        .style('top', y)
        .style('position', 'absolute');


    d3.select('#selection')
        .style('left', tri.x0 + 800)
        .style('top', y)
        .style('position', 'absolute');


}


// triangular_layout();