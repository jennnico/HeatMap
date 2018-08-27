document.addEventListener('DOMContentLoaded',function(){
  req=new XMLHttpRequest();
  req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json',true);
  req.send();
  req.onload=function(){
    json=JSON.parse(req.responseText);
    variance = json.monthlyVariance
    
    //Parse the dates (year and month) and create a new data array
    var data = []
    var parseYear = d3.timeParse('%Y')
    var parseMonth = d3.timeParse('%m')
    variance.forEach(function(val){
      data.push([val.year, parseMonth(val.month), val.variance, val.month]) 
    })
    
    //Creat x-axis indexes, based on year. (Same year, same index)
    //data[4] will store x-axis indexes
    for (var i=0; i<data.length; i++){
      data[i].push(data[i][0] - 1752)
    }
    
    console.log(data[1])
    
    
    // Set the dimensions of the canvas / graph
    const padding = 75
    const w = 1500 - 2*padding;
    const h = 750 - 2*padding; //600 evenly divides by 12
    
    //Can't use parsetime for years before 1900?! Instead, use tickFormat when I define the x-axis
    //Scale for x-axis (years)
    const xScale = d3.scaleLinear()
                     .domain([d3.min(data, d => d[0]), d3.max(data, d => d[0])]) 
                     .range([padding, w+padding]); 
    
    //Scale for y-axis (months)
    const yScale = d3.scaleTime()
                     .domain([d3.max(data, d => d[1]), d3.min(data, d => d[1])])
                     .range([h+padding, padding])
    
    //Define the axes
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d")) //Remove commas from years
    const yAxis = d3.axisLeft(yScale)
    
    
    // Define the div for the tooltip
    var div = d3.select("a").append("div")	
                .attr("class", "tooltip")				
                .style("opacity", 0);

    // Adds the svg canvas
    const svg=d3.select("a")
                .append("svg")
                .attr("width", w + 2*padding)
                .attr("height", h + 2*padding)
    
    //Add the rectangles (bars)
    svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                //.attr("class", "bar")
                //.attr("transform", "translate(" + (2*padding) + ", " + (0) + ")")
                .attr("width", 4)
                .attr("height", 40)
                //.attr("x", (d, i) => {return (i = d[4]*4)})
                .attr("x", (d, i) => {return (i = d[4]*4) + padding})
                .attr("y", (d, i) => {return padding + d[3]*45})
                .style('fill', (d) => {
                  if (d[2] < -5.86){ //2.8
                    return ("navy")
                  }else if (d[2] < -4.76){ //3.9, dark blue
                    return ('#0057b5')
                  } else if (d[2] < -3.66){ //5, blue
                    return ("#4e9bed")
                  } else if (d[2] < -2.56){ //6.1, dark teal
                    return ("#3ddee5")
                  } else if (d[2] < -1.46){ //7.2, light teal
                    return ("#b8f9fc")
                  } else if (d[2] < -.36){ //8.3, light yellow
                    return ("#ffff87")
                  } else if (d[2] < .84){ //9.5, light orange
                    return ("#fcd16a")
                  } else if (d[2] < 1.94){ //10.6, dark orange
                    return ("#e5a100")
                  } else if (d[2] < 3.04){ //11.7
                    return ("red")
                  } else {
                    return ("darkred")
                  }
                })
    //Tooltip appears on hover
       .on("mouseover", function(d) {		
           div.transition()		
               .duration(200)		
               .style("opacity", .8);		
           div .html(d[0] + /*": " + d[1] +*/ " <br/>" +  (8.66+d[2]).toFixed(2) + "C" + " <br/>" + "Variance: " + d[2] )	
               .style("left", (d3.event.pageX + 10) + "px")		
               .style("top", (d3.event.pageY - 28) + "px");
       })					
       .on("mouseout", function(d) {		
           div.transition()		
               .duration(500)		
               .style("opacity", 0);	
       });


    //Add and move the X-axis
    svg.append("g")
       .attr("transform",  "translate(" + (0) + ", " + (h+padding) + ")")
       .call(xAxis)
       .append("text")
       .attr("class", "label")
       .attr("text-anchor", "end")
       .attr("x", w/2)
       .attr("y", padding-2)
       .text("Years")
     
    //Add and move the Y-axis
    svg.append("g")
       .attr("transform", "translate(" + (padding) + ", " + (0) + ")")
       //.attr("transform", "translate(0, 0)")
       .call(yAxis)
       .append("text")
       .attr("class", "label")
       .attr("text-anchor", "end")
       .attr("x", -padding*2)
       .attr("y", -padding-10)
       .attr("dy", ".75em")
       .attr("transform", "rotate(-90)")
       .text("Months")
    
  }
})
