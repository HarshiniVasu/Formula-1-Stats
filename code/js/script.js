console.log("hello");

// d3.csv("/data/final_f1_stats.csv", function(data) {
//   console.log(data);
// });

let worldMap = new Map();

d3.json('/data/world.json', function(error, world) {

        // ******* TODO: PART I *******

        // You need to pass the world topo data to the drawMap() function as a parameter
        console.log("json");
        worldMap.drawMap(world);

    });