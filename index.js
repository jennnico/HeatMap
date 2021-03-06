document.addEventListener('DOMContentLoaded',function(){
  req=new XMLHttpRequest();
  req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json',true);
  req.send();
  req.onload=function(){
    json=JSON.parse(req.responseText);
    variance = json.monthlyVariance

//1. Define the variables and modify the data array.
    
    // Parse the month and create a new data array
    const data = []
    const parseMonth = d3.timeParse('%m')
    variance.forEach(function(val){
      data.push([val.year, parseMonth(val.month), val.variance, val.month])
    })
    //Array of intervals for key/colors
    const legend = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8, 13.9]
    
    // X-axis indices based on year
    for (var i=0; i<data.length; i++){
      data[i].push(data[i][0] - 1752)
    }
      
    // Set the dimensions of the canvas, relative to the data
    const w = (data.length)/3 + 200
    const h = 12*40 + 200
    const padding = 100
    
    // Scale for x-axis (years)
    const xScale = d3.scaleLinear()
                     .domain([d3.min(data, d => d[0]), d3.max(data, d => d[0])])  
                     .range([0, (w - (2*padding) -3)]);
    
    // Scale for y-axis (months)
    const yScale = d3.scaleTime()
                     .domain([d3.max(data, d => d[1]), d3.min(data, d => d[1])])
                     .range([(h - (2*padding)), 40])
    
    // Define the axes
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d")) //removes commas from years
 
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat("%B")); 
    
    // Define the div for the tooltip
    const div = d3.select("#graph").append("div")	
                .attr("class", "tooltip")				
                .style("opacity", 0);
    
    
//2. Create the legend.
    
    //Add the legend canvas.
    const svgLegend=d3.select("#legend")
                      .append("svg")
                      .attr("width", 600)
                      .attr("height", 150)
    
    //Add the legend rectangles.
    svgLegend.selectAll("rect")
             .data(legend)
             .enter()
             .append("rect")
             .attr("style", "outline: thin solid black;")
             .attr("width", 40)
             .attr("height", 40)
             .attr("x", (d, i) => {return i*40})
             .attr("y", 1)
             .style('fill', (d) => {
                  if (d <= 2.8){ //2.8, navy
                    return ("navy")
                  }else if (d <= 3.9){ //3.9, dark blue
                    return ('#0057b5')
                  } else if (d <= 5){ //5, blue
                    return ("#4e9bed")
                  } else if (d <= 6.1){ //6.1, dark teal
                    return ("#3ddee5")
                  } else if (d <= 7.2){ //7.2, light teal
                    return ("#b8f9fc")
                  } else if (d <= 8.3){ //8.3, light yellow
                    return ("#f6f9cc")
                  } else if (d <= 9.5){ //9.5, light orange
                    return ("#ffea7c")
                  } else if (d <= 10.6){ //10.6, orange
                    return ("#f9c425")
                  } else if (d <= 11.7){ //11.7, dark orange
                    return ("darkorange")
                  } else if (d <= 12.8){ //12.8, red
                    return("red")
                  } else { //Over 12.8, dark red
                    return ("darkred")
                  }
                })
    
    //Add the legend text
    svgLegend.selectAll("text")
             .data(legend)
             .enter()
             .append("text")
             .attr("x", (d, i) => i*40 + 30 )
             .attr("y", (d, i) => 60)
             .text(d=>d.toFixed(1))
    
//3. Creat the Heat Map

    // Adds the svg canvas
    const svg=d3.select("#graph")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
    
    // Add the rectangles
    svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("width", 4)
                .attr("height", 40)
                .attr("x", (d, i) => {return i = (d[4]*4 + padding - 3)})
                .attr("y", (d, i) => {return d[3]*40 + 60})
                .style('fill', (d) => {
                  if (d[2] < -5.86){ //2.8, navy
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
                    return ("#f6f9cc")
                  } else if (d[2] < .84){ //9.5, light orange
                    return ("#ffea7c")
                  } else if (d[2] < 1.94){ //10.6, orange
                    return ("#f9c425")
                  } else if (d[2] < 3.04){ //11.7, dark orange
                    return ("darkorange")
                  } else if (d[2] < 4.14) { //12.8, red
                    return ("red")
                  } else{ //Over 12.8, dark red
                    return ("darkred")
                  }
                })
       // Tooltip appears on hover
       .on("mouseover", function(d) {	
         d3.select(this)
           .style("outline", "thin solid black")
           //Outline seemed obscured. Made rectangles smaller on hover to address this.
           .style("width", 3)
           .style("height", 39)
         div.transition()		
            .duration(200)		
            .style("opacity", .8);		
         div.html(d[0] + ": " + d3.timeFormat("%B")(d[1])  + " <br/>" +  (8.66+d[2]).toFixed(2) + String.fromCharCode(176) + "C" + " <br/>" + "Variance: " + d[2] + String.fromCharCode(176))	
            .style("left", (d3.event.pageX + 10) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");
       })	
       .on("mouseout", function(d) {	
         d3.select(this)
           .style("outline", "thin solid transparent")
           .style("width", 4)
           .style("height", 40)
         div.transition()		
            .duration(500)		
            .style("opacity", 0);	
       });


    // Add and move the X-axis
    svg.append("g")
       .attr("transform",  "translate(" + (padding) + ", " + (h-padding) + ")")
       .call(xAxis)
       .append("text")
       .attr("class", "label")
       .attr("text-anchor", "end")
       .attr("x", w/2)
       .attr("y", padding/2)
       .text("Years")
     
 
    // Add and move the Y-axis
    svg.append("g")
       .attr("transform", "translate(" + (padding) + ", " + (padding - 20) + ")")
       .call(yAxis)
       .append("text")
       .attr("class", "label")
       .attr("text-anchor", "end")
       .attr("x", -padding*2)
       .attr("y", -padding)
       .attr("dy", ".75em")
       .attr("transform", "rotate(-90)")
       .text("Months")
    
    //Y-axis not long enough, so I added a line.
    //Resource: https://stackoverflow.com/questions/48027481/d3-js-extend-bottom-axis-line-to-origin
        svg.append('line').classed('connecting-line', true)
          .attr('y1', h-padding)
          .attr('y2', padding)
          .attr('x1', padding)
          .attr('x2', padding)
          .style('stroke', 'black')
    
  }
})
