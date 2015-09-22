﻿var com = com || {};
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
    this.MapSelectionShown = true;
    this.LoadingTimer = null;
    this.Abort = false;

    this.Playback = {};
    this.Playback.Start = new Date(queryData.start);
    this.Playback.End = new Date(queryData.stop);

    this.MapController.map.addLayer(this.MapResultsLayer);

    this.getPlaybackSpan = function () {
        var segments = this.MapController.PlaybackFrames;

        // Divide the time span for this query into the appropriate segments.
        var dateRangePerSegment = (this.Playback.End.getTime() - this.Playback.Start.getTime()) / segments;

        var startTime = this.Playback.Start.getTime() + (this.MapController.PlaybackPosition * dateRangePerSegment);

        var endTime = startTime + dateRangePerSegment;

        startTime = this.ConvertUTC(new Date(startTime));
        endTime = this.ConvertUTC(new Date(endTime));

        return { start: startTime, stop: endTime };
    }

    this.ConvertUTC = function (date) {
        return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
    }

    this.DrawFrame = function () {
        var timeRange = this.getPlaybackSpan();

        this.MapResultsLayer.clearLayers();

        var points = [];

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
            var latlng = L.latLng(points[i].PickupLatitude, points[i].PickupLongitude);
            query.MapResultsLayer.addLayer(L.circle(latlng, 2, {
                color: 'green',
                fillColor: '#f03',
                fillOpacity: 0.25
            }));
        }
    };

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
                    clearInterval(query.LoadingTimer);
                    query.LoadingTimer = null;

                    if (!query.MapSelectionShown)
                        query.MapController.map.addLayer(query.MapSelectionLayer);

                    query.MapSelectionShown = true;

                    com.capstone.UI.setStatus("Displaying " + query.ResultCount + " results." + remainingText);
                }, 100);
            }
            else
                com.capstone.UI.setStatus("No Results.");
        }
    }

    this.SelectionHitTest = function (e) {
        var hitTest = false;
        this.MapSelectionLayer.eachLayer(function (layer) {
            if (e.latlng.lat <= layer.getLatLngs()[1].lat && e.latlng.lat >= layer.getLatLngs()[3].lat && e.latlng.lng >= layer.getLatLngs()[1].lng && e.latlng.lng <= layer.getLatLngs()[3].lng) {
                hitTest = true;
            }
        });

        return hitTest;
    }

    this.Dispose = function () {
        this.MapSelectionLayer.clearLayers();
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
com.capstone.Query.PickupsInRange = function (data, callback) {
    var startDate = new Date(data.start);
    var endDate = new Date(data.stop);

    while (startDate < endDate) {
        this.SpawnedQueries++;
        var stopTime = new Date(startDate.getTime()).addHours(12);

        if (stopTime > endDate)
            stopTime = endDate;

        var dataToSend = $.extend(true, {}, data);
        dataToSend.start = startDate.toISOString();
        dataToSend.stop = stopTime.toISOString();

        $.getJSON("http://localhost:63061/Query/PickupsAtLocation", dataToSend, function (result) {
            callback.call(this, result);
        });

        startDate = startDate.addHours(12);
    }
}