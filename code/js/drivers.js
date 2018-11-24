class Drivers {

    constructor (driverData, selectedDriver) {

        //console.log(driverData);

        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        let divPlayer = d3.select("#driver_attributes").classed("fullView", true);

        this.driverData = driverData;
        this.selectedDriver = selectedDriver;
        this.populateNames(driverData);
        this.update(this.selectedDriver);

        d3.select("#driver-select-btn").on("click", this.showNames);

        //this.playerChart = playerChart;
        //this.playerChart.update([this.selectedPlayer], selectedAttribute);
        //this.playerChart.populateSearch(players);*/
    };

    populateNames (driverData){

        this.driverData = driverData;

        let drivers = [];
        driverData.forEach(function(d){
            drivers.push(d.driver_name);
        });

        let self = this;
        let li = d3.select("#driver-names").selectAll('li').data(drivers);
        let newLi = li.enter().append('li');
        li.exit().remove();
        li = newLi.merge(li);

        li.on('click', function(d){
            self.selectedDriver = d;
            self.showNames();
            self.update(d);
            //self.playerChart.update([d], "overall_rating");
        })

        li.transition()
            .duration(1000)
            .text(d => d);
    };

    showNames (){
        let x = document.getElementById("driver-names");
        if (x.style.display === "none" || x.style.display === "") {
            x.style.display = "flex";
        } else {
            x.style.display = "none";
        }
    };

    update (name) {
        let imageUrl = null;
        let driverDetails= [];
        let singleDriverData = null;
        this.driverData.forEach(function(driver){
            if(driver.driver_name === name){
                singleDriverData = driver;
                imageUrl = driver.image;
                driverDetails.push(driver.driver_name);
                driverDetails.push("DOB : "+driver.values[0].value.dob);
                driverDetails.push("Nationality : "+driver.values[0].value.nationality);
                driverDetails.push("Teams : "+driver.values[0].value.team);
            }
        });

        console.log(singleDriverData);

        let length = singleDriverData.values.length;

        let teams = [];
        for (let i = 0; i < length; i++) {
            teams.push(singleDriverData.values[i].value.team);
        }

        console.log(teams);


        let imageSvg = d3.select("#image");
        imageSvg.select(".player-image").remove();
        imageSvg.append("svg:image")
            .attr("class", "player-image")
            .attr("xlink:href", imageUrl)
            .attr("x", "10")
            .attr("y", "10")
            .attr("width", "300")
            .attr("height", "300");

        let details = d3.select("#details").selectAll("text").data(driverDetails);
        let newDetails = details.enter().append("text");
        details.exit().remove();
        details = newDetails.merge(details);
        details.text(d => d)
            .attr("x", 100)
            .attr("y", function(d, i){
                return (i+1)*50;
            })
            //.attr("class", function(d){return "driver-text";})
            .attr("transform", "translate("+20+","+20+")");
    };
};