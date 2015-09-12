var com = com || {};
com.capstone = {};
com.capstone.mapStateOpen = true;
com.capstone.mapAnimation = null;

com.capstone.StopPropogation = function (e) {
    e.stopPropagation();
    e.preventDefault();
};

$(document).ready(function () {
    // Prevent the map from taking commands when user clicks on the overlay.
    $(".main_overlay").on("click", function (e) {
        com.capstone.StopPropogation(e);
    })
    .on("dblclick", function (e) {
        com.capstone.StopPropogation(e);
    });


    // Bind the button's click event.
    $('#btnReport').on("click", function (e) {
        var width = (com.capstone.mapStateOpen) ? "50%" : "100%";
        com.capstone.mapStateOpen = !com.capstone.mapStateOpen;

        // Stop any active animation and begin the new animation.
        $('#map').stop().animate({ "width": width }, 1000, function () {

        });
    });


    var map = L.map('map').setView([40.7127, -74.0059], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
        maxZoom: 18,
        id: 'mapbox.streets'
    }).addTo(map);

    circlegroup = L.layerGroup();
    circlegroup.addTo(map);
    function onMapClick(e) {
        if (circlegroup.getLayers().length == 0) {
            circlegroup.addLayer(L.circle(e.latlng, 125, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.25
            }));
        } else if (circlegroup.getLayers().length == 1) {
            circlegroup.addLayer(L.circle(e.latlng, 125, {
                color: 'blue',
                fillColor: '#00BFFF',
                fillOpacity: 0.25
            }));
        } else if (circlegroup.getLayers().length == 2) {
            circlegroup.clearLayers();
            circlegroup.addLayer(L.circle(e.latlng, 125, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.25
            }));
        }
        console.log("You clicked the map at " + e.latlng.toString());
    }
    map.on('click', onMapClick);
});