// URL of the earthquake data in GeoJSON format
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a map centered at a specific location and zoom level
var myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 5
});

// Add a tile layer to the map (you can choose different tile providers)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(myMap);

// Function to determine marker size based on earthquake magnitude
function markerSize(magnitude) {
  return magnitude * 5;
}

// Function to determine marker color based on earthquake depth
function markerColor(depth) {
  if (depth > 90) return "#FF0000"; // Red for deep earthquakes
  else if (depth > 70) return "#FF4500"; // Orange-Red
  else if (depth > 50) return "#FFA500"; // Orange
  else if (depth > 30) return "#FFD700"; // Gold
  else if (depth > 10) return "#ADFF2F"; // Green-Yellow
  else return "#008000"; // Green for shallow earthquakes
}

// Fetch earthquake data and plot markers on the map
d3.json(earthquakeURL).then(function(data) {
  // Loop through the earthquake data and create markers
  data.features.forEach(function(earthquake) {
    // Extract necessary information from the data
    var magnitude = earthquake.properties.mag;
    var depth = earthquake.geometry.coordinates[2];
    var location = earthquake.properties.place;

    // Create a marker with popup
    L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
      radius: markerSize(magnitude),
      fillColor: markerColor(depth),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).bindPopup(`<strong>Magnitude: ${magnitude}<br>Depth: ${depth}<br>Location: ${location}</strong>`).addTo(myMap);
  });

  // Create a legend
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var depths = [0, 10, 30, 50, 70, 90];
    var labels = [];

    // Loop through depth intervals and generate labels with colored squares
    for (var i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(myMap);
});