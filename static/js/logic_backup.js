// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
//console.log(queryUrl);
// Perform a GET request to the query URL

function chooseColor(mag) {
  if(mag<1){ return "#fff5f0";}
  else if(mag < 2){ return "#fee0d2";}
  else if(mag < 3){ return "#fcbba1";}
  else if(mag < 4){ return "#fc9272";}
  else if(mag < 5){ return "#fb6a4a";}
  else if(mag < 6){ return "#ef3b2c";}
  else if(mag < 7){ return "#cb181d";}
  else if(mag > 7){ return "#99000d";}
}


d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data);

  var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 8
  });

  // console.log(data.features);
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 15,
    id: "mapbox.streets",
    accessToken: API_KEY
    }).addTo(myMap);
  
  var featureList = data.features;

  featureList.forEach(feature =>{  
    var coords = [feature.geometry.coordinates[1],feature.geometry.coordinates[0]];
    var magnitude = feature.properties.mag;
    var timestamp = new Date(feature.properties.time);
    var date = timestamp.toDateString();
    var time = timestamp.toTimeString();

    //console.log(coords);

    var color = d3.scaleSequential(d3.interpolateLab("red", "black"))
    .domain([0, 10]);
  //console.log(color(magnitude));
    var spot =  L.circle(coords, {
        color:chooseColor(parseInt(magnitude)),
        fillColor: chooseColor(parseInt(magnitude)),
        fillOpacity:0.8,
        radius: magnitude * 3000,
      }).bindPopup("<h1>Magnitude: " + magnitude + "</h1> <hr> <h4>" + date + "</h4><h4>" + time + "</h4>")
      .addTo(myMap);
  });

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var colors = ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"];
    var labels = [" < 1 "," < 2 "," < 3 "," < 4 "," < 5 "," < 6 "," < 7 "," > 7"];
    
    for (var i = 0; i < labels.length; i++) {
      div.innerHTML +=
          '<i style="background-color:' + colors[i] + '">'+labels[i]+'</i><br>';
    }
    return div;
  };
  legend.addTo(myMap);
});
