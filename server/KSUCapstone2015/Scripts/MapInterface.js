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
    this.queryType = "rectangle";
    this.SelectMode = "single";
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

    this.drawingControls = null;

    this.sideBySide = false;
    this.sideBySideMap = null;
    this.sideBySideMapContainer = null;
    this.sideBySideInitialized = false;
    this.sideBySideLocked = true;
    this.sideBySideHovered = false;

    this.activeMoveSync = false;


    // -------------------------------------------
    // INITIALIZATION
    // -------------------------------------------

    this.InitMap = function () {
        // Build the Leaftlet Map object.
        self.sideBySideMapContainer = $("#mapClone");

        this.map = this.getMap(this.mapID, [40.7127, -74.0059], 13);

        this.mapFeatureGroup = new L.FeatureGroup();
        this.map.addLayer(this.mapFeatureGroup);

        // Initialize the draw drag controls.
        this.drawingControls = new L.Control.Draw({ draw: { marker: false, polyline: false }});

        if (this.draw_selection)
            this.map.addControl(this.drawingControls);

        var myButtonOptions = {
            'iconUrl': '/Content/images/quick_select.png',  // string
            'onClick': function () { },  // callback function
            'hideText': true,  // bool
            'maxWidth': 30,  // number
            'doToggle': true,  // bool
            'toggleStatus': true  // bool
        }

        new L.Control.ToggleQuickMode(myButtonOptions).addTo(this.map);

        // Initialize the default layer group.
        this.selectedPoints = L.layerGroup();
        this.selectedPoints.addTo(this.map);

        // Bind the map click event.
        this.map.on('click', this.onMapClick);
        this.map.on('contextmenu', this.onMapRightClick);
        this.map.on('draw:created', this.onMapDraw);
        this.map.on('move', this.onMapMove);
    };

    this.getMap = function (container, center, zoom, includeZoom) {
        if (includeZoom == null) includeZoom = true;
        // Build the Leaftlet Map object.
        var map = L.map(container, { zoomControl : includeZoom }).setView([40.7127, -74.0059], zoom);

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
        if (!self.draw_selection) {
            // Clear the last selection area. It should be stored in the map query already anyways.
            self.selectedPoints.clearLayers();
            
            // If we only allow one selection at a time, remove all query points.
            if (self.SelectMode == "single") {
                self.clear();
            } self.selectRectangle(e);
        }
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
        var type = e.layerType,
            layer = e.layer;

        if (e.layerType == "rectangle") {
            this.selectionData = {
                latitude1: layer.getLatLngs()[1].lat,
                longitude1: layer.getLatLngs()[1].lng,
                latitude2: layer.getLatLngs()[3].lat,
                longitude2: layer.getLatLngs()[3].lng
            };
            this.queryType = "rectangle";
        } else if (e.layerType == "polygon") {
            this.selectionData = self.getPolygonSelectionData(layer);
        }
        
        if (self.SelectMode == "trip" && $("#filterSelection").val() == "drop") {
            for (var i = 0; i < self.activeMapQueries.length; i++) {
                self.activeMapQueries[i].UpdateTrip(layer);
            }
            $("#filterSelection").val("pick");
            return;
        }
        else if (self.SelectMode == "trip" && $("#filterSelection").val() == "pick") {
            self.clear();
        }
        else {
            // If we only allow one selection at a time, remove all query points.
            if (self.SelectMode == "single") {
                self.clear();
            }
        }

        

        
        var type = e.layerType, layer = e.layer;
        var newLayer = self.cloneLayer(e);

        var newLayer2 = null;
        if (self.sideBySide) {
            newLayer2 = self.cloneLayer(e);
            self.sideBySideMap.addLayer(newLayer2);
        }

        self.map.removeLayer(layer);

        self.activeMapQueries.push(new com.capstone.MapQuery(self, self.queryMode, $.extend(self.getQueryData(), this.selectionData), layer, newLayer2));
        if (self.SelectMode == "trip") {
            $("#filterSelection").val("drop");
        }
        // Do whatever else you need to. (save to db, add to map etc) 
    }

    this.getPolygonSelectionData = function (layer) {
        this.queryType = "polygon";
        var data = [];
        for (var i = 0; i < layer._latlngs.length; i++) {
            data.push({ Latitude: layer._latlngs[i].lat, Longitude: layer._latlngs[i].lng });
        }
        console.log(data);
        return { points: data };
    }

    this.onMapMove = function (e) {
        if (!self.activeMoveSync) {
            if (self.sideBySide && self.sideBySideLocked) {
                self.updateMap2();

                // The lat/lng gets messed up when zooming only.
                setTimeout(function () {
                    self.updateMap2();
                }, 200);
            }
        }
    }

    this.onMapMoveSBS = function (e) {
        if (self.activeMoveSync) {
            if (self.sideBySide && self.sideBySideLocked) {
                self.syncMap1ToMap2(false);
            }
        }
    }

    this.onMapMoveStartSBS = function (e) {
        self.activeMoveSync = true;
    }

    this.onMapMoveEndSBS = function (e) {
        self.activeMoveSync = false;
    }

    this.onMapMouseoverSBS = function (e) {
        self.sideBySideHovered = true;
    }

    this.onMapZoomSBS = function (e) {
        if (self.sideBySideHovered && self.sideBySideLocked) {
            setTimeout(function () {
                self.syncMap1ToMap2(true);
            }, 200);
        }
    }

    this.onMapMouseoutSBS = function (e) {
        self.sideBySideHovered = false;
    }

    this.updateMap2 = function () {
        if (self.sideBySideMap != null) {
            var targetPoint = self.sideBySideMap.project(self.map.getCenter()).subtract([$('#mapCloneContainer').offset().left / 2, 0]);
            var target = self.sideBySideMap.unproject(targetPoint, self.map.getZoom());
            self.sideBySideMap.setView(target, self.map.getZoom(), { animate: false });
        }
    }

    this.syncMap1ToMap2 = function (lock) {
        if (self.sideBySideMap != null) {
            var unlock = false;
            if (lock && !self.activeMoveSync) {
                unlock = true;
                self.activeMoveSync = true;
            }

            self.map.setView(self.sideBySideMap.getCenter(), self.sideBySideMap.getZoom(), { animate: false });
            var targetPoint = self.map.project(self.sideBySideMap.getCenter()).add([$('#mapCloneContainer').offset().left / 2, 0]);
            var target = self.map.unproject(targetPoint, self.sideBySideMap.getZoom());

            self.map.setView(target, self.sideBySideMap.getZoom(), { animate: false });

            if (unlock) {
                self.activeMoveSync = false;
            }
        }
    }

    // -------------------------------------------
    // MAP CONTROLS
    // -------------------------------------------

    this.startTimeValidation = function () {

    }

    this.setDrawingMode = function (drawing) {
        this.draw_selection = drawing;
        
        if (this.draw_selection) {
            $("#simpleQueryRange").css("display", "none");
            this.map.addControl(this.drawingControls);
        }
        else {
            $("#simpleQueryRange").css("display", "block");
            this.map.removeControl(this.drawingControls);
        }
    }

    this.toggleDrawingMode = function () {
        this.setDrawingMode(!this.draw_selection);
    }

    this.updateSelectionMode = function (mode) {
        this.SelectMode = mode;
    }

    this.toggleSideBySideLocked = function () {
        self.sideBySideLocked = !self.sideBySideLocked;
        self.updateMap2();
        if (self.sideBySideLocked) {
            $("#sideBySideLocked").addClass("active");
        }
        else {
            $("#sideBySideLocked").removeClass("active");
        }
    }

    this.setSideBySideLocked = function (locked) {
        this.sideBySideLocked = locked;
        this.updateMap2();
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

        var layer = L.rectangle(boundingBox, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.25
        });

        var clonedLayer = L.rectangle(boundingBox, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.25
        });

        if (self.SelectMode == "trip" && $("#filterSelection").val() == "drop") {
            for (var i = 0; i < self.activeMapQueries.length; i++) {
                self.activeMapQueries[i].UpdateTrip(layer);
            }
            $("#filterSelection").val("pick");
            return;
        }
        else if (self.SelectMode == "trip" && $("#filterSelection").val() == "pick") {
            self.clear();
        }

        this.activeMapQueries.push(new com.capstone.MapQuery(this, this.queryMode, $.extend(this.getQueryData(), this.selectionData), layer, clonedLayer));

        if (self.SelectMode == "trip") {
            $("#filterSelection").val("drop");
        }
    }


    // -------------------------------------------
    // QUERY FUNCTIONS
    // -------------------------------------------

    // Get the current query data.
    this.getQueryData = function () {
        var data = {
            start: $("#datestart").val(),
            stop: $("#dateend").val(),
            selectionMode: this.queryType,
            filterSelection: $("#filterSelection").val(),
            filterSelectionSBS: $("#filterSelectionSBS").val()
        };

        data.Display = [];

        // Default to pickup. We should be able to select this in the future.
        data.Display.push("pickup");

        return data;
    }

    // ---------------------------------------
    // SIDE BY SIDE FUNCTIONS
    // ---------------------------------------

    this.toggleSideBySide = function () {
        if (!self.sideBySide)
            self.enableSideBySide();
        else
            self.disableSideBySide();
    }

    this.enableSideBySide = function () {
        self.sideBySide = true;
        //$("#sbspanel").css("display", "block");
        $("#mapCloneContainer").stop().css("display", "block").animate({ "width": "50%" }, 500)
            .promise().done(function () {
                if (!self.sideBySideInitialized) {
                    self.sideBySideMap = self.getMap("mapClone", self.map.getCenter(), self.map.getZoom(), false);
                    self.sideBySideInitialized = true;

                    self.sideBySideMap.on("mousedown", self.onMapMoveStartSBS);
                    self.sideBySideMap.on('move', self.onMapMoveSBS);
                    self.sideBySideMap.on("dragend", self.onMapMoveEndSBS);
                    self.sideBySideMap.on("mouseover", self.onMapMouseoverSBS);
                    self.sideBySideMap.on("mouseout", self.onMapMouseoutSBS);
                    self.sideBySideMap.on("zoomend", self.onMapZoomSBS);
                }
                self.updateMapPosition();
            });

        $("#sbspanel").stop(true).hide().delay(500).fadeIn(200);

        self.hideReportView();

    }

    this.disableSideBySide = function () {
        self.sideBySideMapContainer = $("#mapClone");
        //$("#sbspanel").css("display", "none");

        self.sideBySide = false;
        $("#mapCloneContainer").stop().animate({ "width": "0%" }, 500)
            .promise().done(function () {
                $("#mapCloneContainer").css("display", "none");
            });

        $("#sbspanel").stop(true).fadeOut(200);

    }

    this.cloneLayer = function (layerWrapper) {
        switch (layerWrapper.layerType) {
            case "rectangle":
                return this.cloneRectangle(layerWrapper.layer);
                break;
            case "polygon":
                return this.clonePolygon(layerWrapper.layer);
                break;
        }
    };

    this.cloneRectangle = function (layer) {
        this.selectionData = {
            latitude1: layer._latlngs[1].lat,
            longitude1: layer._latlngs[1].lng,
            latitude2: layer._latlngs[3].lat,
            longitude2: layer._latlngs[3].lng
        };
        this.queryMode = com.capstone.Query.TaxisInRange;
        var bounds = [[layer._latlngs[0].lat, layer._latlngs[0].lng], [layer._latlngs[2].lat, layer._latlngs[2].lng]];
        return L.rectangle(bounds, layer.options);
    };

    this.clonePolygon = function (layer) {
        this.selectionData = {
            points : []
        };
        for (var i = 0; i < layer._latlngs.length; i++) {
            this.selectionData.points.push({ Latitude : layer._latlngs[i].lat, Longitude : layer._latlngs[i].lng });
        }

        this.queryMode = com.capstone.Query.TaxisInPolygon;
        return L.polygon(layer._latlngs);
    };

    this.cloneCircle = function (layer) {
        this.selectionData = {
            points: []
        };
        for (var i = 0; i < layer._latlngs.length; i++) {
            this.selectionData.points.push({ Latitude: layer._latlngs[i].lat, Longitude: layer._latlngs[i].lng });
        }

        this.queryMode = com.capstone.Query.TaxisInPolygon;
        return L.polygon(layer._latlngs);
    };

    // ---------------------------------------
    // REPORT FUNCTIONS
    // ---------------------------------------
    this.updateMapPosition = function () {
        self.map.invalidateSize(true);

        if (self.sideBySide) {
            self.updateMap2();

            // The lat/lng gets messed up when zooming only.
            setTimeout(function () {
                self.updateMap2();
            }, 200);
        }
    }

    this.showReportView = function () {
        com.capstone.mapStateOpen = false;
        $("#report").css("display", "block");
        var recenterMap = true;
        if (self.sideBySide) recenterMap = false;
        self.disableSideBySide();
       
        com.capstone.ReportController.updateChart(this.activeMapQueries);

        // Stop any active animation and begin the new animation.
        $("#report").stop().animate({ "width": "50%" }, 400, function () {
            $("#report").css("display", "block");
        });

        $('#map').stop().animate({ "width": "50%" }, 400, function () {
            if (recenterMap) self.updateMapPosition();
        });
    };

    this.hideReportView = function () {
        com.capstone.mapStateOpen = true;
        $('#map').stop().animate({ "width": "100%" }, 400, function () {
            if (!self.sideBySide) self.updateMapPosition();
        });

        // Stop any active animation and begin the new animation.
        $("#report").stop().animate({ "width": "0%" }, 400, function () {
            $("#report").css("display", "none");
        });
    };

    this.toggleReportView = function () {
        if (!com.capstone.mapStateOpen) {
            self.hideReportView();
        }
        else {
            self.showReportView();
        }
    };

    this.InitMap();
}

$(document).ready(function () {

    // Prevent the map from taking commands when user clicks on the overlay.
    $(".hud,.bottomPanel,.bottomRightPanel,.bottomMiddlePanel").on("click", com.capstone.StopPropogation)
    .on("dblclick", com.capstone.StopPropogation)
    .on("mousedown", com.capstone.StopPropogation);

    // Set up the map controller. Save for future reference.
    com.capstone.mapController = new com.capstone.MapController('map');
    com.capstone.ReportController = new com.capstone.ReportController('report', com.capstone.mapController);

    // Bind the button's click event. (SAMPLE)
    $('#reportView').on("click", com.capstone.mapController.toggleReportView);

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

    var excludeElements = [$("#map").get(0), $(".main_overlay").get(0)];
    $(".hud").each(function () {
        excludeElements.push($(this).get(0));
    });

    $("#datestart, #dateend, #sbsdatestart, #sbsdateend").datetimepicker({
        changeMonth: false,
        changeYear: false,
        closeOnWithoutClick: true,
        maxDate: new Date(2013, 0, 31, 0, 0, 0, 0, 0),
        minDate: new Date(2013, 0, 1, 0, 0, 0, 0, 0),
        format: "m/d/Y h:i:s a",
        step: 10,
        closeMonitors: excludeElements
    });

    $("#area").val(com.capstone.mapController.radius);

    $("#area").on("change", function () {
        com.capstone.mapController.radius = $(this).val();
    });

    $("#draw_selection").prop('checked', com.capstone.mapController.draw_selection);

    $("#lock_view").prop('checked', com.capstone.mapController.sideBySideLocked);

    $("#selectMode").on("change", function () {
        com.capstone.mapController.updateSelectionMode($(this).val());
        if ($("#selectMode").val() == "trip") {
            $("#filterSelection").val("pick");
            $("#filterSelection").prop('disabled', 'disabled');
            com.capstone.mapController.clear();
        } else {
            $("#filterSelection").removeAttr('disabled');
        }
    });

    $("#draw_selection").on("change", function () {
        com.capstone.mapController.setDrawingMode($(this).is(':checked'));
    });

    $("#sideBySideLocked").on("click", com.capstone.mapController.toggleSideBySideLocked);

});