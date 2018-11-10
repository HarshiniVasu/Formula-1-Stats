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
            console.log(data);

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
                .style("fill", "steelblue")
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

        circuits();

    }

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

