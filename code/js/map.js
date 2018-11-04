

/** Class representing the map view. */
class Map {

    /**
     * Creates a Map Object
     *
     * @param data the full dataset
     * @param updateCountry a callback function used to notify other parts of the program when the selected
     * country was updated (clicked)
     */
    constructor() {
        // ******* TODO: PART I *******
        console.log("hello constructor");
        this.projection = d3.geoWinkel3().scale(140).translate([365, 225]);
    };

    /**
     * Renders the map
     * @param world the topojson data with the shape of all countries and a string for the activeYear
     */
    drawMap(world) {
        //note that projection is global!

        // ******* TODO: PART I *******

        //world is a topojson file. you will have to convert this to geojson (hint: you should have learned this in class!)

        // Draw the background (country outlines; hint: use #map-chart)
        // Make sure to add a graticule (gridlines) and an outline to the map

        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)

        // You need to match the country with the region. This can be done using .map()
        // We have provided a class structure for the data called CountryData that you should assign the paramters to in your mapping

        //TODO - Your code goes here - 
        console.log("drawmap");
    //   let geojson = topojson.feature(world, world.objects.countries);
    //     let geo_path = d3.geoPath()
    //                  .projection(this.projection);
 
    //     let countryData = geojson.features.map(country => {
    //         let index = this.nameArray.indexOf(country.id);
    //         let region = 'countries';


    //         if (index > -1) {
    //             region = this.populationData[index].region;
    //             return new CountryData(country.type, country.id, country.properties, country.geometry, region);
    //         } else {
    //             return new CountryData(country.type, country.id, country.properties, country.geometry, "none");

    //         }

    //     });

    //     let svg_tag=d3.select("#map-chart").append("svg");
    //     svg_tag.append("g")
    //         .selectAll("path")
    //         .data(countryData)
    //         .enter()
    //         .append("path")
            
    //         .attr("d", geo_path)
    //         .attr("id",d => d.id)
    //         .attr("class", function(d){ return d.region? d.region: ""})
    //         .classed("boundary", true)
    //         .classed("countries", true);

    //     let graticule = d3.geoGraticule();
    //     svg_tag.append("path")
    //       .datum(graticule)
    //       .attr('class', "graticule")
    //       .attr('d', geo_path)
    //       .attr('fill', 'none');

    //     svg_tag.append("path")
    // .datum({type: "Sphere"})
    // .attr("class", "sphere")
    // .attr("d", geo_path)
    // .attr("fill", "none")
    // .attr("stroke", "black");


    }

    /**
     * Highlights the selected conutry and region on mouse click
     * @param activeCountry the country ID of the country to be rendered as selected/highlighted
     */
    updateHighlightClick(activeCountry) {
        // ******* TODO: PART 3*******
        // Assign selected class to the target country and corresponding region
        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for countries/regions, you can use
        // d3 selection and .classed to set these classes on here.
        //

        //TODO - Your code goes here - 
        //this.clearHighlight();
        //d3.select("#map-chart svg").select("#" + activeCountry.toUpperCase()).classed("selected-country", true);

    }

    /**
     * Clears all highlights
     */
    clearHighlight() {
        // ******* TODO: PART 3*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes off here.

        //TODO - Your code goes here - 
       // d3.select('#map-chart svg').selectAll('.countries').classed('selected-country', false);

    }
}

