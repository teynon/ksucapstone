var com = com || {};
com.capstone = {};
com.capstone.mapStateOpen = true;
com.capstone.mapAnimation = null;
com.capstone.mapController = null;

com.capstone.StopPropogation = function (e) {
    e.stopPropagation();
};

com.capstone.MapController = function (mapid) {
    var self = this;
    this.mapID = mapid;
    this.map = null;
    this.selectedPoints = null;
    this.resultPoints = null;
    // This property will be removed / changed in the future.
    // Using purely for dev / testing.
    this.radius = 125;

    this.metersToMiles = function (meters) {
        return meters * 0.00062137;
    }

    this.milesToMeters = function (miles) {
        return miles / 0.00062137;
    }

    this.metersToLatitude = function (meters) {
        return (meters / 6378000) * (180 / Math.PI);
    }

    this.metersToLongitude = function (meters, latitude) {
        return (meters / 6378000) * (180 / Math.PI) / Math.cos(latitude * Math.PI / 180);
    }

    this.getBoundingBox = function(latlng, meters) {
        var b1 = L.latLng(latlng.lat, latlng.lng);
        var b2 = L.latLng(latlng.lat, latlng.lng);
        b1.lat -= self.metersToLatitude(self.radius);
        b1.lng -= self.metersToLongitude(self.radius, latlng.lat);
        b2.lat += self.metersToLatitude(self.radius);
        b2.lng += self.metersToLongitude(self.radius, latlng.lat);
        return L.latLngBounds(b1, b2);
    }

    this.clear = function () {
        self.selectedPoints.clearLayers();
        self.resultPoints.clearLayers();
        self.setStatus("Ready.");
    }

    this.InitMap = function () {
        this.map = L.map(this.mapID).setView([40.7127, -74.0059], 13);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
            maxZoom: 18,
            id: 'mapbox.streets'
        }).addTo(this.map);

        this.selectedPoints = L.layerGroup();
        this.selectedPoints.addTo(this.map);

        this.resultPoints = L.layerGroup();
        this.resultPoints.addTo(this.map);

        this.map.on('click', this.onMapClick);
    };

    this.onMapClick = function (e) {
        var boundingBox = self.getBoundingBox(e.latlng);

        if ($("#selectMode").val().toString() == "single") {
            self.selectedPoints.clearLayers();
        }
        self.selectedPoints.addLayer(L.rectangle(boundingBox, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.25
        }));

        var start = new Date($("#datestart").val()).toISOString();
        var stop = new Date($("#dateend").val()).toISOString();
        
        var data = {
            start : start, 
            stop: stop,
            latitude1 : boundingBox.getNorthWest().lat, 
            longitude1: boundingBox.getNorthWest().lng,
            latitude2: boundingBox.getSouthEast().lat,
            longitude2: boundingBox.getSouthEast().lng
        };

        if ($("#selectMode").val().toString() == "single") {
            self.resultPoints.clearLayers();
        }

        self.setStatus("Loading data...");

        $.getJSON("http://localhost:63061/Query/PickupsAtLocation", data, function (result) {
            if (result.Data && result.Data.length > 0) {
                self.setStatus("Rendering " + result.Count + " results.");

                var points = [];
                for (var i = 0; i < result.Data.length; i++) {
                    var latlng = L.latLng(result.Data[i].PickupLatitude, result.Data[i].PickupLongitude);
                    self.resultPoints.addLayer(L.circle(latlng, 2, {
                        color: 'green',
                        fillColor: '#f03',
                        fillOpacity: 0.25
                    }));
                }

                self.setStatus("Displaying " + result.Count + " results.");
            }
            else
                self.setStatus("No Results.");
        });
    };

    this.toggleReportView = function () {
        var mapWidth = (com.capstone.mapStateOpen) ? "50%" : "100%";
        var reportWidth = (com.capstone.mapStateOpen) ? "50%" : "0%";
        var displayReport = (com.capstone.mapStateOpen) ? "block" : "none";
        com.capstone.mapStateOpen = !com.capstone.mapStateOpen;

        if (displayReport == "block") $("#report").css("display", displayReport);
        
        // Stop any active animation and begin the new animation.
        $("#report").stop().animate({ "width" : reportWidth }, 1000, function() {
            $("#report").css("display", displayReport);
        });

        $('#map').stop().animate({ "width": mapWidth }, 1000, function () {

        });
        
    };

    this.overlaySize = function (){
        var width_split = $(document).width();
        width_split = Math.floor(width_split / 2 - 20)
        $('.main_overlay').css("width", width_split.toString() + "px");
        $('#main_status').css("width", width_split.toString() + "px");
        
    }

    this.setStatus = function (status) {
        $("#main_status").text(status);
    }

    this.getStatus = function () {
        return $("#main_status").text().toString();
    }

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

    $('#btnClear').on("click", com.capstone.mapController.clear);
    com.capstone.mapController.overlaySize();

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

    $("#area").val(com.capstone.mapController.radius);

    $("#area").on("change", function () {
        com.capstone.mapController.radius = $(this).val();
    });

    $(".autopad").on("change", function () {
        // Convert to string.
        var number = $(this).val() + "";
        while (number.length < 2) number = "0" + number;
        $(this).val(number);
    });
});