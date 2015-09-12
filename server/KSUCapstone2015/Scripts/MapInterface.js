var com = com || {};
com.capstone = {};
com.capstone.mapStateOpen = true;
com.capstone.mapAnimation = null;
com.capstone.mapController = null;

com.capstone.StopPropogation = function (e) {
    e.stopPropagation();
};

com.capstone.MapController = function (mapid) {
    this.mapID = mapid;
    this.map = null;

    this.InitMap = function () {
        this.map = L.map(this.mapID).setView([40.7127, -74.0059], 13);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
            maxZoom: 18,
            id: 'mapbox.streets'
        }).addTo(this.map);

        circlegroup = L.layerGroup();
        circlegroup.addTo(this.map);

        this.map.on('click', this.onMapClick);
    };

    this.onMapClick = function (e) {
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
    };

    this.toggleReportView = function () {
        var width = (com.capstone.mapStateOpen) ? "50%" : "100%";
        com.capstone.mapStateOpen = !com.capstone.mapStateOpen;

        // Stop any active animation and begin the new animation.
        $('#map').stop().animate({ "width": width }, 1000, function () {

        });
    };

    this.showReportView = function () {
        $('#map').stop().animate({ "width": "50%" }, 1000, function () {

        });
    };

    this.hideReportView = function () {
        $('#map').stop().animate({ "width": "100%" }, 1000, function () {

        });
    };

    this.InitMap();
}

$(document).ready(function () {
    // Prevent the map from taking commands when user clicks on the overlay.
    $(".main_overlay").on("click", com.capstone.StopPropogation)
    .on("dblclick", com.capstone.StopPropogation)
    .on("mousedown", com.capstone.StopPropogation);

    // Set up the map controller. Save for future reference.
    com.capstone.mapController = new com.capstone.MapController('map');

    // Bind the button's click event. (SAMPLE)
    $('#btnReport,#btnReport2,#btnReport3').on("click", com.capstone.mapController.toggleReportView);

    $("#datestart, #dateend").datetimepicker({
        changeMonth: false,
        changeYear: false,
        closeOnWithoutClick: true,
        maxDate: new Date(2013, 0, 31, 0, 0, 0, 0, 0),
        minDate: new Date(2013, 0, 1, 0, 0, 0, 0, 0),
        format: "m/d/Y h:i:s a",
        step: 10,
        closeMonitors: [ $("#map").get(0), $(".main_overlay").get(0) ]
    });

    $(".autopad").on("change", function () {
        // Convert to string.
        var number = $(this).val() + "";
        while (number.length < 2) number = "0" + number;
        $(this).val(number);
    });
});