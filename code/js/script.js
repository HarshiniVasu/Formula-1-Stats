console.log("hello");

// d3.csv("/data/final_f1_stats.csv", function(data) {
//   console.log(data);
// });


d3.json('data/world.json').then(world => {

        let worldMap = new Map();
        console.log("json");
        worldMap.drawMap(world);

});