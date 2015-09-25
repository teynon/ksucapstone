var com = com || {};
com.capstone = com.capstone || {};

// MapQuery uses a QueryFunction object. The query function object will need to be
// standardized so that they all accept the same arguments.
com.capstone.MapQuery = function (controller, queryFunction, queryData, selectionMap) {
    var query = this;
    this.QueryFunction = queryFunction;
    this.QueryData = queryData;
    this.QueryResults = [];
    this.SpawnedQueries = 0;
    this.CompletedQueries = 0;
    this.ResultCount = 0;
    this.MapController = controller;
    this.MapSelectionLayer = selectionMap;
    this.MapResultsLayer = L.layerGroup();
    this.MapLabelLayer = L.layerGroup();
    this.MapResults2Layer = L.layerGroup();
    this.MapSelectionShown = true;
    this.LoadingTimer = null;
    this.Abort = false;
    this.MapController.mapFeatureGroup.addLayer(this.MapSelectionLayer);
    this.DrawMode = queryData.filterSelection;

    this.LabelLatLng = this.MapSelectionLayer._latlngs[0];

    this.Playback = {};
    this.Playback.Start = new Date(queryData.start);
    this.Playback.End = new Date(queryData.stop);

    this.MapController.map.addLayer(this.MapResultsLayer);
    this.MapController.map.addLayer(this.MapLabelLayer);
    if (this.MapController.sideBySide) {
        this.MapController.sideBySideMap.addLayer(this.MapResults2Layer);
    }

    this.getPlaybackSpan = function () {
        var segments = this.MapController.PlaybackFrames;

        // Divide the time span for this query into the appropriate segments.
        var dateRangePerSegment = (this.Playback.End.getTime() - this.Playback.Start.getTime()) / segments;

        var startTime = this.Playback.Start.getTime() + (this.MapController.PlaybackPosition * dateRangePerSegment);

        var endTime = startTime + dateRangePerSegment;

        var startEST = new Date(startTime);
        var endEST = new Date(endTime);

        startTime = this.ConvertUTC(startEST);
        endTime = this.ConvertUTC(endEST);

        return { start: startTime, startEST: startEST, stop: endTime, stopEST: endEST };
    }

    this.ConvertUTC = function (date) {
        return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
    }

    this.DrawFrame = function () {
        var timeRange = this.getPlaybackSpan();

        this.MapResultsLayer.clearLayers();
        this.MapLabelLayer.clearLayers();

        var points = [];

        var icon = L.icon({
            iconUrl: 'Content/images/invisible_marker.png',
            iconSize: [0, 0],
            labelAnchor: [-10, 20]
        });

        var textRange = timeRange.startEST.format("m-d-Y h:i:s a") + " - " + timeRange.stopEST.format("m-d-Y h:i:s a");
        this.MapLabelLayer.addLayer(L.marker(query.MapSelectionLayer._latlngs[0], { "icon": icon } ).bindLabel(textRange, { noHide: true }));

        //console.log("Range: " + timeRange.start + ":" + new Date(timeRange.start).toISOString() + " to " + timeRange.stop + ":" + new Date(timeRange.stop).toISOString());

        for (var i = 0; i < this.QueryResults.length; i++) {
            var puTime = new Date(this.QueryResults[i].PickupTime).getTime();
            if (puTime >= timeRange.start && puTime < timeRange.stop) {
                points.push(this.QueryResults[i]);
            }
        }

        this.UpdateMap(points);
    }
    
    // Play the query.
    this.Play = function () {
        com.capstone.UI.setStatus("Loading results...");
        this.QueryFunction.call(this, queryData, this.OnQuery);

        // Start blinking the selection layer until results are processed.
        this.LoadingTimer = setInterval(function () {
            if (query.MapSelectionShown)
                query.MapController.map.removeLayer(query.MapSelectionLayer);
            else
                query.MapController.map.addLayer(query.MapSelectionLayer);

            query.MapSelectionShown = !query.MapSelectionShown;
        }, 250);
    };

    this.UpdateMap = function (points) {
        
        for (var i = 0; i < points.length; i++) {
            switch (this.DrawMode) {
                case "pick":
                    var latlng = L.latLng(points[i].PickupLatitude, points[i].PickupLongitude);
                    this.AddPoint(latlng, 2, {
                        color: 'green',
                        fillColor: '#f03',
                        fillOpacity: 0.25
                    });
                    break;
                case "drop":
                    var latlng = L.latLng(points[i].DropoffLatitude, points[i].DropoffLongitude);
                    this.AddPoint(latlng, 2, {
                        color: 'orange',
                        fillColor: '#A03',
                        fillOpacity: 0.25
                    });
                    break;
                case "both":
                    var latlng = L.latLng(points[i].PickupLatitude, points[i].PickupLongitude);
                    if (this.SelectionHitTest(latlng)) {
                        latlng = L.latLng(points[i].PickupLatitude, points[i].PickupLongitude);
                        this.AddPoint(latlng, 2, {
                            color: 'green',
                            fillColor: '#f03',
                            fillOpacity: 0.25
                        });
                    }
                    else if(!this.SelectionHitTest(latlng)){
                        latlng = L.latLng(points[i].DropoffLatitude, points[i].DropoffLongitude);
                        this.AddPoint(latlng, 2, {
                            color: 'orange',
                            fillColor: '#FF9900',
                            fillOpacity: 0.25
                        });
                    }
                default:
                    break;
            }
            
            if (query.MapController.sideBySide) {
                query.MapResults2Layer.addLayer(L.circle(latlng, 2, {
                    color: 'green',
                    fillColor: '#f03',
                    fillOpacity: 0.25
                }));
            }
        }
    };

    this.AddPoint = function (latlng, radius, properties) {
        query.MapResultsLayer.addLayer(L.circle(latlng, radius, properties));
    }

    // When the results come back, display it on the map.
    this.OnQuery = function (result) {
        if (!query.Abort) {
            query.CompletedQueries++;
            var remaining = (query.SpawnedQueries - query.CompletedQueries);
            var remainingText = (remaining > 0) ? " (" + remaining + " queries remaining)" : "";
            // Draw the query data on the map.
            //query.MapResultsLayer.clearLayers();

            if (result.Data && result.Data.length > 0) {
                query.QueryResults = $.merge(query.QueryResults, result.Data);
                query.ResultCount += result.Count;
                com.capstone.UI.setStatus("Rendering " + query.ResultCount + " results." + remainingText);
                setTimeout(function () {
                    query.UpdateMap(result.Data);

                    com.capstone.UI.setStatus("Displaying " + query.ResultCount + " results." + remainingText);

                    query.stopFlashingSelection();
                }, 100);
            }
            else {
                com.capstone.UI.setStatus("No Results.");
                query.stopFlashingSelection();
            }
        }
    }

    this.stopFlashingSelection = function () {
        clearInterval(query.LoadingTimer);
        query.LoadingTimer = null;

        if (!query.MapSelectionShown)
            query.MapController.map.addLayer(query.MapSelectionLayer);

        query.MapSelectionShown = true;
    }

    this.SelectionHitTest = function (latlng) {
        var hitTest = false;
        var layerlatLng = query.MapSelectionLayer._latlngs;
        if (latlng.lat <= layerlatLng[1].lat && latlng.lat >= layerlatLng[3].lat && latlng.lng >= layerlatLng[1].lng && latlng.lng <= layerlatLng[3].lng) {
            hitTest = true;
        }

        return hitTest;
    }

    this.Dispose = function () {
        this.MapResultsLayer.clearLayers();
        this.MapController.map.removeLayer(this.MapSelectionLayer);
        this.MapController.map.removeLayer(this.MapResultsLayer);
    }

    this.Play();
}

// --------------------------
// QUERIES
// --------------------------
Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}

com.capstone.Query = {};
com.capstone.Query.TaxisInRange = function (data, callback) {
    var startDate = new Date(data.start);
    var endDate = new Date(data.stop);

    if(startDate < endDate) {
        this.SpawnedQueries++;
        var stopTime = new Date(startDate.getTime()).addHours(12);

        if (stopTime > endDate)
            stopTime = endDate;

        var dataToSend = $.extend(true, {}, data);
        dataToSend.start = startDate.toISOString();
        dataToSend.stop = stopTime.toISOString();

        $.getJSON("http://localhost:63061/Query/GetTaxisAtLocation", dataToSend, function (result) {
            callback.call(this, result);
        });

        startDate = startDate.addHours(12);
    }
    else {
        window.alert("The From date and time must be before the To date and time");
        stopFlashingSelection();
        return;
    }
}