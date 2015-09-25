var com = com || {};
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
    this.queryMode = com.capstone.Query.TaxisInRange;
    this.displayMode = "timespan";

    // Total number of playback frames
    this.PlaybackFrames = 60;

    // The number of milliseconds before updating the map to the next playback option.
    this.PlaybackRate = 200;

    // Current position of playback.
    this.PlaybackPosition = 0;

    // The interval that updates the map playback.
    this.PlaybackInterval = null;

    this.PlaybackPlaying = false;

    this.mapFeatureGroup = null;

    // Contains a list of queries being displayed on the map.
    this.activeMapQueries = [];

    // This property will be removed / changed in the future.
    // Using purely for dev / testing.
    this.radius = 125;

    this.draw_selection = false;
    this.uniqueMapID = 0;

    // -------------------------------------------
    // INITIALIZATION
    // -------------------------------------------

    this.InitMap = function () {
        // Build the Leaftlet Map object.

        this.map = this.getMap(this.mapID, [40.7127, -74.0059], 13);

        this.mapFeatureGroup = new L.FeatureGroup();
        this.map.addLayer(this.mapFeatureGroup);

        // Initialize the draw drag controls.
        var drawControl = new L.Control.Draw({
            edit: {
                featureGroup: this.mapFeatureGroup,
                edit: {
                    moveMarkers: false
                }
            }
        });

        this.map.addControl(drawControl);

        // Initialize the default layer group.
        this.selectedPoints = L.layerGroup();
        this.selectedPoints.addTo(this.map);

        // Bind the map click event.
        this.map.on('click', this.onMapClick);
        this.map.on('contextmenu', this.onMapRightClick);
        this.map.on('draw:created', this.onMapDraw);
        this.map.on('move', this.onMapMove);
    };

    this.getMap = function (container, center, zoom) {

        // Build the Leaftlet Map object.
        var map = L.map(container).setView([40.7127, -74.0059], zoom);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
            maxZoom: 18,
            id: 'mapbox.streets'
        }).addTo(map);

        return map;
    }

    // -------------------------------------------
    // QUERY PLAYBACK
    // -------------------------------------------
    // Get an object containing the beginning date and 
    // end date to show results for.

    this.startPlayback = function () {
        clearInterval(this.PlaybackInterval);
        this.PlaybackPlaying = true;
        this.PlaybackInterval = setInterval(function () {

            for (var i = 0; i < self.activeMapQueries.length; i++) {
                self.activeMapQueries[i].DrawFrame();
            }

            self.PlaybackPosition++;
            if (self.PlaybackPosition >= self.PlaybackFrames) {
                self.PlaybackPosition = 0;
                //clearInterval(self.PlaybackInterval);
            }

            // Update playback bar position.
            $("#playbackScroller").prop("max", self.PlaybackFrames).val(self.PlaybackPosition);
            }, this.PlaybackRate);
    }

    this.stopPlayback = function () {
        clearInterval(this.PlaybackInterval);
        this.PlaybackPlaying = false;
    }

    this.updatePlaybackPosition = function () {
        self.PlaybackPosition = $("#playbackScroller").val();

        // Update all the queries.
        for (var i = 0; i < self.activeMapQueries.length; i++) {
            self.activeMapQueries[i].DrawFrame();
        }
    }

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
        if (self.sideBySide) {
            self.sideBySideMap.clear();
        }

        if (!self.draw_selection) self.selectRectangle(e);
    };

    this.onMapRightClick = function (e) {
        for (var i = 0; i < self.activeMapQueries.length; i++) {
            // Hit test the query object.
            if (self.activeMapQueries[i].SelectionHitTest(e.latlng)) {
                // Let the query object dispose itself.
                self.activeMapQueries[i].Dispose();

                // Remove from map queries list.
                self.activeMapQueries.splice(i, 1);

                // Set the index back one, since the current index is now the next index.
                i--;
            }
        }
    }

    this.onMapDraw = function (e) {
        console.log(e);
        var type = e.layerType,
        layer = e.layer;

        this.selectionData = {
            latitude1: layer.getLatLngs()[1].lat,
            longitude1: layer.getLatLngs()[1].lng,
            latitude2: layer.getLatLngs()[3].lat,
            longitude2: layer.getLatLngs()[3].lng
        };

        self.activeMapQueries.push(new com.capstone.MapQuery(self, self.queryMode, $.extend(self.getQueryData(), this.selectionData), layer));
        if (self.sideBySide) {
            var newLayer = self.cloneLayer(e);
            self.sideBySideMap.addLayer(newLayer);
        }
        // Do whatever else you need to. (save to db, add to map etc) 
    }

    this.onMapMove = function (e) {
        if (self.sideBySide) {
            self.updateMap2();

            // The lat/lng gets messed up when zooming only.
            setTimeout(function () {
                self.updateMap2();
            }, 200);
        }
    }

    this.updateMap2 = function () {
        var targetPoint = self.sideBySideMap.project(self.map.getCenter()).subtract([$('#mapCloneContainer').offset().left / 2, 0]);
        var target = self.sideBySideMap.unproject(targetPoint, self.map.getZoom());
        self.sideBySideMap.setView(target, self.map.getZoom(), { animate: false });
    }

    this.onMapDrawx = function (e) {
        var type = e.layerType,
        layer = e.layer;

        if (type === 'marker') {
            // Do marker specific actions 
        }

        // Do whatever else you need to. (save to db, add to map etc) 
        self.mapFeatureGroup.addLayer(layer);
    }
    // -------------------------------------------
    // MAP CONTROLS
    // -------------------------------------------

    this.startTimeValidation = function () {

    }

    this.clear = function () {
        // Abort and clear layers for all queries. Abort prevents pending server queries from being drawn later on.
        for (var i = 0; i < self.activeMapQueries.length; i++) {
            self.activeMapQueries[i].Abort = true;
            self.activeMapQueries[i].Dispose();
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

        if (self.sideBySide) {
            self.sideBySideMap.addLayer(L.rectangle(boundingBox, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.25
            }));
        }
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
            selectionMode: this.selectionMode,
            filterSelection: $("#filterSelection").val()
        };

        data.Display = [];

        // Default to pickup. We should be able to select this in the future.
        data.Display.push("pickup");

        return data;
    }

    // ---------------------------------------
    // SIDE BY SIDE FUNCTIONS
    // ---------------------------------------
    this.sideBySide = false;
    this.sideBySideMap = null;
    this.sideBySideMapContainer = null;

    this.toggleSideBySide = function () {
        if (!self.sideBySide)
            self.enableSideBySide();
        else
            self.disableSideBySide();
    }

    this.enableSideBySide = function () {
        self.sideBySideMapContainer = $("#mapClone");


        self.sideBySide = true;
        $("#mapCloneContainer").animate({ "width": "50%" }, 500)
            .promise().done(function () {
                console.log(self.map.getZoom());
                self.sideBySideMap = self.getMap("mapClone", self.map.getCenter(), self.map.getZoom());
                self.updateMapPosition();
            });

    }

    this.cloneLayer = function (layerWrapper) {
        switch (layerWrapper.layerType) {
            case "rectangle":
                return this.cloneRectangle(layerWrapper.layer);
                break;
        }
    };

    this.cloneRectangle = function (layer) {
        var bounds = [[layer._latlngs[0].lat, layer._latlngs[0].lng], [layer._latlngs[2].lat, layer._latlngs[2].lng]];
        return L.rectangle(bounds, layer.options);
    }

    // ---------------------------------------
    // REPORT FUNCTIONS
    // ---------------------------------------
    this.updateMapPosition = function () {
        self.map.invalidateSize(true);

        if (self.sideeBySide) {
            self.sideBySideMap.invalidateSize(true);
        }
    }

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
        $("#report").stop().animate({ "width": reportWidth }, 400, function () {
            $("#report").css("display", displayReport);
        });

        $('#map').stop().animate({ "width": mapWidth }, 400)
            .promise().done(function () {
                self.updateMapPosition();
            });
        
        
    };

    this.InitMap();
}

$(document).ready(function () {

    // Prevent the map from taking commands when user clicks on the overlay.
    $(".hud").on("click", com.capstone.StopPropogation)
    .on("dblclick", com.capstone.StopPropogation)
    .on("mousedown", com.capstone.StopPropogation);

    // Set up the map controller. Save for future reference.
    com.capstone.mapController = new com.capstone.MapController('map');

    // Bind the button's click event. (SAMPLE)
    $('#btnReport').on("click", com.capstone.mapController.toggleReportView);

    $('#sideBySide').on("click", com.capstone.mapController.toggleSideBySide);

    $('#btnClear').on("click", com.capstone.mapController.clear);

    $("#playbackBtn").on("click", function () {
        if (com.capstone.mapController.PlaybackPlaying) {
            com.capstone.mapController.stopPlayback();
            $(this).text("Play");
        }
        else {
            com.capstone.mapController.startPlayback();
            $(this).text("Pause");
        }
    });

    $("#playbackScroller").on("input", com.capstone.mapController.updatePlaybackPosition);

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

    $("#draw_selection").val(com.capstone.mapController.draw_selection);

    $("#draw_selection").on("change", function () {
        com.capstone.mapController.draw_selection = $(this).is(':checked');
    });
});