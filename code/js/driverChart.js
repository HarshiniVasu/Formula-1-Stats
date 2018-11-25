class DriverChart {

    constructor (driverData, selectedDriver, selectedAttribute) {

        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 30, bottom: 30, left: 50};
        let divChart = d3.select("#performance_years").classed("fullView", true);

        //fetch the svg bounds
        this.svgBounds = divChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right - 350;
        this.svgHeight = 400;

        //add the svg to the div
        this.svg = d3.select("#lineChart")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
            .attr("transform", "translate("+-400+","+50+")");

        let that = this;
        this.driverData = driverData;
        this.selectedAttribute = selectedAttribute;
        this.selectedDrivers = [selectedDriver];

        //Default call
        that.update(that.selectedDrivers, that.selectedAttribute);

        let playerSelect = document.getElementById('select2-search');
        let drivers = [];
        driverData.forEach(function(d){
            drivers.push(d.driver_name);
        });

        for(let i = 0; i < drivers.length; i++) {
            let opt = document.createElement('option');
            opt.innerHTML = drivers[i];
            opt.value = drivers[i];
            playerSelect.appendChild(opt);
        }

        d3.select('#select2-search').on('change', function () {
            let selectedName = document.getElementById('select2-search').value;
            let alreadyAdded = false;
            for (let name of that.selectedDrivers) {
                if (name === selectedName) {
                    alreadyAdded = true;
                    break;
                }
            }
            if (!alreadyAdded) {
                that.selectedDrivers.push(selectedName);
                that.update(that.selectedDrivers, that.selectedAttribute);
            }
            //console.log(that.selectedDrivers);
        });


        let attributes = ["points", "laps"];
        let optionSelect = document.getElementById('attribute-search');
        for(let i = 0; i < attributes.length; i++) {
            var opt = document.createElement('option');
            opt.innerHTML = attributes[i];
            opt.value = attributes[i];
            optionSelect.appendChild(opt);
        }

        d3.select('#attribute-search').on('change', function () {
            that.changeAttribute();
        });

    };

    update(nameList, attrib) {

        let that = this;
        let playerYearDataList = [];
        let attribValues = [];
        let yearValues = [];
        this.selectedDrivers = nameList;

        nameList.forEach(function(name){

            let plyrData =  that.driverData.filter(function(d){
                return d.driver_name == name;
            });

            //console.log(plyrData[0].values);

            playerYearDataList.push(
                {
                    "name" : name,
                    "playerYearData" : plyrData[0].values
                })

            attribValues = attribValues.concat(plyrData[0].values.map(function(d){
                let temp = d.value;
                //console.log(temp[attrib])
                return +temp[attrib];
            }));

            yearValues = yearValues.concat(plyrData[0].values.map(function(d){
                return +d.key;
            }));

        });

        //console.log(playerYearDataList);
        //console.log(attribValues);
        //console.log(yearValues);

        //console.log(d3.min(attribValues));
        //console.log(d3.max(attribValues));
        //console.log(d3.min(yearValues));
        //console.log(d3.max(yearValues));

        let yScale = d3.scaleLinear()
            .domain([d3.min(attribValues, d => d), d3.max(attribValues, d => d)])
            .range([that.svgHeight - that.margin.top - that.margin.bottom, 0]);

        let yAxis = d3.axisLeft();
        // assign the scale to the axis
        yAxis.scale(yScale);


        var yAxisG = d3.select("#yAxis")
            .attr("transform", "translate("+that.margin.left+"," + that.margin.top +")");

        //console.log(yAxisG);

        yAxisG.transition(3000).call(yAxis);


        let xScale = d3.scaleLinear()
            .domain([d3.min(yearValues), d3.max(yearValues)])
            .range([0, that.svgWidth - that.margin.left - that.margin.right]);

        let xAxis = d3.axisBottom();
        // assign the scale to the axis
        xAxis.scale(xScale);


        var xAxisG = d3.select("#xAxis")
            .attr("transform", "translate("+(that.margin.left+ 10)+"," + (that.svgHeight - that.margin.bottom) +")");


        //console.log(xAxisG);
        let color = d3.scaleLinear()
            .domain([0, playerYearDataList.length])
            // .range(["#016450", "#ece2f0"]);
            .range(["#2019F6", "#F61936"]);

        xAxisG.transition(3000).call(xAxis);
        that.svg.selectAll(".playerPath").remove();
        that.svg.selectAll(".playerNode").remove();
        let playerIndex = 0;
        playerYearDataList.forEach(function(player){
            console.log(player.name);
            console.log(player.playerYearData);

            let lineCoords = player.playerYearData.map(function(d){
                let temp = d.value;
                //console.log(temp[attrib]);
                return [xScale(+d.key) , yScale(+temp[attrib])];
            });

            console.log(lineCoords);

            let lineGenerator = d3.line();
            let pathString = lineGenerator(lineCoords);

            console.log(pathString);

            let tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    let style = 'color:red; left:'+d3.event.pageX+'px; top:'+d3.event.pageY+'px;';
                    return "<span style='"+style+"'>" + player.name + "</span>";
                });

            that.svg.call(tip);

            lineCoords.forEach(function(point){
                that.svg.append('circle').attr('cx', point[0])
                    .attr("cy", point[1])
                    .attr("r", 5)
                    .attr("transform", "translate("+(that.margin.left+ 10)+"," + (that.margin.top) +")")
                    .style("fill", color(playerIndex))
                    .attr("class", "playerNode")
                    .attr("id", player.name+"-node")
                    .on("mouseover", tip.show)
                    .on("mouseout", tip.hide);
            })

            that.svg.append('path')
                .attr('d', pathString)
                .attr("transform", "translate("+(that.margin.left+ 10)+"," + (that.margin.top) +")")
                .attr("style", "fill : none;")
                .attr("class", "playerPath")
                .attr("id", player.name+"-path")
                .style("stroke", function(d, i){
                    return color(playerIndex);
                })
                .style("stroke-width", 3)
                .style('opacity', 0.5)
                .on("mouseover", tip.show)
                .on("mouseout", tip.hide);
            playerIndex++;
        });

        this.listPlayers(nameList, color);
    };


    listPlayers(nameList, colorScale) {
        let that = this;
        let listSvg = d3.select("#selected-drivers");
        listSvg.selectAll('#listTitle').remove();

        let li = listSvg.selectAll('.selected-names').data(nameList);
        let newLi = li.enter().append('li').attr('class','selected-names');
        li.exit().remove();
        li = newLi.merge(li);

        li.on('click', function(d){
            let players = [];
            if(that.selectedDrivers.length === 1){
                return;
            }
            for(let name of that.selectedDrivers){
                if(name === d){
                    continue;
                }
                players.push(name);
            }
            that.selectedDrivers = players;
            that.update(that.selectedDrivers, that.selectedAttribute);
        });

        li.transition()
            .duration(1000)
            .text(function(d){
                return d + " x";
            })
            .attr('x', 100)
            .attr('y', function(d, i){
                return (i+1)*20;
            })
            .style("color", function (d, i) {
                return colorScale(i);
            })
            .attr("transform", "translate(0, 20)")
            .style("cursor", "pointer");
    }

    changeAttribute(){
        let attr = document.getElementById("attribute-search").value;

        if(this.selectedAttribute!==attr){
            this.selectedAttribute = attr;
            this.update(this.selectedDrivers, this.selectedAttribute);
        }
    }
};