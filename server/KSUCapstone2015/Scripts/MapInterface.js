﻿var com = com || {};
com.capstone = com.capstone || {};
com.capstone.mapStateOpen = true;
com.capstone.mapAnimation = null;
com.capstone.mapController = null;

com.capstone.StopPropogation = function (e) {
    e.stopPropagation();
};

com.capstone.MapController = function (mapid) {
    // Closure
    var self = this;

    // DIV ID for Map
    this.mapID = mapid;

    // Leaflet MAP Object
    this.map = null;

    // Current selection mode for map.
    this.selectionMode = "rectangle";
    this.selectionData = {};

    // This is unused at the moment, but may become the "holding" object for actively drawing polygons
    this.selectedPoints = null;

    // Current function to be used for queries against the server. Should be changeable via a user-selection in the future.
    this.queryMode = com.capstone.Query.PickupsInRange;

    // Contains a list of queries being displayed on the map.
    this.activeMapQueries = [];

    // This property will be removed / changed in the future.
    // Using purely for dev / testing.
    this.radius = 125;

    // -------------------------------------------
    // INITIALIZATION
    // -------------------------------------------

    this.InitMap = function () {
        // Build the Leaftlet Map object.
        this.map = L.map(this.mapID).setView([40.7127, -74.0059], 13);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
            maxZoom: 18,
            id: 'mapbox.streets'
        }).addTo(this.map);

        // Initialize the default layer group.
        this.selectedPoints = L.layerGroup();
        this.selectedPoints.addTo(this.map);

        // Bind the map click event.
        this.map.on('click', this.onMapClick);
    };

    // -------------------------------------------
    // MAP EVENTS
    // -------------------------------------------

    this.onMapClick = function (e) {
        // Clear the last selection area. It should be stored in the map query already anyways.
        self.selectedPoints.clearLayers();

        // If we only allow one selection at a time, remove all query points.
        if ($("#selectMode").val().toString() == "single") {
            self.clear();
        }

        switch (self.selectionMode) {
            default: // Square
                self.selectRectangle(e);
                break;
        }
    };

    // -------------------------------------------
    // MAP CONTROLS
    // -------------------------------------------

    this.clear = function () {
        // Abort and clear layers for all queries. Abort prevents pending server queries from being drawn later on.
        for (var i = 0; i < self.activeMapQueries.length; i++) {
            self.activeMapQueries[i].Abort = true;
            self.activeMapQueries[i].MapSelectionLayer.clearLayers();
            self.activeMapQueries[i].MapResultsLayer.clearLayers();
            self.map.removeLayer(self.activeMapQueries[i].MapSelectionLayer);
            self.map.removeLayer(self.activeMapQueries[i].MapResultsLayer);
        }

        // Reset the map query list.
        self.activeMapQueries = [];

        self.selectedPoints.clearLayers();
        com.capstone.UI.setStatus("Ready.");
    }

    // -------------------------------------------
    // MAP SELECTION
    // -------------------------------------------

    // Creates a new mapQuery object that launches the active query mode for the selected point.
    this.selectRectangle = function (e) {
        var boundingBox = com.capstone.helpers.getBoundingBox(e.latlng, this.radius);
        this.selectionData = {
            latitude1: boundingBox.getNorthWest().lat,
            longitude1: boundingBox.getNorthWest().lng,
            latitude2: boundingBox.getSouthEast().lat,
            longitude2: boundingBox.getSouthEast().lng
        };

        var selection = L.layerGroup();
        selection.addTo(this.map);

        selection.addLayer(L.rectangle(boundingBox, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.25
        }));

        this.activeMapQueries.push(new com.capstone.MapQuery(this, this.queryMode, $.extend(this.getQueryData(), this.selectionData), selection));
    }

    // -------------------------------------------
    // QUERY FUNCTIONS
    // -------------------------------------------

    // Get the current query data.
    this.getQueryData = function () {
        var data = {
            start: $("#datestart").val(),
            stop: $("#dateend").val(),
            selectionMode: this.selectionMode
        };
        data.start = $("#datestart").val();
        data.stop = $("#dateend").val();


        data.Display = [];

        // Default to pickup. We should be able to select this in the future.
        data.Display.push("pickup");

        return data;
    }

    // ---------------------------------------
    // REPORT FUNCTIONS
    // ---------------------------------------
    this.showReportView = function () {
        $('#map').stop().animate({ "width": "50%" }, 1000, function () {

        });
    };

    this.hideReportView = function () {
        $('#map').stop().animate({ "width": "100%" }, 1000, function () {

        });
    };

    this.toggleReportView = function () {
        var mapWidth = (com.capstone.mapStateOpen) ? "50%" : "100%";
        var reportWidth = (com.capstone.mapStateOpen) ? "50%" : "0%";
        var displayReport = (com.capstone.mapStateOpen) ? "block" : "none";
        com.capstone.mapStateOpen = !com.capstone.mapStateOpen;

        if (displayReport == "block") $("#report").css("display", displayReport);

        // Stop any active animation and begin the new animation.
        $("#report").stop().animate({ "width": reportWidth }, 1000, function () {
            $("#report").css("display", displayReport);
        });

        $('#map').stop().animate({ "width": mapWidth }, 1000, function () {

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
});