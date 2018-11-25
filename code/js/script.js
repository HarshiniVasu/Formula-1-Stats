function openTab(event, tabName) {

    let tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    let tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click();

d3.json('data/world.json').then(world => {

        const worldMap = new Map();
        worldMap.drawMap(world);

});


async function loadData() {

    let data = await d3.csv('data/final_f1_stats.csv');

    let reducedData = data.map(d =>{
        return {
            season : +d.season,
            driver_name : d.givenName+" "+d.familyName,
            dob : d.dateOfBirth,
            nationality : d.nationality,
            team : d.name_x,
            points : +d.points,
            laps : +d["results.laps"]
        };
    });
    return reducedData;
}


function updateYear (reducedData)
{
    let from = document.getElementById('YearFrom').value;
    let to = document.getElementById('YearTo').value;
    let newData = reducedData.filter(d => (from <= d.season && d.season <= to))
        .sort(function(a,b) { return a.season - b.season; });

    let nestData = d3.nest()
        .key(function (d) { return d.driver_name; })
        .key(function (d) { return d.season; })
        .rollup(function (value) {
            let myObj = new Object;
            myObj.dob = value[0].dob;
            myObj.nationality =  value[0].nationality;
            myObj.team = value[0].team;
            myObj.points = d3.sum(value, function (p) { return p.points; });
            myObj.laps = d3.sum(value, function (l) { return l.laps; });
            return myObj;
        })
        .entries(newData);

    let distinctValue = [];
    nestData.forEach(function(d){
        distinctValue.push({"driver_name":d.key, "values":d.values});
    });

    //console.log(distinctValue);
    return distinctValue;
}


loadData().then(data => {

    let min = 1960, max = 2018;
    let from = document.getElementById('YearFrom');
    let to = document.getElementById('YearTo');

    for (let i = min; i<=max; i++){
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        from.appendChild(opt);
    }

    for (let i = max; i>=min; i--){
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        to.appendChild(opt);
    }

    let retData = updateYear(data);
    let selectedDriver = "Lewis Hamilton";
    const driverObj = new Drivers(retData, selectedDriver);
    let selectedAttribute = "points";
    let driverChart = new DriverChart(retData, selectedDriver, selectedAttribute);


    d3.select('#YearFrom').on('change', function () {
        let retVal = updateYear(data);
        driverObj.populateNames(retVal);
    });

    d3.select('#YearTo').on('change', function () {
        let retVal = updateYear(data);
        driverObj.populateNames(retVal);
    });

});



//var array = new Array();
//const unique_names = new Object();
d3.csv('data/consolidated_f1_stats.csv').then(csv_data => {
            const teamObj = new Teams(csv_data);
          //  teamObj.readBarData(csv_data);
           // console.log("hello data");
           // var unique_teams = d3.set(csv_data, function(d){ return d.name_x; });
           // unique_names = Object.values(unique_teams);
           //  var start_year=1970;
           //  var end_year = 1990;
           //  var constructor_name={};
           //  for(var j=0;j<unique_names.length;j++){
           //      constructor_name[unique_names[j]] = {"Total_participation":0, "wins":0};
           //  }

           //  for(var i=start_year; i<=end_year;i++){
           //      console.log("year"+i);
           //      d3.csv('data/yearData/'+i+'.csv').then(year_data => {
           //          // var rebels = pilots.filter(function (pilot) {
           //          // return pilot.faction === "Rebels";
           //          // });
           //          var constructor_key = d3.nest()
           //                                  .key(function(d){ return d['name_x']; })
           //                                  //.rollup(function(leaves){ return leaves.length; })
           //                                  .entries(year_data);
           //          console.log(constructor_key);
           //          // new_constructor = constructor_key.map(function(dd){ return {"team":dd.key, "participation":dd.values}; })
           //          //participation aggregation
           //          for(var k=0;k<constructor_key.length;k++){
           //              console.log(constructor_key[k].key);
           //              if (constructor_name.hasOwnProperty(constructor_key[k].key)){
           //                  // console.log(constructor_key[k].values.length);
           //                  constructor_name[constructor_key[k].key]['Total_participation']+= constructor_key[k].values.length;
           //              }
           //          }
           //          //wins aggregation
           //          year_data.forEach(function(d) {
           //              console.log("inside foreach");
           //              if (d['position']==1){
           //                  //if (constructor_name.hasOwnProperty(d['name_x'])) {
           //                  constructor_name[d['name_x']]['wins'] = constructor_name[d['name_x']]['wins']+1;
           //                 // }                         
           //              }
           //          });
           //          //console.log(constructor_name);
           //      }); 
           //  }
           //  console.log(constructor_name);
    });
            // var distinct_years=[];
            // var data = d3.nest()
            //             .key(function(d){ return d.name_x; })
            //              .key(function(d){ return d.season; })
            //              .rollup(function(seasons){
            //                   return seasons.length;
            //               })
            //             .entries(csv_data);
            // data.forEach(function(d){
                //console.log(d.key);
                //console.log(d.values.length);
            //     distinct_years.push({"Team":d.key, "participation":d.values.length});
            // });
            // console.log(distinct_years);

           
           // console.log(data);
            // data.forEach(function(key){
            //     result[key] = data[key].length;
            // });
            // console.log(result);


//});

