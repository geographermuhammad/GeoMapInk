
//  var map = L.map('map').setView([36.3167, 74.6500], 9);
  var map = L.map('map', {
closePopupOnClick: false // Disable closing popups on map click
}).setView([36.3167, 74.6500], 9);

  // Add base layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map);

  function addLabels(feature, layer) {
      if (feature.properties && feature.properties.name) {
          layer.bindTooltip(feature.properties.name, { permanent: false, direction: 'auto' });
      }
  }
  function searchData() {
      var input = document.getElementById('searchInput').value.toLowerCase();
      var selectedLayers = [];

      // List of your checkbox IDs
      var checkboxes = ['villagesCheckbox','passesCheckbox', 'hotelCheckbox' , 'touristPointsCheckbox' ]; // Add all your checkbox IDs here
      checkboxes.forEach(function(checkboxId) {
          var checkbox = document.getElementById(checkboxId);
          
          if (checkbox && checkbox.checked) {
              selectedLayers.push(checkboxId.replace('Checkbox', '').toLowerCase());
          }
      });

      // Filter and search logic
      selectedLayers.forEach(function(layer) {
          if (window[layer + 'Layer']) {
              window[layer + 'Layer'].eachLayer(function(layer) {
                  if (layer.feature && layer.feature.properties) {
                      if (input.trim() === '') {
  // Exit the function if the search input is empty
  return;
}

                      var name = layer.feature.properties.name;
                      if (name && name.toLowerCase().includes(input)) {
                          layer.openPopup();
                      }
                  }
              });
          }
      });
  }

  // Event listener for Enter key in the search input
  document.getElementById('searchInput').addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
          searchData();
      }
  });
  // Define custom icons using the names of the GeoJSON files
  var icons = {
      hotels: L.icon({ iconUrl: 'icons/hotel.svg', iconSize: [20, 20] }),
      touristpoints: L.icon({ iconUrl: 'icons/touristpoint.svg', iconSize: [35, 35] }),
      passes: L.icon({ iconUrl: 'icons/passes.svg', iconSize: [35, 35] }),
      glaciers: L.icon({ iconUrl: 'icons/glacier.png', iconSize: [15, 15] }),
      villages: L.icon({ iconUrl: 'icons/village.svg', iconSize: [20, 20] })
      // Add other icons as needed
  };

  // Modify pointToLayer function to use the appropriate icon
  function pointToLayer(feature, latlng, layerType) {
      return L.marker(latlng, { icon: icons[layerType] });
  }

  // Define and load layers with custom icons
  var boundaryLayer = L.geoJSON.ajax('src/boundary.geojson').addTo(map);
 //* var hotelsLayer = L.geoJSON.ajax('src/hotels.geojson', {
     // pointToLayer: function(feature, latlng) {
      //    return pointToLayer(feature, latlng, 'hotels');
    //  }
  //}).addTo(map);
  var hotelsLayer = L.geoJSON.ajax('src/hotels.geojson', {
pointToLayer: function(feature, latlng) {
  var marker = L.marker(latlng, { icon: icons.hotels });

  if (feature.properties) {
      var popupContent = '';
      if (feature.properties.name) {
          popupContent += '<strong>' + feature.properties.name + '</strong><br>';
      }
      if (feature.properties.Type) {
          popupContent += '<strong> ' + feature.properties.Type + '</strong>';
      }
      marker.bindPopup(popupContent, { autoClose: false });
  }

  return marker;
},
onEachFeature: function(feature, layer) {
  // Check if the feature has a property 'name' and bind a tooltip
  if (feature.properties && feature.properties.name) {
      layer.bindTooltip(feature.properties.name, { permanent: false, direction: 'auto' });
  }
}
}).addTo(map);


  var touristPointsLayer = L.geoJSON.ajax('src/touristpoints.geojson', {
      pointToLayer: function(feature, latlng) {
  var marker = L.marker(latlng, { icon: icons.touristpoints });

  if (feature.properties) {
      var popupContent = '';
      if (feature.properties.name) {
          popupContent += '<strong>'+feature.properties.name +'</strong>'+ '<br>';
      }
      if (feature.properties.desc) {
          popupContent += feature.properties.desc;
      }
      if (feature.properties.imageUrl) {
          popupContent += '<img src="' + feature.properties.imageUrl + '" alt="' + feature.properties.name + '" style="width:100px; height:70px;">';
}
      marker.bindPopup(popupContent, { autoClose: false });
  }

  return marker;
},
onEachFeature: function(feature, layer) {
  // Check if the feature has a property 'name' and bind a tooltip
  if (feature.properties && feature.properties.name) {
      layer.bindTooltip(feature.properties.name, { permanent: false, direction: 'auto' });
  }
}
}).addTo(map);


  var passesLayer = L.geoJSON.ajax('src/passes.geojson', {
      pointToLayer: function(feature, latlng) {
  var marker = L.marker(latlng, { icon: icons.passes });

  if (feature.properties) {
      var popupContent = '';
      if (feature.properties.name) {
          popupContent += '<strong>'+feature.properties.name +'</strong>'+ '<br>';
      }
      if (feature.properties.desc) {
          popupContent +=feature.properties.desc;
      }
      if (feature.properties.imageUrl) {
          popupContent += '<img src="' + feature.properties.imageUrl + '" alt="' + feature.properties.name + '" style="width:100px; height:70px;">';
}

      marker.bindPopup(popupContent, { autoClose: false });
  }

  return marker;
},
onEachFeature: function(feature, layer) {
  // Check if the feature has a property 'name' and bind a tooltip
  if (feature.properties && feature.properties.name) {
      layer.bindTooltip(feature.properties.name, { permanent: false, direction: 'auto' });
  }
}
}).addTo(map);

var glaciersLayer = L.geoJSON.ajax('src/glaciers.geojson', {
style: function(feature) {
  return {
      color: '#87CEEB', // Bright sky blue color for the border
      weight: 1, // Minimal border weight
      opacity: 1,
      fillColor: '#FFFFFF', // White color for the fill
      fillOpacity: 0.7 // Slightly transparent fill
  };
}
// other options...
}).addTo(map);

  // Define and load road layers (with color styling)
  var highwaysLayer = L.geoJSON.ajax('src/highway.geojson', {
style: { color: 'blue' },
onEachFeature: function (feature, layer) {
  // Assuming your GeoJSON features have a property you want to show, for example, 'name'
  if (feature.properties && feature.properties.name) {
      layer.bindTooltip(feature.properties.name, { permanent: false, direction: 'auto' });
  }
}
}).addTo(map);
  var linkRoadsLayer = L.geoJSON.ajax('src/linkroads.geojson', {style: {color: 'black'}}).addTo(map);
 
  var residentRoadsLayer = L.geoJSON.ajax('src/residential.geojson', {style: {color: 'yellow'}}).addTo(map);

  var villagesLayer = L.geoJSON.ajax('src/villages.geojson', {
      pointToLayer: function(feature, latlng) {
  var marker = L.marker(latlng, { icon: icons.villages });

  if (feature.properties) {
      var popupContent = '';
      if (feature.properties.name) {
          popupContent += '<strong>'+feature.properties.name +'</strong>'+ '<br>' ;
      }
      if (feature.properties.desc) {
          popupContent +=feature.properties.desc;
      }
      
      if (feature.properties.imageUrl) {
          popupContent += '<img src="' + feature.properties.imageUrl + '" alt="' + feature.properties.name + '" style="width:100px; height:70px;">';
      marker.bindPopup(popupContent, { autoClose: false });
      }
  }

  return marker;
},
onEachFeature: function(feature, layer) {
  // Check if the feature has a property 'name' and bind a tooltip
  if (feature.properties && feature.properties.name) {
      layer.bindTooltip(feature.properties.name, { permanent: false, direction: 'auto' });
  }
}
}).addTo(map);

  var tracksLayer = L.geoJSON.ajax('src/tracks.geojson', {style: {color: 'green'}, onEachFeature: function (feature, layer) {
  // Assuming your GeoJSON features have a property you want to show, for example, 'name'
  if (feature.properties && feature.properties.name) {
      layer.bindTooltip(feature.properties.name, { permanent: false, direction: 'auto' });
  }
}
}).addTo(map);




  // Functions to update layer visibility
  function toggleLayer(checkboxId, layer) {
      var checkbox = document.getElementById(checkboxId);
      checkbox.addEventListener('change', function() {
          if (this.checked) {
              layer.addTo(map);
          } else {
              map.removeLayer(layer);
          }
          updateLegend();
      });
  }
     
  // Toggle layers based on checkboxes
  toggleLayer('boundaryCheckbox', boundaryLayer);
  toggleLayer('hotelCheckbox', hotelsLayer);
  toggleLayer('highwaysCheckbox', highwaysLayer);
  toggleLayer('linkRoadsCheckbox', linkRoadsLayer);
  toggleLayer('residentRoadsCheckbox', residentRoadsLayer);
  toggleLayer('touristPointsCheckbox', touristPointsLayer);
  toggleLayer('villagesCheckbox', villagesLayer);
  toggleLayer('passesCheckbox', passesLayer);
  toggleLayer('tracksCheckbox', tracksLayer);
  toggleLayer('glaciersCheckbox', glaciersLayer);

// Function to update the legend based on selected layers
function updateLegend() {
var layersInfo = {
  "Boundary": { layer: boundaryLayer, color: "blue", type: "line" },
  "Hotels": { layer: hotelsLayer, icon: icons.hotels, type: "point" },
  "Tourist Points": { layer: touristPointsLayer, icon: icons.touristpoints, type: "point" },
  "Villages": { layer: villagesLayer, icon: icons.villages, type: "point" },
  "Passes": { layer: passesLayer, icon: icons.passes, type: "point" },
  "Highways": { layer: highwaysLayer, color: "blue", type: "line" },
  "Link Roads": { layer: linkRoadsLayer, color: "black", type: "line" },
  "Residential Roads": { layer: residentRoadsLayer, color: "yellow", type: "line" },
  "Tracks": { layer: tracksLayer, color: "green", type: "line" }
  
  // Add other layers as needed
};

var legendContent = '<strong>Legend</strong><br>';
for (var key in layersInfo) {
  if (map.hasLayer(layersInfo[key].layer)) {
      if (layersInfo[key].type === "point") {
          // For point layers, use icon with 'icon-symbol' class
          legendContent += '<i class="icon-symbol" style="background-image: url(' + layersInfo[key].icon.options.iconUrl + ');"></i> ' + key + '<br>';
      } else {
          // For line layers, use colored line with 'line-symbol' class
          legendContent += '<i class="line-symbol" style="background: ' + layersInfo[key].color + ';"></i> ' + key + '<br>';
      }
  }
}

var legendDiv = document.getElementById('map-legend');
if (legendDiv) {
  legendDiv.innerHTML = legendContent;
}
}


  var legend = L.control({ position: 'bottomleft' });
  legend.onAdd = function(map) {
      var div = L.DomUtil.create('div', 'info legend');
      div.id = 'map-legend';
      div.innerHTML = '';
      return div;
  };
  legend.addTo(map);

  // Create and add a label control for "@geomapink.com"
  var label = L.control({ position: 'bottomright' }); // Position doesn't matter due to absolute CSS
label.onAdd = function(map) {
var div = L.DomUtil.create('div', 'map-label');
div.innerHTML = 'Project of NCRG:IST Karachi <br> Developed by Israr Ahmad<br> @GEO-MAP-INK';
return div;

};
label.addTo(map);
  // Initial call to update the legend and event listener for layer changes
  updateLegend();
  map.on('overlayadd overlayremove', updateLegend);


  function printMap() {
window.print(); // This triggers the browser's print dialog
}
  function resetZoom() {
      map.setView([36.3167, 74.6500], 9);
  }
  function smoothZoomIn() {
      var currentZoom = map.getZoom();
      var newZoom = currentZoom + .3;
      map.flyTo(map.getCenter(), newZoom);
  }

  function smoothZoomOut() {
      var currentZoom = map.getZoom();
      var newZoom = currentZoom - .3;
      map.flyTo(map.getCenter(), newZoom);
  }

  // Smooth Panning Functions
  function panLeft() {
      var currentCenter = map.getCenter();
      var offsetX = 0.05; // Adjust the offset value as needed
      var newCenter = L.latLng(currentCenter.lat, currentCenter.lng - offsetX);
      map.panTo(newCenter);
  }

  function panRight() {
      var currentCenter = map.getCenter();
      var offsetX = 0.01; // Adjust the offset value as needed
      var newCenter = L.latLng(currentCenter.lat, currentCenter.lng + offsetX);
      map.panTo(newCenter);
  }
  // Assuming map is already initialized and assigned to variable 'map'


