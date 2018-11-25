/** Class representing the map view. */
class Map {

    /** Creates a Map Object */
    constructor() {

        //this.projection = d3.geoWinkel3().scale(125).translate([420, 190]);
        this.projection = d3.geoEquirectangular().scale(125).translate([420, 190]);


    }

    /**
     * Renders the map
     * @param world the topojson data with the shape of all countries and a string for the activeYear
     */
    drawMap(world) {
        let that = this;

        let geojson = topojson.feature(world, world.objects.countries);
        let path = d3.geoPath().projection(this.projection);
        let svg = d3.select('#map-chart').append('svg');
        var topData;


        d3.select("#map-selectAll-btn").on("click", circuits);
        d3.select("#map-select-btn").on("click", topCircuit);


        svg.selectAll('path')
            .data(geojson.features)
            .enter().append('path')
            .attr('d', path)
            .classed('boundary', true)
            .classed('countries', true)
            .attr('id', d =>  d.id);

        /*svg.append("path")
            .datum({type: "Sphere"})
            .attr("id", "sphere")
            .attr("d", path)
            .attr('fill', 'none')
            .attr('stroke', 'black');*/

        let graticule = d3.geoGraticule();
        svg.append("path")
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", path);

        async function circuits() {
            let data = await d3.csv("rawData/circuits.csv");
            //console.log(data);

            svg.selectAll("circle").remove();
            d3.select("#unique").remove();

            let circles = svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return that.projection([d.lng, d.lat])[0];
                })
                .attr("cy", function (d) {
                    return that.projection([d.lng, d.lat])[1];
                })
                .attr("r", 5)
                .style("fill", "red")
                .style("opacity", 0.8);

            circles.on("mouseover", function(d) {
                circles.append("title").text(function(d) {
                    let result = "Circuit Name: "+d.name+"\nLocation: "+d.location+"\nCountry: "+d.country;
                    return result; });
            });

            circles.on("mouseout", function(d) {
                circles.select("title").remove();
            });

        };

        async function topCircuit() {
            let data = await d3.csv("data/final_f1_stats.csv");
            let cirData = await d3.csv("rawData/circuits.csv");
            var countObj = {};

            data.forEach(function(d){
                var circuitName = d.circuitName;
                if(countObj[circuitName]== undefined)
                {
                    countObj[circuitName] = 0;
                }
                else{
                    countObj[circuitName] = countObj[circuitName] + 1;
                }

            });

            var reducedData = cirData.map(function(d,i){
                return {

                    CircuitName: d.name,
                    NumRaces: countObj[d.name],
                    Location: d.location,
                    CountryName: d.country,
                    lat : d.lat,
                    lng : d.lng
                };
            });

    
            topData = reducedData.sort(function(a,b){
                return d3.descending(a.races,b.races);
            }).slice(0,15);


           svg.selectAll("circle").remove();
           d3.select("#unique").remove();

            let circles = svg.selectAll("circle")
                .data(topData)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return that.projection([d.lng, d.lat])[0];
                })
                .attr("cy", function (d) {
                    return that.projection([d.lng, d.lat])[1];
                })
                .attr("r", 5)
                .style("fill", "red")
                .style("opacity", 0.8);

            circles.on("mouseover", function(d) {
                circles .append("title")
                        .text(function(d) {
                            let result = "Circuit Name: "+d.CircuitName+"\nLocation: "+d.Location+"\nCountry: "+d.CountryName;
                            return result; 

                        });

            });

            console.log(topData);
            console.log(typeof(topData));
            //d3.select(this).classed("highlighted",true)

            circles.on("mouseout", function(d) {
                circles.select("title").remove();
            });



            var table = d3.select("#table").append("table").attr('id','unique');
            var header = table.append("thead").append("tr");
            var tbody = table.append('tbody');
            header
                .selectAll("th")
                .data(["Circuit Name", "Location", "Country Name", "Number of Races"])
                .enter()
                .append("th")
                .text(function(d) { return d; });


           var rows = tbody.selectAll('tr')
                        .data(topData)
                        .enter()
                        .append('tr')
                        .sort(function(a,b){ return d3.ascending(b.NumRaces,a.NumRaces); });


            var cells = rows.selectAll('td')
                           .data(function (row) {
                            return ["CircuitName", "Location", "CountryName", "NumRaces"].map(function (column) {
                                    return {column: column, value: row[column]};
                            });
                        })
                            .enter()
                            .append('td')
                            .text(function (d) { return d.value; });

           
        };

        

        circuits();

    };

     


       


    /**
     * Highlights the selected conutry and region on mouse click
     * @param activeCountry the country ID of the country to be rendered as selected/highlighted
     */
    updateHighlightClick(activeCountry) {

        //this.clearHighlight();
        //d3.select("#map-chart svg").select("#" + activeCountry.toUpperCase()).classed("selected-country", true);

    }

    /**
     * Clears all highlights
     */
    clearHighlight() {

       // d3.select('#map-chart svg').selectAll('.countries').classed('selected-country', false);

    }
}

