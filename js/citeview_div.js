var data
var lookup = {}
var active = null
var oscale
var concepts = {}
var authors = {}
var active_concept = "---"
var active_author = "---"
var fillby = "internal"

//single,each,multi
var MODE = 'each'


var update = function(){
  d3.select('#shading').text(function(){
    if(fillby=='external'){
      return "Shade by Internal Cites"
    }else{
      return "Shade by External Cites"
    }
  })

  var years = d3.select("#canvas").selectAll('div.year')
      .data(data.sort(function(a,b){return b.year-a.year}))


  var year_enter = years.enter()
    .append('div')
      .classed('year',true)


  year_enter.append('div')
    .classed("yearlabel",true)
    // .style('display','table-cell')
    .html(function(d){return d.year})


  var conferences = years.selectAll('div.conference')
    .data(function(d){return d.papers})

  conferences_enter= conferences.enter().append('div')
    .classed('conference',true)

  var papers = conferences.selectAll('div.paper')
    .data(function(d){return d.papers})


  var papers_enter = papers.enter().append('div')
    .classed("papercell",true).append('div')
    .classed('paper',true)
    .on('mouseover',function(d){
      select(d)
    })
    .on('mouseout',function(d){
      deselect(d)
    })
    .on('click',function(d){
      if(d.active==true){
        deactivate()
      }else{
        set_active(d)
      }
    })
    

  papers_enter.append('div')
      .classed('corners',true)
      .classed('paperglyph',true)

  papers_enter.append('div')
        .classed('papercircle',true)
        .classed('paperglyph',true)
        

  papers_enter.append('div')
    .classed("best",true)
    .style('display',function(d){return d.best?null:'none'})
  


  papers.selectAll(".papercircle")
    .classed("selected",function(d){return d.selected==true})
    .classed("innode",function(d){return d.innode==true})
    .classed("outnode",function(d){return d.outnode==true})
    .style("background-color",function(d){
      if(d.selected==true || d.innode==true || d.outnode==true){
        return null; //covered by css
      }else{
        //var c = Math.floor(oscale(d.gscholar))
        //return "rgb("+c+","+c+","+c+")"
        return (fillby=="external")?d.fillval:d.ifillval;
      }
      
    })
    .classed("selinnode",function(d){return d.innode_sel==true})
    .classed("seloutnode",function(d){return d.outnode_sel==true})
    .classed("sel",function(d){return d.active==true})
    // .classed("hauthor",function(d){return d.hauthor==true})
    // .classed("hconcept",function(d){return d.hconcept==true})
    // .classed("hkeyword",function(d){return d.hkeyword==true})
    .classed("hauthor",function(d){return last_highlight(d)=='hauthor'})
    .classed("hconcept",function(d){return last_highlight(d)=='hconcept'})
    .classed("hkeyword",function(d){return last_highlight(d)=='hkeyword'})

  papers.selectAll(".corners")
    // .classed("hauthor",function(d){return d.hauthor==true})
    // .classed("hconcept",function(d){return d.hconcept==true})
    // .classed("hkeyword",function(d){return d.hkeyword==true})
    .classed("hauthor",function(d){return last_highlight(d)=='hauthor'})
    .classed("hconcept",function(d){return last_highlight(d)=='hconcept'})
    .classed("hkeyword",function(d){return last_highlight(d)=='hkeyword'})




}

var last_highlight = function(d){
  return d.highlights[d.highlights.length-1];
}

var select = function(d){
  d.selected = true
  for(var c in d.citations){
    c = d.citations[c]
    out = lookup[c.id]
    out.loc = c.loc
    out.innode = true
  }
  for(var c in d.incites){
    c = d.incites[c]
    incite = lookup[c.id]
    incite.loc = c.loc
    incite.outnode = true
  }
  d3.select("#details").html(d.tooltip)
  update()
}

var deselect = function(d){
  d.selected = false
  for(var c in d.citations){
    c = d.citations[c]
    out = lookup[c.id]
    out.loc = null
    out.innode = false
  }
  for(var c in d.incites){
    c = d.incites[c]
    incite = lookup[c.id]
    incite.loc = null
    incite.outnode = false
  }
  d3.select('#details').html('')
  update()
}

var set_active = function(d){
  if(active!==null){
    deactivate()
  }
  active = d
  d.active = true
  for(var c in d.citations){
    c = d.citations[c]
    out = lookup[c.id]
    out.innode_sel = true
  }
  for(var c in d.incites){
    c = d.incites[c]
    incite = lookup[c.id]
    incite.outnode_sel = true
  }
  d3.select("#selection").html(d.tooltip)
  d3.select('#selection').style('display','block')
  update()
}

var tooltip = function(d){
  var conf = '<div>'+d.conference+' '+d.year+'</div>'
  var title = '<div><b>'+(d.best?"*":'')+d.title+'</b></div>'
  var authors = '<div>'+d.authors.join("; ")+'</div>'
  var citations = '<div>'+d.gscholar+" "+((d.gscholar!==1)?"citations":"citation")+" ("+(d.incites.length)+" internal)"+'</div>'
  var concepts = '<div>'+'Concepts: '+d.concepts.join(', ')+'</div>'
  return conf+title+authors+citations+concepts
}

var deactivate = function(){
  var d = active
  d.active = false
  for(var c in d.citations){
    c = d.citations[c]
    out = lookup[c.id]
    out.innode_sel = false
  }
  for(var c in d.incites){
    c = d.incites[c]
    incite = lookup[c.id]
    incite.outnode_sel = false
  }
  d3.select('#selection').text('')
  d3.select('#selection').style('display',null)
  active = null
  update()
}


//Driver
d3.json('data/citations-all-conf.json',function(json){
// d3.json('data/citations.json',function(json){
// d3.json('data/VIS/vis_dataset_ii.json',function(json){
  data = json
  var gscholar_max = 0
  var internal_max = 0
  for (var year in data){
    year = data[year]
    for(var conf in year.papers){
      conf = year.papers[conf]
      for(var paper in conf.papers){
        paper = conf.papers[paper]
        lookup[paper.id] = paper
        paper.incites = []
        paper.gscholar = parseInt(paper.gscholar)
        gscholar_max = Math.max(gscholar_max,paper.gscholar)
        conceptsAndAuthors(paper)

      }
    }
  }

  var max = 3 * Math.sqrt(gscholar_max)
  var maxfillval = 0
  var minfillval = 2000000
  var maxifill = 0
  var minifill = 2000000
  for (var year in data){
    year = data[year]
    for(var conf in year.papers){
      conf = year.papers[conf]
      for(var paper in conf.papers){
        paper = conf.papers[paper]
        paper.highlights = []


        paper.fillval = (3 * Math.sqrt(paper.gscholar)) / (max+1)
        paper.fillval = (1-paper.fillval)*240
        paper.fillval = Math.floor(paper.fillval)
        paper.fillval = 'rgb('+paper.fillval+','+paper.fillval+','+paper.fillval+')'
        maxfillval = Math.max(maxfillval, paper.fillval)
        minfillval = Math.min(minfillval, paper.fillval)
        

        
        for(var c in paper.citations){
          // console.log(c)
          c = paper.citations[c]
          // console.log(c)
          var loc = c.loc
          var id = c.id
          c = lookup[c.id]
          try{
            c.incites.push({id:paper.id, loc:loc})
            // console.log('safe: '+id)
          }catch(e){
            console.log('bad: '+id )
          }
        }
      }
    }
  }
  for (var year in data){
    year = data[year]
    for(var conf in year.papers){
      conf = year.papers[conf]
      for(var paper in conf.papers){
        paper = conf.papers[paper]
        internal_max = Math.max(internal_max,paper.incites.length)
        paper.tooltip = tooltip(paper)
      }
    }
  }
  for (var year in data){
    year = data[year]
    for(var conf in year.papers){
      conf = year.papers[conf]
      for(var paper in conf.papers){
        paper = conf.papers[paper]
        paper.ifillval = (paper.incites.length)/(internal_max+1)
        paper.ifillval = (1-paper.ifillval)*240
        paper.ifillval = Math.floor(paper.ifillval)
        paper.ifillval = 'rgb('+paper.ifillval+','+paper.ifillval+','+paper.ifillval+')'


        maxifill = Math.max(paper.ifillval,maxifill)
        minifill = Math.min(paper.ifillval,minifill)

      }
    }
  }

  for(var year in data){
    year = data[year]
    for(var conf in year.papers){
      conf = year.papers[conf]
      conf.papers.sort(function(a,b){
        return b.incites.length-a.incites.length
      })
    }
    
  }
  // oscale = d3.scale.linear()
  //   .range([240,0])


  initConcepts()
  initAuthors()
  initKeywords()
  initButtons()
  initKeyboardShortcuts()
  //updateOScale()

  update()
    // triangular_layout()
    // stacked_layout()
    // stacked_layout2()
    stacked_layout3()

})

// var updateOScale(){
//   if(fillby=="external"){
//     oscale.domain([minfillval,maxfillval])
//   }else{
//     oscale.domain([minfillval,maxfillval])
//   }
  
// }

var initConcepts = function(){
  concepts['---'] = []
  var con = d3.select('#concepts')
  con.selectAll("option")
      .data(Object.keys(concepts).sort())
    .enter().append('option')
      .attr('value',function(d){return d})
      .text(function(d){return d})
  con.on('change',function(){
    if(MODE=='single'){
      clearCategoryHighlights('hkeyword')
      clearCategoryHighlights('hconcept')
      clearCategoryHighlights('hauthor')
    }else if(MODE=='each'){
      clearCategoryHighlights('hconcept')
    }else{//if (MODE=='multi')
      //pass
    }
    active_concept = this.options[this.selectedIndex].value
    d3.select("#highlightlist").append('div')
      .classed('hlabel',true)
      .classed('hconcept',true)
      .text('Concept: '+active_concept)
    for(var p in concepts[active_concept]){
      p = concepts[active_concept][p]
      p.highlights.push('hconcept')
    }
    if(MODE=='single'){
      clearFormElement('hkeyword')
      clearFormElement('hauthor')
    }else if(MODE=='each'){
    }else{//if (MODE=='multi')
      //pass
    }
    update()
  })
}



var initAuthors = function(){
  authors['---'] = []
  var auth = d3.select('#authors')
  auth.selectAll("option")
      .data(Object.keys(authors).sort())
    .enter().append('option')
      .attr('value',function(d){return d})
      .text(function(d){return d})
  auth.on('change',function(){
    if(MODE=='single'){
      clearCategoryHighlights('hkeyword')
      clearCategoryHighlights('hconcept')
      clearCategoryHighlights('hauthor')
    }else if(MODE=='each'){
      clearCategoryHighlights('hauthor')
    }else{//if (MODE=='multi')
      //pass
    }
    active_author = this.options[this.selectedIndex].value
    d3.select("#highlightlist").append('div')
      .classed('hlabel',true)
      .classed('hauthor',true)
      .text('Author: '+active_author)
    for(var p in authors[active_author]){
      p = authors[active_author][p]
      p.highlights.push('hauthor')
    }
    if(MODE=='single'){
      clearFormElement('hkeyword')
      clearFormElement('hconcept')
      //clearFormElement('hauthor')
    }else if(MODE=='each'){
    }else{//if (MODE=='multi')
      //pass
    }
    update()
  })
}

var initKeywords = function(){
  $("#keywords").keypress(function(event){
    if(event.which == 13){
      event.preventDefault()

      if(MODE=='single'){
        clearCategoryHighlights('hkeyword')
        clearCategoryHighlights('hconcept')
        clearCategoryHighlights('hauthor')
      }else if(MODE=='each'){
        clearCategoryHighlights('hkeyword')
      }else{//if (MODE=='multi')
        //pass
      }

      
      var val = this.value
      var key = val.replace(/[^\w]|_/g, "").toLowerCase()
      

      if(key!=""){
        d3.select("#highlightlist").append('div')
          .classed('hlabel',true)
          .classed('hkeyword',true)
          .text('Keyword: '+val.trim())
        //this.value = ""
        
        // for (var year in data){
        //   year = data[year]
        //   for(var paper in year.papers){
        //     paper = year.papers[paper]
        //     if(paper.keywordstr.indexOf(key)!=-1){
        //       paper.highlights.push('hkeyword')
        //     }

        //   }
        // }

        papers = Array.prototype.concat.apply([], _.map(data, function(d) {return d.papers}))
        papers = Array.prototype.concat.apply([], _.map(papers, function(d) {return d.papers}))

        i = -1;
        while(++i < papers.length) {
          if(papers[i].keywordstr.indexOf(key)!=-1){
            papers[i].highlights.push('hkeyword')
          }
        }
      }
      update()
      if(MODE=='single'){
        clearFormElement('hconcept')
        clearFormElement('hauthor')
      }else if(MODE=='each'){
      }else{//if (MODE=='multi')
      }
    }
  });
}

var initButtons = function(){
  d3.select("#clear")
    .on('click',function(){
      clearAll()
    })
  d3.select("#shading")
    .on('click',function(){
      if(fillby=='external'){
        fillby = 'internal'
      }else{
        fillby = 'external'
      }
      update()
    })
}

var conceptsAndAuthors = function(d){
  for(var a in d.authors){
    a = d.authors[a]
    if(!(a in authors)){
      authors[a] = []
    }
    authors[a].push(d)
  }
  for(var c in d.concepts){
    c = d.concepts[c]
    if(!(c in concepts)){
      concepts[c] = []
    }
    concepts[c].push(d)
  }
}

var clearAll = function(){
  for (var year in data){
      year = data[year]
      for(var paper in year.papers){
        paper = year.papers[paper]
        paper.highlights = []
        paper.active = null
        paper.innode_sel = null
        paper.outnode_sel = null
      }
    }
    $("#highlightlist").empty()
    $('#selection').empty()
    clearFormElement('hconcept')
    clearFormElement('hauthor')
    clearFormElement('hkeyword')
    d3.select('#selection').style('display',null)
    update()
}

var clearCategoryHighlights = function(category){
  
  d3.select('#highlightlist').selectAll('div.'+category).remove()
  
  for (var year in data){
    year = data[year]
    for(var paper in year.papers){
      paper = year.papers[paper]
      //paper[category] = null
      paper.highlights = _.without(paper.highlights,category)
    }
  }
}

var clearFormElement = function(category){
  if(category=='hconcept'){
    var concepts = $('#concepts')[0]
    concepts.options[concepts.selectedIndex].selected = false
    concepts.options[0].selected = true
  }
  if(category=='hauthor'){
    var authors = $('#authors')[0]
    authors.options[authors.selectedIndex].selected = false
    authors.options[0].selected = true
  }
  if(category=='hkeyword'){
    var keywords = $('#keywords')[0]
    keywords.value = ""
  }
}


var initKeyboardShortcuts = function(){
  $(document).bind('keydown.c',function(event){
    clearAll()
  })
  $(document).bind('keydown.e',function(event){
    fillby = "external"
    update()
  })
  $(document).bind('keydown.i',function(event){
    fillby = "internal"
    update()
  })
}