class Teams {
    constructor (data) {
       this.margin = {top:30, right:20, bottom:30, left:50};
      //this.margin = {top:0, bottom:0, left: auto, right:auto};

        let barChart = d3.select("#bar-chart").attr('class', 'chart');
        let temp = d3.select("#temp-select");

        this.svgBounds = temp.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 1500;

        //add the svg to the div
        this.svg = barChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight);//.append("g").attr('transform',
                        //'translate(50,0)');
        this.div = d3.select("body").append("div")  
          .attr("class", "tooltip")       
          .style("opacity", 0);
        // this.div = d3.select("body") 
            // .append("div")  // declare the tooltip div 
            // .attr("class", "tooltip")
            // .style("opacity", 0);  
        this.drawYearBar(data);
            
    };



    readBarData(data, startYear, endYear){
            let unique_teams = d3.set(data, function(d){ return d.name_x; });
            let unique_names = Object.values(unique_teams);
  
        let filteredYearData = data.filter(function(d){ return d.season>=startYear && d.season<=endYear; })


        //console.log("year data:")
        //console.log(filteredYearData);
            let constructor_name={};
            for(let j=0;j<unique_names.length;j++){
                constructor_name[unique_names[j]] = {"races":0, "wins":0};
            }
            let constructorNestedData = d3.nest()
                            .key(function(d){ return d['name_x']; })
                            .key(function(d){ return d['season']; })
                            .rollup(function(d){  
                            let tempObj = new Object();
                            //console.log(d);
                            tempObj.races = d3.max(d, function(dd1){ return parseInt(dd1.round); });
                            tempObj.wins = d3.max(d, function(dd){ return parseInt(dd.wins); });
                            tempObj.nationality = d[0]['nationality.1'];
                            return tempObj; 
                            }) 
                            .entries(filteredYearData);
           // console.log(constructorNestedData);
            let aggregateData = [];
        Object.keys(constructorNestedData).forEach(function(d){
          let dd = constructorNestedData[d].values;
          let aggregateRaces = d3.sum(dd, function(dd1){  return dd1.value.races; });
          let aggregateWins = d3.sum(dd, function(dd1){ return dd1.value.wins; });
          //if (aggregateWins>1){
          aggregateData.push({"Team":constructorNestedData[d].key, "totalRaces":aggregateRaces, "totalWins": aggregateWins,"teamNationality":constructorNestedData[d].values[0].value.nationality });
          //}
            
          });

        return [filteredYearData, aggregateData];
        
    }

    drawBarChart(filteredYearData, data){
         // var new_data = Object.entries(data).map(function(d){ return {"Team":d[0], "races":d[1]}; //"races":d.values};//,"races":d.key.races, "wins":d.key.wins};
         // });
        // console.log("inside draw bar chart");
         //console.log(filteredYearData);
         //console.log(data);
         //console.log("svg width:");
         //console.log(this.svgWidth);
         let tipBar = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                return "<strong>Team Nationality: </strong> <span style='color:red'>" + d.teamNationality + "</span>"                
          })

           this.svg.call(tipBar);
         let that=this;

         let rectHeight = 20;
        let labelArea = 200;
        let chart,
            width = this.svgWidth/3,
           // widthLeft=500,
           // widthRight=500,
            bar_height = 10,
            height = bar_height * 100;
          //  console.log("left right width:"+width);

        let rightOffset = this.margin.left + width + 200;

        let lCol = "totalRaces";
        let rCol = "totalWins";
        let fromMaxValue = d3.max(data, function(d){ return d[lCol]; })
        let toMaxValue = d3.max(data, function(d){ return d[rCol]; })
        let xFrom = d3.scaleLinear()
                    .domain([0, fromMaxValue])
                    .range([0,  width]);
        let xTo = d3.scaleLinear()
                    .domain([0, toMaxValue])
                    .range([0, width]);
        // var y = d3.scaleOrdinal()
        //         .range([20, height]);
        let y = d3.scaleBand()
              .rangeRound([20, this.svgHeight])
              .padding(0.2);

        //console.log("draw bar chart");
        
        // var barChart = this.svg.select("#bar-chart")
        //         .attr('class', 'chart').append("svg")

        this.svg.selectAll("*").remove();
                // .attr('width', labelArea + width + width+100)
                // .attr('height', height);
          //      barChart=barChart.append("g")
            // .attr("transform","translate(50,20)");
        //let w = labelArea + width + width;

        // xFrom.domain(d3.extent(data, function(d) {
        //     return d[lCol];
        // }));
        // xTo.domain(d3.extent(data, function(d) {
        //     return d[rCol];
        // }));

        y.domain(data.map(function(d) {
            return d.Team;
        }));

        let yPosByIndex = function(d) {
            return y(d['Team']);
        };
       // console.log("data:");
        //console.log(data);

       //Bar chart left
       let barChartLeft= this.svg.selectAll("rect.left")
                .data(data);

       barChartLeft.exit()
               .attr("opacity",1)
               .transition()
               .duration(500)
               .attr("opacity",0)
               .remove();

       let newBarChartLeft = barChartLeft.enter().append("rect");
                // .attr("x", xFrom(0))
                // .attr("y", yPosByIndex)
                // .attr("class", "left")
                // .attr("width", 0)
                // .attr("height", y.bandwidth())
       

       barChartLeft = newBarChartLeft.merge(barChartLeft);

       barChartLeft.transition()
              .duration(500)
              .attr("width", function(d) {
                    return xFrom(d[lCol]);
                })
                    .attr("x", function(d) {
                    return width - xFrom(d[lCol])+50;
                })
                    .attr("y", function(d, i) {
                      return (i+1)*30;
                    })
                    .style("fill","steelblue")
                    .style("stroke","white")
                    .attr("height", rectHeight)
                    .style("opacity",1);

        //bar chart text
       let barChartText = this.svg.selectAll("text.leftscore")
                          .data(data);

       barChartText.exit()
               .attr("opacity",1)
               .transition()
               .duration(1000)
               .attr("opacity",0)
               .remove();


       let newBarChartText = barChartText.enter().append("text");

       barChartText = newBarChartText.merge(barChartText);
                             
    barChartText.transition()
          .duration(500)
              .attr("x", function (d) {
          return width - xFrom(d[lCol])+20;
          })
              .attr("y", function (d, i) {
                  return (i+1)*30+10;
              })
              .attr("dx", "20")
              .attr("dy", ".36em")
              .attr("text-anchor", "end")
              .attr('class', 'leftscore')
              .text(function(d){return d[lCol];})
              .style("opacity",1);

  //bar chart names
    let barChartName = this.svg.selectAll("text.name")
                .data(data);

    barChartName.exit()
               .attr("opacity",1)
               .transition()
               .duration(500)
               .attr("opacity",0)
               .remove();

    let newBarChartName = barChartName.enter().append("text");
                
    barChartName = newBarChartName.merge(barChartName);


    barChartName.transition()
          .duration(500)
          .attr("x", (labelArea / 2) + width+50)
                .attr("y", function (d, i) {
                    return (i+1)*30+10;
                })
                .attr("dy", ".20em")
                .attr("text-anchor", "middle")
                .attr('class', 'name')
                .text(function(d){return d['Team'];})
                .attr("opacity",1);

    barChartName.on("mouseover",tipBar.show);
            barChartName.on("mouseout",tipBar.hide);


    //bar chart right
    let barChartRight = this.svg.selectAll("rect.right")
                .data(data);

    barChartRight.exit()
           .attr("opacity",1)
           .transition()
           .duration(500)
           .attr("opacity",0)
           .remove();


    let newBarChartRight = barChartRight.enter().append("rect");

    barChartRight = newBarChartRight.merge(barChartRight);

    barChartRight.transition()
          .duration(500)
          .attr("x", rightOffset)
                .attr("y", function(d, i) {
                  return (i+1)*30;
                })
                .style("fill","indianred")
                .style("stroke","white")
                .attr("width", function (d) {
                    return xTo(d[rCol]);
                })
                .attr("height", rectHeight)
                .attr("class","classBarRight");


    //bar chart right text
    let barChartRightText=this.svg.selectAll("text.score")
                .data(data);

    barChartRightText.exit()
           .attr("opacity",1)
           .transition()
           .duration(500)
           .attr("opacity",0)
           .remove();

    let newBarChartRightText = barChartRightText.enter().append("text");

    barChartRightText = newBarChartRightText.merge(barChartRightText);

    barChartRightText.attr("x", function (d) {
                    return xTo(d[rCol]) + rightOffset+40;
                })
                .attr("y", function (d, i) {
                    return (i+1)*30+10;
                })
                .attr("dx", -5)
                .attr("dy", ".36em")
                .attr("text-anchor", "end")
                .attr('class', 'score')
                .text(function(d){return d[rCol];});


        this.svg.append("text").attr("x",width/3 + 200).attr("y", 15).attr("class","title").text("Races");
        this.svg.append("text").attr("x",width/3+rightOffset-10).attr("y", 15).attr("class","title").text("Wins");
        this.svg.append("text").attr("x",width+labelArea/3+60).attr("y", 15).attr("class","title").text("Teams");    
        // barChart.call(xFrom);
        // barChart.call(xTo);



        //mouse click
               barChartName.on("click", function(d){
                               // d3.select(".selected").classed("selected",false)
                                //d3.select(this).classed("selected", true)
                                let cumData = that.bubbleData(filteredYearData, data, d.Team);
                                that.drawBubbleChart(cumData);
                                //clear_b rush.call(brush_year.move, null);

                            });

    }

    bubbleData(filteredYearData, data, selectedTeam){
      //console.log("inside bubble chart");
      //console.log(filteredYearData);
       let selectedTeamData = filteredYearData.filter(function(d){ return d.name_x == selectedTeam; })
       //console.log(selectedTeamData);
       //console.log("inside nest");
      let driverDetailsNest = d3.nest()
                  .key(function(d){ return d.driverRef; })
                  .key(function(d){ return d.season; })
                  .rollup(function(d){ 
                    let tempObj = new Object();
                    tempObj.numRaces = d3.max(d, function(dd1){ return parseInt(dd1.round); });
                    let driverNation = d[0].nationality;
                    tempObj.driverFirstName = d[0].givenName;
                    tempObj.driverLastName = d[0].familyName;
                    tempObj.driverNationality = driverNation;
                    return tempObj;

                  })
                  .entries(selectedTeamData);
      // console.log(driverDetailsNest);


       let cumData = [];
        Object.keys(driverDetailsNest).forEach(function(d){
          //console.log(driverDetailsNest[d].key);
          let dd = driverDetailsNest[d].values;
          //console.log(dd[0]);
          let aggregateNumRaces = d3.sum(dd, function(dd1){  return dd1.value.numRaces; });
          //let aggregateWins = d3.sum(dd, function(dd1){ return dd1.value.wins; });
          // //if (aggregateWins>1){
           cumData.push({"driverId":driverDetailsNest[d].key, "firstName":dd[0].value.driverFirstName, "lastName":dd[0].value.driverLastName, "numRaces": aggregateNumRaces,"nationality":dd[0].value.driverNationality});
          //}
            
          });  
          //console.log("cumulative data bubble");
          //console.log(cumData);   
          return cumData;
    }

    drawBubbleChart(data){

        d3.select("#bubble-chart").select("svg").remove();
        let that=this;
      let numberRaces = data.map(function(d) { return d.numRaces; });
      let meanRaces = d3.mean(numberRaces),
        racesExtent = d3.extent(numberRaces),
        raceScaleX,
        raceScaleY;

      // var continents = d3.set(countries.map(function(country) { return country.ContinentCode; }));
      // var continentColorScale = d3.scaleOrdinal(d3.schemeCategory10)
    //            .domain(continents.values());

      let width = this.svgWidth,
          height = 750;
      let svgBubble,
          circles,
          circleSize = { min: 10, max: 80 };
      let circleRadiusScale = d3.scaleSqrt()
                  .domain(racesExtent)
                  .range([circleSize.min, circleSize.max]);
      let forces, forceSimulation;
      //console.log("before svg");



      createSVG();    
        
      createCircles();
      createForces();
      createForceSimulation();
      addFlagDefinitions();
      addFillListener(); //needed
      //addGroupingListeners(); //needed
      //console.log("end bubble chart");

      function createSVG(){



      svgBubble = d3.select("#bubble-chart")
              .append("svg")
              .attr("width", width)
              .attr("height", height);
        }
        

        function createCircles(){
          let tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                return "<strong>Driver Name: </strong> <span style='color:red'>" + d.firstName+" "+ d.lastName + "</span>"
                    + "<br/>" + "<br/>" +
                     "<strong>Driver's Nationality: </strong> <span style='color:red'>" + d.nationality + "</span>" 
                     + "<br/>" + "<br/>" +
                     "<strong>Number of races: </strong> <span style='color:red'>" + d.numRaces + "</span>";
               
          })

            svgBubble.call(tip);

            let textData = ["Hover over the flags to view driver details","Scroll down to the bar chart"];
            let formatPopulation = d3.format(",");
            circles = svgBubble.selectAll(".circleTeam").data(data);

            circles.exit()
           .attr("opacity",1)
           .transition()
           .duration(1000)
           .attr("opacity",0)
           .remove();

          let newCircles=circles.enter().append("circle").attr('id', 'bubble');

          circles = newCircles.merge(circles);
          circles.transition()
              .duration(1000)
              .attr("r", function(d){ return circleRadiusScale(d.numRaces); })
                    .style("opacity",1)
                    .style("stroke","#e0e0eb");
                    updateCircles();
             circles.on("mouseover",tip.show);
            circles.on("mouseout",tip.hide);


            let displayText = svgBubble.selectAll("text").data(textData);
            displayText.exit()
                    .attr("opacity",1)
                   .transition()
                   .duration(1000)
                   .attr("opacity",0)
                   .remove();

            let newDisplayText = displayText.enter().append("text");
          displayText = newDisplayText.merge(displayText);
              displayText.attr("x", 40)
                          .attr("y", function(d,i){ return (i+1)*50; })
                          .text(function(d){ return d; })
                          .style("font-weight","bold")
                          .style("font-size","20px");
        }

        function updateCircles(){
          circles.attr("fill", function(d){
            if (d.nationality.includes(" ")){
            return "url(#" + d.nationality.split(" ")[0] + ")"; }
            else{
              return "url(#" + d.nationality + ")";
            }
          });
        }
        function createForces(){
          let forceStrength = 0.05;
          forces = {
            combine: createCombineForces()
          };
          function createCombineForces(){
            return {
              x: d3.forceX(width/2).strength(forceStrength),
              y: d3.forceY(height/2).strength(forceStrength)
            };
          }
        }

        function createForceSimulation() {
          forceSimulation = d3.forceSimulation()
            .force("x", forces.combine.x)
            .force("y", forces.combine.y)
            .force("collide", d3.forceCollide(forceCollide));
          forceSimulation.nodes(data)
            .on("tick", function() {
                circles
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; });
      });
  }
  function forceCollide(d){
    return circleRadiusScale(d.numRaces)+1;
  }

     function addFlagDefinitions() {
      let defs = svgBubble.append("defs");
      defs.selectAll(".flag")
        .data(data)
        .enter()
        .append("pattern")
        .attr("id", function(d) {  if (d.nationality.includes(" ")){ console.log(d.nationality.split(" ")[0]); return d.nationality.split(" ")[0]; } else { console.log(d.nationality); return d.nationality; } })
        .attr("class", "flag")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
          .append("image")
          .attr("width", 1)
          .attr("height", 1)
          // xMidYMid: center the image in the circle
          // slice: scale the image to fill the circle
          .attr("preserveAspectRatio", "xMidYMid slice")
          .attr("xlink:href", function(d) {
            //console.log("data/images/flags/" + d.nationality + ".svg");
            if (d.nationality.includes(" "))
              { console.log(d.nationality.split(" ")[0]); 
                  return "data/images/flags/" + d.nationality.split(" ")[0] + ".svg"; }
                else { 
                  return "data/images/flags/" + d.nationality + ".svg"; }
          //  return "data/images/flags/" + d.nationality + ".svg";
          });
  }

    function addFillListener() {
    d3.selectAll(".classBarRight")
      .on("change", function() {
      //  console.log("on change");
   //     toggleContinentKey(!flagFill() && !populationGrouping());

        updateCircles();
      });
  }

    }


    /**
     * Draws the year bar and hooks up the events of a year change
     */
    drawYearBar(data) {

        let that = this;
        let constructor_name, filteredYearData;
        let slider = createD3RangeSlider(1970, 2018, "#slider-container");
        slider.onChange(function(newRange){
          d3.select("#bubble-chart").select("svg").remove();
            d3.select("#range-label").text(newRange.begin + " - " + newRange.end)
              .style("font-weight","bold").style("font-size","25px");
           let result = that.readBarData(data, newRange.begin, newRange.end);
           filteredYearData = result[0];
           constructor_name = result[1];
            that.drawBarChart(filteredYearData, constructor_name);
        });

        slider.range(1970,1980);
    }

    

    
}