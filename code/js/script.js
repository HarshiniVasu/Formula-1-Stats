console.log("hello");

d3.csv("/data/final_f1_stats.csv", function(data) {
  console.log(data[0]);
});