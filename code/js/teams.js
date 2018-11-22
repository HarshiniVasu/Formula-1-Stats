class Teams {
    constructor (data) {
        this.drawYearBar(data);
    }

    readBarData(data, startYear, endYear){
        console.log("hello data");
            var unique_teams = d3.set(data, function(d){ return d.name_x; });
            var unique_names = Object.values(unique_teams);
            var start_year=1970;
            var end_year = 1990;
            var constructor_name={};
            for(var j=0;j<unique_names.length;j++){
                constructor_name[unique_names[j]] = {"races":0, "wins":0};
            }

            for(var i=startYear; i<=endYear;i++){
                console.log("year"+i);
                d3.csv('data/yearData/'+i+'.csv').then(year_data => {
                 //d3.csv('data/yearData/'+i+'.csv', function(year_data, error) {
                    // var rebels = pilots.filter(function (pilot) {
                    // return pilot.faction === "Rebels";
                    // });
                    //console.log("Hello read years");
                    var constructor_key = d3.nest()
                                            .key(function(d){ return d['name_x']; })
                                            //.rollup(function(leaves){ return leaves.length; })
                                            .entries(year_data);
                    //console.log(constructor_key);
                    // new_constructor = constructor_key.map(function(dd){ return {"team":dd.key, "participation":dd.values}; })
                    //participation aggregation
                    for(var k=0;k<constructor_key.length;k++){
                        //console.log(constructor_key[k].key);
                        if (constructor_name.hasOwnProperty(constructor_key[k].key)){
                            //console.log(constructor_key[k].values.length);
                            constructor_name[constructor_key[k].key]['races']+= constructor_key[k].values.length;
                        }
                    }
                    //wins aggregation
                    Object.keys(year_data).forEach(function(d) {
                        //console.log(year_data[d]['position']);

                        if (year_data[d]['position']=="1.0"){
                            //if (constructor_name.hasOwnProperty(d['name_x'])) {
                            constructor_name[year_data[d]['name_x']]['wins'] = constructor_name[year_data[d]['name_x']]['wins']+1;
                           // }                         
                        }
                    });
                    //console.log(constructor_name);
                }); 
            }
            console.log(constructor_name);
            return constructor_name;
    }

    drawBarChart(data){
         // var new_data = Object.entries(data).map(function(d){ return {"Team":d[0], "races":d[1]}; //"races":d.values};//,"races":d.key.races, "wins":d.key.wins};
         // });
         Object.entries(data).forEach(function(d){
            //console.log(d[1][0]);
         })
         //console.log(new_data);
        var labelArea = 160;
        var chart,
            width = 400,
            bar_height = 20,
            height = bar_height * 200;
        var rightOffset = width + labelArea;

        var lCol = "races";
        var rCol = "wins";
        var xFrom = d3.scaleLinear()
                    .range([0, width]);
        var xTo = d3.scaleLinear()
                    .range([0, width]);
        var y = d3.scaleOrdinal()
                .range([20, height]);

        
        var barChart = d3.select("body")
                .append('svg')
                .attr('class', 'chart')
                .attr('width', labelArea + width + width)
                .attr('height', height);
        xFrom.domain(d3.extent(Object.keys(data), function (d) {
            //console.log(lCol);
            return d[lCol];
        }));
        xTo.domain(d3.extent(Object.keys(data), function (d) {
            return d[rCol];
        }));

        y.domain(Object.keys(data).map(function (d) {
            return d;
        }));

        var yPosByIndex = function (d) {
            return y(d);
        };
        console.log("data:");
        console.log(data);
        barChart.selectAll("rect.left")
                .data(data)
                .enter().append("rect")
                .attr("x", function (d) {
                    console.log("x:");
                    console.log(d[lCol]);
                    console.log(d);
                    return null;
                    //return width - xFrom(d[lCol]);
                })
        //         .attr("y", yPosByIndex)
        //         .attr("class", "left")
        //         .attr("width", function (d) {
        //             return xFrom(d[lCol]);
        //         })
        //         .attr("height", y.rangeBand());
        // chart.selectAll("text.leftscore")
        //         .data(data)
        //         .enter().append("text")
        //         .attr("x", function (d) {
        //             return width - xFrom(d[lCol])-40;
        //         })
        //         .attr("y", function (d) {
        //             return y(d.countries) + y.rangeBand() / 2;
        //         })
        //         .attr("dx", "20")
        //         .attr("dy", ".36em")
        //         .attr("text-anchor", "end")
        //         .attr('class', 'leftscore')
        //         .text(function(d){return d[lCol];});
        // chart.selectAll("text.name")
        //         .data(data)
        //         .enter().append("text")
        //         .attr("x", (labelArea / 2) + width)
        //         .attr("y", function (d) {
        //             return y(d.countries) + y.rangeBand() / 2;
        //         })
        //         .attr("dy", ".20em")
        //         .attr("text-anchor", "middle")
        //         .attr('class', 'name')
        //         .text(function(d){return d.countries;});

        // chart.selectAll("rect.right")
        //         .data(data)
        //         .enter().append("rect")
        //         .attr("x", rightOffset)
        //         .attr("y", yPosByIndex)
        //         .attr("class", "right")
        //         .attr("width", function (d) {
        //             return xTo(d[rCol]);
        //         })
        //         .attr("height", y.rangeBand());
        // chart.selectAll("text.score")
        //         .data(data)
        //         .enter().append("text")
        //         .attr("x", function (d) {
        //             return xTo(d[rCol]) + rightOffset+40;
        //         })
        //         .attr("y", function (d) {
        //             return y(d.countries) + y.rangeBand() / 2;
        //         })
        //         .attr("dx", -5)
        //         .attr("dy", ".36em")
        //         .attr("text-anchor", "end")
        //         .attr('class', 'score')
        //         .text(function(d){return d[rCol];});
        // chart.append("text").attr("x",width/3).attr("y", 10).attr("class","title").text("Infant Mortality");
        // chart.append("text").attr("x",width/3+rightOffset).attr("y", 10).attr("class","title").text("GDP");
        // chart.append("text").attr("x",width+labelArea/3).attr("y", 10).attr("class","title").text("Countries");    

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
          //  that.drawBarChart(constructor_name);
        });

        slider.range(1970,1980);
    }

    

    
}