var com = com || {};
com.capstone = com.capstone || {};

com.capstone.ReportController = function (reportid) {
    // Closure
    var self = this;

    // DIV ID for report
    this.reportID = reportid;
    this.reportList = [];
    this.container = $("#chartContainer");

    this.chart = null;
    this.dataPoints = [];
    this.title = null;
    this.subTitle = null;
    this.type = null;
    this.xTitle = null;
    this.yTitle = null;
    this.xSuffix = null;
    this.ySuffix = null;
    this.xPrefix = null;
    this.toolTip = null;
    this.counter = 1;

    this.graph = function (val) {
        var report = new com.capstone.ReportFilter.chart[Number(val)].type(this.container, {
            canvasJS: {
                title: { text: com.capstone.ReportFilter.chart[Number(val)].title },
                axisY: { suffix: com.capstone.ReportFilter.chart[Number(val)].ySuffix  },
                axisX: { prefix: com.capstone.ReportFilter.chart[Number(val)].xPrefix }
            }
        }, com.capstone.ReportFilter.chart[Number(val)].filter, false);
        report.update(false);
        this.reportList.push(report);
    };

    this.updateChart = function (QueryResults) {
        for (var i in this.reportList) {
            this.reportList[i].update();
        }
    };


    this.pieChart = function (title, yData) {
        self.title = title;
        /*var passengers = 0;
        var count = 0;
        yData.forEach(function (result) {
            passengers += result.Passengers;
            count++;
        });
        passengers = passengers / count;
        self.dataPoints.push({ label: self.counter, y: passengers });
        self.counter++;*/
    }

    this.removeQuery = function (id) {
        for (var i in this.reportList) {
            this.reportList[i].update();
        }
        return;
        self.dataPoints.slice(id, 1);
        self.chart.options.data[0].dataPoints = self.dataPoints;
        self.counter--;
        self.chart.render();
    }

    this.clearChart = function () {
        for (var i in this.reportList) {
            this.reportList[i].update();
        }
        return;
        self.dataPoints = [];
        self.chart.options.data[0].dataPoints = self.dataPoints;
        self.counter = 1;
        self.chart.render();
    }
}

com.capstone.SpeedLimit = 100;
com.capstone.ReportFilter = {};

com.capstone.ReportFilter.AverageSpeed = function () {
    var dataSet = [
    ];
    var queries = com.capstone.mapController.activeMapQueries;
    for (var i in queries) {
        var totalSpeed = 0;
        var count = 0;
        var outliers = 0;
        // Sum the speed and divide by total
        for (var j in queries[i].QueryResults) {
            var result = queries[i].QueryResults[j];
            var speed = Math.ceil(result.Distance / (result.Duration / 3600));
            if (speed < com.capstone.SpeedLimit) {
                totalSpeed += speed;
                count++;
            }
            else {
                outliers++;
            }
        }
        
        // Average speed.

        dataSet.push({
            y: totalSpeed / count,
            label: queries[i].queryID
        });
    }
    
    return dataSet;
}

com.capstone.ReportFilter.TripsPerQuery = function () {
    var dataSet = [
    ];
    var queries = com.capstone.mapController.activeMapQueries;
    for (var i in queries) {
        dataSet.push({
            y: queries[i].QueryResults.length,
            label: queries[i].queryID});
    }
    return dataSet;
}

com.capstone.ReportFilter.AverageDistance = function () {
    var dataSet = [
    ];
    var queries = com.capstone.mapController.activeMapQueries;
    for (var i in queries) {
        var totalDistance = 0;
        var count = 0;

        for (var j in queries[i].QueryResults) {
            var result = queries[i].QueryResults[j];
            totalDistance += Math.ceil(result.Distance);
            count++;
        }
        dataSet.push({
            y: totalDistance / count,
            label: queries[i].queryID
        });
    }

    return dataSet;
}

com.capstone.ReportFilter.AveragePassengers = function () {
    var dataSet = [
    ];
    var queries = com.capstone.mapController.activeMapQueries;
    for (var i in queries) {
        var totalPassengers = 0;
        var count = 0;

        for (var j in queries[i].QueryResults) {
            var result = queries[i].QueryResults[j];
            totalPassengers += result.Passengers;
            count++;
        }
        dataSet.push({
            y: totalPassengers / count,
            label: queries[i].queryID
        });
    }

    return dataSet;
}

com.capstone.ReportFilter.AverageTime = function () {
    var dataSet = [
    ];
    var queries = com.capstone.mapController.activeMapQueries;
    for (var i in queries) {
        var totalTime = 0;
        var count = 0;

        for (var j in queries[i].QueryResults) {
            var result = queries[i].QueryResults[j];
            totalTime += result.Duration;
            count++;
        }
        dataSet.push({
            y: totalTime / count,
            label: queries[i].queryID
        });
    }

    return dataSet;
}


$(document).ready(function() { 
    com.capstone.ReportFilter.chart = [
        {
            filter: com.capstone.ReportFilter.AverageSpeed,
            type: com.capstone.Report.ColumnGraph,
            title: "Average Speed",
            ySuffix: " mph",
            xPrefix: " Query"
        },
        {
            filter: com.capstone.ReportFilter.TripsPerQuery,
            type: com.capstone.Report.ColumnGraph,
            title: "Trips Per Query",
            ySuffix: "",
            xPrefix: " Query"
        },
        {
            filter: com.capstone.ReportFilter.AverageDistance,
            type: com.capstone.Report.ColumnGraph,
            title: "Average Distance",
            ySuffix: " miles",
            xPrefix: " Query"
        },
        {
            filter: com.capstone.ReportFilter.AveragePassengers,
            type: com.capstone.Report.ColumnGraph,
            title: "Average Passengers",
            ySuffix: "",
            xPrefix: " Query"
        },
        {
            filter: com.capstone.ReportFilter.AverageTime,
            type: com.capstone.Report.ColumnGraph,
            title: "Average Time",
            ySuffix: " Seconds",
            xPrefix: " Query"
        }
    ]
})