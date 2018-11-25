class Teams {
    constructor (data) {
    	 this.margin = {top:30, right:20, bottom:30, left:50};
        let barChart = d3.select("#bar-chart").attr('class', 'chart');

        this.svgBounds = barChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right+200;
        this.svgHeight = 2000;

        //add the svg to the div
        this.svg = barChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight);//.append("g").attr('transform',
                        //'translate(50,0)');  
        this.drawYearBar(data);
            
    };



    readBarData(data, startYear, endYear){
        //console.log("hello data");
            var unique_teams = d3.set(data, function(d){ return d.name_x; });
            var unique_names = Object.values(unique_teams);
  
  			var filteredYearData = data.filter(function(d){ return d.season>=startYear && d.season<=endYear; })


  			console.log("year data:")
  			console.log(filteredYearData);
            var constructor_name={};
            for(var j=0;j<unique_names.length;j++){
                constructor_name[unique_names[j]] = {"races":0, "wins":0};
            }
            var constructorNestedData = d3.nest()
            							  .key(function(d){ return d['name_x']; })
            							  .key(function(d){ return d['season']; })
            							  .rollup(function(d){  
            							  let tempObj = new Object();
            							  tempObj.races = d3.max(d, function(dd1){ return parseInt(dd1.round); });
            							  tempObj.wins = d3.max(d, function(dd){ return parseInt(dd.wins); });
            							  return tempObj; 
            							  }) 
            							  .entries(filteredYearData);
            //console.log(constructorNestedData);
            let aggregateData = [];
   			Object.keys(constructorNestedData).forEach(function(d){
   				let dd = constructorNestedData[d].values;
   				let aggregateRaces = d3.sum(dd, function(dd1){  return dd1.value.races; });
   				let aggregateWins = d3.sum(dd, function(dd1){ return dd1.value.wins; });
   				aggregateData.push({"Team":constructorNestedData[d].key, "totalRaces":aggregateRaces, "totalWins": aggregateWins});
      			});

   			return aggregateData;
   			
            // for(var i=startYear; i<=endYear;i++){
            //     //console.log("year"+i);
            //     d3.csv('data/yearData/'+i+'.csv').then(year_data => {
            //      //d3.csv('data/yearData/'+i+'.csv', function(year_data, error) {
            //         // var rebels = pilots.filter(function (pilot) {
            //         // return pilot.faction === "Rebels";
            //         // });
            //         //console.log("Hello read years");
            //         var constructor_key = d3.nest()
            //                                 .key(function(d){ return d['name_x']; })
            //                                 //.rollup(function(leaves){ return leaves.length; })
            //                                 .entries(year_data);
            //         //console.log(constructor_key);
            //         // new_constructor = constructor_key.map(function(dd){ return {"team":dd.key, "participation":dd.values}; })
            //         //participation aggregation
            //         for(var k=0;k<constructor_key.length;k++){
            //             //console.log(constructor_key[k].key);
            //             if (constructor_name.hasOwnProperty(constructor_key[k].key)){
            //                 //console.log(constructor_key[k].values.length);
            //                 constructor_name[constructor_key[k].key]['races']+= constructor_key[k].values.length;
            //             }
            //         }
            //         //wins aggregation
            //         Object.keys(year_data).forEach(function(d) {
            //             //console.log(year_data[d]['position']);

            //             if (year_data[d]['position']=="1.0"){
            //                 //if (constructor_name.hasOwnProperty(d['name_x'])) {
            //                 constructor_name[year_data[d]['name_x']]['wins'] = constructor_name[year_data[d]['name_x']]['wins']+1;
            //                // }                         
            //             }
            //         });
            //         //console.log(constructor_name);
            //     }); 
            // }
            //console.log(constructor_name);
    }

    drawBarChart(data){
         // var new_data = Object.entries(data).map(function(d){ return {"Team":d[0], "races":d[1]}; //"races":d.values};//,"races":d.key.races, "wins":d.key.wins};
         // });
         console.log("inside draw bar chart");
         console.log(data);
         console.log("svg width:");
         console.log(this.svgWidth);


        var labelArea = 200;
        var chart,
            width = this.svgWidth/3,
           // widthLeft=500,
           // widthRight=500,
            bar_height = 10,
            height = bar_height * 200;

        var rightOffset = width - this.margin.left+200;

        var lCol = "totalRaces";
        var rCol = "totalWins";
        var xFrom = d3.scaleLinear()
                    .range([0,  width]);
        var xTo = d3.scaleLinear()
                    .range([0, width]);
        // var y = d3.scaleOrdinal()
        //         .range([20, height]);
        var y = d3.scaleBand()
        		  .rangeRound([20, this.svgHeight])
        		  .padding(0.2);

       	console.log("draw bar chart");
        
        // var barChart = this.svg.select("#bar-chart")
        //         .attr('class', 'chart').append("svg")

        this.svg.selectAll("*").remove();
                // .attr('width', labelArea + width + width+100)
                // .attr('height', height);
          //      barChart=barChart.append("g")
        		// .attr("transform","translate(50,20)");
        //let w = labelArea + width + width;

        xFrom.domain(d3.extent(data, function(d) {
            return d[lCol];
        }));
        xTo.domain(d3.extent(data, function(d) {
            return d[rCol];
        }));

        y.domain(data.map(function(d) {
            return d.Team;
        }));

        var yPosByIndex = function(d) {
            return y(d['Team']);
        };
        console.log("data:");
        console.log(data);

       //Bar chart left
       let barChartLeft= this.svg.selectAll("rect.left")
                .data(data);

       barChartLeft.exit()
       			   .attr("opacity",1)
       			   .transition()
       			   .duration(1000)
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
       				.duration(1000)
       				.attr("width", function(d) {
                    return xFrom(d[lCol]);
                })
                    .attr("x", function(d) {
                    return width - xFrom(d[lCol]);
                })
                    .attr("y", yPosByIndex)
                    .attr("class", "left")
                    .attr("height", y.bandwidth())
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
					.duration(1000)
		      		.attr("x", function (d) {
					return width - xFrom(d[lCol])-40;
					})
			        .attr("y", function (d) {
			            return y(d.Team) + y.bandwidth() / 2;
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
       			   .duration(1000)
       			   .attr("opacity",0)
       			   .remove();

    let newBarChartName = barChartName.enter().append("text");
                
    barChartName = newBarChartName.merge(barChartName);


    barChartName.transition()
    			.duration(1000)
    			.attr("x", (labelArea / 2) + width)
                .attr("y", function (d) {
                    return y(d.Team) + y.bandwidth() / 2;
                })
                .attr("dy", ".20em")
                .attr("text-anchor", "middle")
                .attr('class', 'name')
                .text(function(d){return d['Team'];})
                .attr("opacity",1);

    //bar chart right
    let barChartRight = this.svg.selectAll("rect.right")
                .data(data);

    barChartRight.exit()
   			   .attr("opacity",1)
   			   .transition()
   			   .duration(1000)
   			   .attr("opacity",0)
   			   .remove();


    let newBarChartRight = barChartRight.enter().append("rect");

    barChartRight = newBarChartRight.merge(barChartRight);

    barChartRight.transition()
    			.duration(1000)
    			.attr("x", rightOffset)
                .attr("y", yPosByIndex)
                .attr("class", "right")
                .attr("width", function (d) {
                    return xTo(d[rCol]);
                })
                .attr("height", y.bandwidth());


    //bar chart right text
    let barChartRightText=this.svg.selectAll("text.score")
                .data(data);

    barChartRightText.exit()
   			   .attr("opacity",1)
   			   .transition()
   			   .duration(1000)
   			   .attr("opacity",0)
   			   .remove();

    let newBarChartRightText = barChartRightText.enter().append("text");

    barChartRightText = newBarChartRightText.merge(barChartRightText);

    barChartRightText.attr("x", function (d) {
                    return xTo(d[rCol]) + rightOffset+40;
                })
                .attr("y", function (d) {
                    return y(d.Team) + y.bandwidth() / 2;
                })
                .attr("dx", -5)
                .attr("dy", ".36em")
                .attr("text-anchor", "end")
                .attr('class', 'score')
                .text(function(d){return d[rCol];});


        this.svg.append("text").attr("x",width/3).attr("y", 15).attr("class","title").text("Races");
        this.svg.append("text").attr("x",width/3+rightOffset).attr("y", 15).attr("class","title").text("Wins");
        this.svg.append("text").attr("x",width+labelArea/3).attr("y", 15).attr("class","title").text("Teams");    
        // barChart.call(xFrom);
        // barChart.call(xTo);

    }


    /**
     * Draws the year bar and hooks up the events of a year change
     */
    drawYearBar(data) {

        let that = this;

        let slider = createD3RangeSlider(1970, 2018, "#slider-container");
        slider.onChange(function(newRange){
            d3.select("#range-label").text(newRange.begin + " - " + newRange.end);
            var constructor_name= that.readBarData(data, newRange.begin, newRange.end);
          	that.drawBarChart(constructor_name);
        });

        slider.range(1970,1980);
    }

    

    
}