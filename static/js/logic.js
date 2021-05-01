var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    console.log(data);
});

function createFeatures(earthquakeData){

   
    function onEachFeature(feature,layer){
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
        "<p> Magnitude: " +feature.properties.mag + "</p>"
        +
        "<p> Depth: " +feature.geometry.coordinates[2] + " </p>");
    }

    function createMagMarkers(mag) {
        return mag * 5000;
    }
    function depthColor(depth){
        switch(true){
            case depth > 90:
                return 'red';
            case depth > 70:
                return 'orangered';
            case depth > 50:
                return 'orange';
            case depth > 30:
                return 'yelloworange';
            case depth > 10:
                return 'yellow';
            default:
                return 'green';
        }
    }

  
    var earthquakes = L.geoJSON(earthquakeData,{
        pointToLayer: function(feature, latlng) {
            return L.circle(latlng, {
                radius: createMagMarkers(feature.properties.mag),
                color: depthColor(feature.geometry.coordinates[2])
            });
        },
     
        onEachFeature: onEachFeature
    });

    createMap(earthquakes);
}


function createMap(earthquakes){

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        id: "mapbox/satellite-streets-v11",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    

    var baseMaps = {
        "Street Map": streetmap,
        "Satellite Map":satellitemap,
        "Dark Map": darkmap
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map",{
        center: [
            37.09, -95.71
        ],
        zoom: 4,
        layers: [streetmap,satellitemap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}
  