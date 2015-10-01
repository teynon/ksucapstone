var com = com || {};
com.capstone = com.capstone || {};

// MapQuery uses a QueryFunction object. The query function object will need to be
// standardized so that they all accept the same arguments.
com.capstone.queryCount = 0;
com.capstone.MapQuery = function (controller, queryFunction, queryData, selectionMap, sideBySideSelectionMap) {
    var query = this;
    this.queryID = com.capstone.queryCount++;
    this.QueryFunction = queryFunction;
    this.QueryData = queryData;
    this.QueryResults = [];
    this.QueryResultsSBS = [];
    this.SpawnedQueries = 0;
    this.CompletedQueries = 0;
    this.ResultCount = 0;
    this.MapController = controller;
    this.MapSelectionLayer = selectionMap;
    this.SideBySideMapSelectionLayer = sideBySideSelectionMap;
    this.MapResultsLayer = L.layerGroup();
    this.MapLabelLayer = L.layerGroup();
    this.MapLabelLayerSBS = L.layerGroup();
    this.MapResults2Layer = L.layerGroup();
    this.MapSelectionShown = false;
    this.MapSelectionShownSBS = false;
    this.LoadingTimer = null;
    this.LoadingTimerSBS = null;
    this.Abort = false;
    //this.MapController.mapFeatureGroup.addLayer(this.MapSelectionLayer);
    this.DrawMode = queryData.filterSelection;
    this.DrawModeSBS = queryData.filterSelectionSBS;

    this.LabelLatLng = this.MapSelectionLayer._latlngs[0];

    this.Playback = {};
    this.Playback.Start = new Date(queryData.start);
    this.Playback.End = new Date(queryData.stop);
    this.Playback.StartSBS = null;
    this.Playback.EndSBS = null;

    this.MapController.map.addLayer(this.MapResultsLayer);
    this.MapController.map.addLayer(this.MapLabelLayer);
    if (this.MapController.sideBySide) {
        this.MapController.sideBySideMap.addLayer(this.SideBySideMapSelectionLayer);
        this.MapController.sideBySideMap.addLayer(this.MapResults2Layer);
        this.MapController.sideBySideMap.addLayer(this.MapLabelLayerSBS);
    }

    this.getPlaybackSpan = function (sideBySide) {
        var segments = this.MapController.PlaybackFrames;

        // Divide the time span for this query into the appropriate segments.
        var dateRangePerSegment = (this.Playback.End.getTime() - this.Playback.Start.getTime()) / segments;
        var startTime = this.Playback.Start.getTime() + (this.MapController.PlaybackPosition * dateRangePerSegment);
        if (sideBySide) {
            dateRangePerSegment = (this.Playback.EndSBS.getTime() - this.Playback.StartSBS.getTime()) / segments;
            startTime = this.Playback.StartSBS.getTime() + (this.MapController.PlaybackPosition * dateRangePerSegment);
        }


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
        var points = [];

        var icon = L.icon({
            iconUrl: 'Content/images/invisible_marker.png',
            iconSize: [0, 0],
            labelAnchor: [-10, 20]
        });

        var timeRange = this.getPlaybackSpan(false);

        this.MapResultsLayer.clearLayers();
        this.MapLabelLayer.clearLayers();

        //console.log("Range: " + timeRange.start + ":" + new Date(timeRange.start).toISOString() + " to " + timeRange.stop + ":" + new Date(timeRange.stop).toISOString());

        for (var i = 0; i < this.QueryResults.length; i++) {
            var puTime = new Date(this.QueryResults[i].PickupTime).getTime();
            if (puTime >= timeRange.start && puTime < timeRange.stop) {
                points.push(this.QueryResults[i]);
            }
        }

        var textRange = "(" + points.length + " results) " + timeRange.startEST.format("m-d-Y h:i:s a") + " - " + timeRange.stopEST.format("m-d-Y h:i:s a");
        this.MapLabelLayer.addLayer(L.marker(query.MapSelectionLayer._latlngs[0], { "icon": icon }).bindLabel(textRange, { noHide: true }));

        this.UpdateMap(points, false);

        // Again for side by side:
        if (query.MapController.sideBySide) {
            var points = [];

            var timeRange = this.getPlaybackSpan(true);

            this.MapResults2Layer.clearLayers();
            this.MapLabelLayerSBS.clearLayers();

            for (var i = 0; i < this.QueryResultsSBS.length; i++) {
                var puTime = new Date(this.QueryResultsSBS[i].PickupTime).getTime();
                if (puTime >= timeRange.start && puTime < timeRange.stop) {
                    points.push(this.QueryResultsSBS[i]);
                }
            }

            var textRange = "(" + points.length + " results) " + timeRange.startEST.format("m-d-Y h:i:s a") + " - " + timeRange.stopEST.format("m-d-Y h:i:s a");
            this.MapLabelLayerSBS.addLayer(L.marker(query.SideBySideMapSelectionLayer._latlngs[0], { "icon": icon }).bindLabel(textRange, { noHide: true }));

            this.UpdateMap(points, true);
        }
    }
    
    // Play the query.
    this.Play = function () {
        com.capstone.UI.setStatus("Loading results...");

        if (this.QueryFunction.call(this, queryData, this.OnQuery, false)) {
            // Start blinking the selection layer until results are processed.
            this.LoadingTimer = setInterval(function () {
                if (query.MapSelectionShown)
                    query.MapController.map.removeLayer(query.MapSelectionLayer);
                else
                    query.MapController.map.addLayer(query.MapSelectionLayer);

                query.MapSelectionShown = !query.MapSelectionShown;
            }, 250);

            if (query.MapController.sideBySide) {
                console.log("Side by side");
                // If side by side, get different date range.
                var sbsQueryData = $.extend({}, queryData);

                query.Playback.StartSBS = new Date($("#sbsdatestart").val());
                query.Playback.EndSBS = new Date($("#sbsdateend").val());
                sbsQueryData.start = $("#sbsdatestart").val();
                sbsQueryData.stop = $("#sbsdateend").val();
                sbsQueryData.filterSelection = sbsQueryData.filterSelectionSBS;

                if (query.QueryFunction.call(query, sbsQueryData, query.OnQuery, true)) {
                    // Start blinking the selection layer until results are processed.
                    query.LoadingTimerSBS = setInterval(function () {
                        if (query.MapSelectionShownSBS)
                            query.MapController.sideBySideMap.removeLayer(query.SideBySideMapSelectionLayer);
                        else
                            query.MapController.sideBySideMap.addLayer(query.SideBySideMapSelectionLayer);

                        query.MapSelectionShownSBS = !query.MapSelectionShownSBS;
                    }, 250);
                }
                else {
                    console.log("failed");
                }
            }
        }
        else {
            this.Dispose();
        }
    };

    this.UpdateMap = function (points, sideBySide) {
        var drawMode = (sideBySide) ? this.DrawModeSBS : this.DrawMode;
        
        for (var i = 0; i < points.length; i++) {
            switch (drawMode) {
                case "pick":
                    var latlng = L.latLng(points[i].PickupLatitude, points[i].PickupLongitude);
                    this.AddPoint(latlng, 2, {
                        color: 'green',
                        fillColor: '#f03',
                        fillOpacity: 0.25
                    }, sideBySide);
                    break;
                case "drop":
                    var latlng = L.latLng(points[i].DropoffLatitude, points[i].DropoffLongitude);
                    this.AddPoint(latlng, 2, {
                        color: 'orange',
                        fillColor: '#A03',
                        fillOpacity: 0.25
                    }, sideBySide);
                    break;
                case "both":
                    var latlng = L.latLng(points[i].PickupLatitude, points[i].PickupLongitude);
                    if (this.SelectionHitTest(latlng)) {
                        latlng = L.latLng(points[i].PickupLatitude, points[i].PickupLongitude);
                        this.AddPoint(latlng, 2, {
                            color: 'green',
                            fillColor: '#f03',
                            fillOpacity: 0.25
                        }, sideBySide);
                    }
                    else if(!this.SelectionHitTest(latlng)){
                        latlng = L.latLng(points[i].DropoffLatitude, points[i].DropoffLongitude);
                        this.AddPoint(latlng, 2, {
                            color: 'orange',
                            fillColor: '#FF9900',
                            fillOpacity: 0.25
                        }, sideBySide);
                    }
                default:
                    break;
            }
        }
    };

    this.AddPoint = function (latlng, radius, properties, sideBySide) {
        if (!sideBySide) {
            query.MapResultsLayer.addLayer(L.circle(latlng, radius, properties));
        }
        else {
            query.MapResults2Layer.addLayer(L.circle(latlng, radius, properties));
        }
    }

    // When the results come back, display it on the map.
    this.OnQuery = function (result, isSideBySide) {
        console.log("Query");
        console.log(result);
        console.log(isSideBySide);
        console.log("--");
        if (!query.Abort && result != -1) {
            query.CompletedQueries++;
            var remaining = (query.SpawnedQueries - query.CompletedQueries);
            var remainingText = (remaining > 0) ? " (" + remaining + " queries remaining)" : "";
            // Draw the query data on the map.
            //query.MapResultsLayer.clearLayers();

            if (result.Data && result.Data.length > 0) {
                if (!isSideBySide) {
                    query.QueryResults = $.merge(query.QueryResults, result.Data);
                }
                else {
                    query.QueryResultsSBS = $.merge(query.QueryResultsSBS, result.Data);
                }

                query.ResultCount += result.Count;
                com.capstone.UI.setStatus("Rendering " + query.ResultCount + " results." + remainingText);
                setTimeout(function () {
                    query.UpdateMap(result.Data, isSideBySide);

                    com.capstone.UI.setStatus("Displaying " + query.ResultCount + " results." + remainingText);

                    if (!isSideBySide) query.stopFlashingSelection();
                    else query.stopFlashingSelectionSBS();
                }, 100);
            }
            else {
                com.capstone.UI.setStatus("No Results.");
                if (!isSideBySide) query.stopFlashingSelection();
                else query.stopFlashingSelectionSBS();
            }
        }
        else if (result == -1) {
            query.stopFlashingSelection();
            query.stopFlashingSelectionSBS();
            query.Dispose();
        }
    }

    this.stopFlashingSelection = function () {
        clearInterval(query.LoadingTimer);
        this.LoadingTimer = null;

        if (!this.MapSelectionShown)
            this.MapController.map.addLayer(this.MapSelectionLayer);

        this.MapSelectionShown = true;
    }

    this.stopFlashingSelectionSBS = function () {
        clearInterval(query.LoadingTimerSBS);
        this.LoadingTimerSBS = null;

        if (!this.MapSelectionShownSBS)
            this.MapController.sideBySideMap.addLayer(this.SideBySideMapSelectionLayer);

        this.MapSelectionShownSBS = true;
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
        this.MapLabelLayer.clearLayers();
        this.MapResults2Layer.clearLayers();
        this.MapLabelLayerSBS.clearLayers();

        try {
            if (this.MapController.sideBySide) {
                this.MapController.sideBySideMap.removeLayer(this.SideBySideMapSelectionLayer);
                this.MapController.sideBySideMap.removeLayer(this.MapResults2Layer);
                this.MapController.sideBySideMap.removeLayer(this.MapLabelLayerSBS);
            }
        }
        catch (e) { }

        this.MapController.map.removeLayer(this.MapLabelLayer);
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
com.capstone.Query.TaxisInRange = function (data, callback, sideBySide) {
    var startDate = new Date(data.start);
    var endDate = new Date(data.stop);
    console.log(startDate + "|" + console.log(endDate));
    if (startDate > endDate) {
        window.alert("The From date and time must be before the To date and time");
        return false;
    }

    while (startDate < endDate) {
        this.SpawnedQueries++;
        var stopTime = new Date(startDate.getTime()).addHours(4);

        if (stopTime > endDate)
            stopTime = endDate;

        var dataToSend = $.extend(true, {}, data);
        dataToSend.start = startDate.toISOString();
        dataToSend.stop = stopTime.toISOString();

        $.getJSON("/Query/GetTaxisAtLocation", dataToSend, function (result) {
            callback.call(this, result, sideBySide);
        });

        startDate = startDate.addHours(4);
    }

    return true;
}