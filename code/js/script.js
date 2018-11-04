console.log("hello");
d3.csv("/data/final_f1_stats.csv").then( matchesCSV => {
	matchesCSV.forEach((d,i) => {
		console.log(d.country);
		});
	});