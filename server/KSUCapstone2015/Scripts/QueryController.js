var com = com || {};
com.capstone = com.capstone || {};

// MapQuery uses a QueryFunction object. The query function object will need to be
// standardized so that they all accept the same arguments.
com.capstone.MapQuery = function (controller, queryFunction, queryData, selectionMap) {
    var query = this;
    this.QueryFunction = queryFunction;
    this.QueryData = queryData;
    this.QueryResults = null;
    this.MapController = controller;
    this.MapSelectionLayer = selectionMap;
    this.MapResultsLayer = L.layerGroup();
    this.MapSelectionShown = true;
    this.LoadingTimer = null;
    this.Abort = false;

    this.MapController.map.addLayer(this.MapResultsLayer);

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

    // When the results come back, display it on the map.
    this.OnQuery = function (result) {
        if (!query.Abort) {
            clearInterval(query.LoadingTimer);
            query.LoadingTimer = null;

            if (!query.MapSelectionShown)
                query.MapController.map.addLayer(query.MapSelectionLayer);

            query.MapSelectionShown = true;

            query.QueryResults = result;

            // Draw the query data on the map.
            query.MapResultsLayer.clearLayers();

            if (result.Data && result.Data.length > 0) {
                com.capstone.UI.setStatus("Rendering " + result.Count + " results.");

                var points = [];
                for (var i = 0; i < result.Data.length; i++) {
                    var latlng = L.latLng(result.Data[i].PickupLatitude, result.Data[i].PickupLongitude);
                    query.MapResultsLayer.addLayer(L.circle(latlng, 2, {
                        color: 'green',
                        fillColor: '#f03',
                        fillOpacity: 0.25
                    }));
                }

                com.capstone.UI.setStatus("Displaying " + result.Count + " results.");
            }
            else
                self.setStatus("No Results.");
        }
    }

    this.Play();
}

// --------------------------
// QUERIES
// --------------------------

com.capstone.Query = {};
com.capstone.Query.PickupsInRange = function (data, callback) {
    $.getJSON("http://localhost:63061/Query/PickupsAtLocation", data, function (result) {
        callback(result);
    });
}