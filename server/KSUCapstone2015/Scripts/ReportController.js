var com = com || {};
com.capstone = com.capstone || {};

com.capstone.ReportController = function (reportid) {
    // Closure
    var self = this;

    // DIV ID for report
    this.reportID = reportid;
    this.reportList = [];
    this.container = $("#chartView");

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
    this.VTSTotal = 0;
    this.CMTTotal = 0;

    this.graph = function (val) {
        for (var i in this.reportList) {
            if (this.reportList[i].title == com.capstone.ReportFilter.chart[Number(val)].filter) {
                return;
            }
        }
        var report = new com.capstone.ReportFilter.chart[Number(val)].type(this.container, {
            canvasJS: {
                title: { text: com.capstone.ReportFilter.chart[Number(val)].title },
                axisY: { suffix: com.capstone.ReportFilter.chart[Number(val)].ySuffix },
                axisX: { prefix: com.capstone.ReportFilter.chart[Number(val)].xPrefix }
            }
        }, com.capstone.ReportFilter.chart[Number(val)].filter, false);
        report.update(false);
        this.reportList.push({ title: com.capstone.ReportFilter.chart[Number(val)].filter, report: report });
    };

    this.updateChart = function () {
        for (var i in this.reportList) {
            this.reportList[i].report.update();
        }
    };

    this.removeQuery = function (id) {
        for (var i in this.reportList) {
            this.reportList[i].report.update();
        }
        return;
        self.dataPoints.slice(id, 1);
        self.chart.options.data[0].dataPoints = self.dataPoints;
        self.chart.render();
    }

    this.clearChart = function () {
        for (var i in this.reportList) {
            this.reportList[i].report.update();
        }
        return;
        self.dataPoints = [];
        self.chart.options.data[0].dataPoints = self.dataPoints;
        self.chart.render();
    }

    this.clearAll = function () {
        this.reportList = [];
        $("#chartView").html("");
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
            label: "Query " + queries[i].queryID
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
            label: "Query " + queries[i].queryID
        });
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
            label: "Query " + queries[i].queryID
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
            label: "Query " + queries[i].queryID
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
            totalTime += (result.Duration / 60);
            count++;
        }
        dataSet.push({
            y: totalTime / count,
            label: "Query " + queries[i].queryID
        });
    }

    return dataSet;
}

com.capstone.ReportFilter.AverageSpeedPerDriver = function () {
    var dataSet = [
    ];
    var drivers = {};

    var queries = com.capstone.mapController.activeMapQueries;
    queries.forEach(function (query) {
        query.QueryResults.forEach(function (queryResult) {
            if (!drivers[queryResult.DriverID]) {
                drivers[queryResult.DriverID] = {
                    distance: queryResult.Distance,
                    duration: queryResult.Duration
                }
            } else {
                drivers[queryResult.DriverID].distance += queryResult.Distance;
                drivers[queryResult.DriverID].duration += queryResult.Duration;
            }
        });
    });
    var counter = 1;
    for (driverID in drivers) {
        var speed = drivers[driverID].distance / (drivers[driverID].duration / 3600);
        if (speed < com.capstone.SpeedLimit) {
            dataSet.push({
                y: speed,
                label: "Driver " + counter
            });
            ++counter;
        }
    }

    return dataSet;
}

com.capstone.ReportFilter.VendorTotals = function () {
    var dataSet = [
    ];
    var queries = com.capstone.mapController.activeMapQueries;
    for (var i in queries) {
        for (var j in queries[i].QueryResults) {
            var result = queries[i].QueryResults[j];
            if (result.VendorID = "VTS") { this.VTSTotal++; }
            else { CMTTotal++; }

        }
        dataSet.push({
            y: this.VTSTotal,
            label: "VTS:"
        });
        dataSet.push({
            y: this.CMTTotal,
            label: "CMT:"
        });
    }

    return dataSet;
}




com.capstone.ReportFilter.PassengerDistance = function () {
    var dataSet = [
    ];
    var queries = com.capstone.mapController.activeMapQueries;
    for (var i in queries) {
        var totalPassengers = 0;
        var count = 0;
        var totalDistance = 0;
        var countD = 0;


        for (var j in queries[i].QueryResults) {
            var result = queries[i].QueryResults[j];
            totalPassengers += result.Passengers;
            count++;

            var resultD = queries[i].QueryResults[j];
            totalDistance += Math.ceil(result.Distance);
            countD++;
        }
        dataSet.push({
            y: totalPassengers / totalDistance,
            label: "Query " + queries[i].queryID
        });
    }

    return dataSet;
}





$(document).ready(function () {
    com.capstone.ReportFilter.chart = [
        {
            filter: com.capstone.ReportFilter.AverageSpeed,
            type: com.capstone.Report.ColumnGraph,
            title: "Average Speed",
            ySuffix: " mph",
            xPrefix: ""
        },
        {
            filter: com.capstone.ReportFilter.TripsPerQuery,
            type: com.capstone.Report.ColumnGraph,
            title: "Trips Per Query",
            ySuffix: "",
            xPrefix: ""
        },
        {
            filter: com.capstone.ReportFilter.AverageDistance,
            type: com.capstone.Report.ColumnGraph,
            title: "Average Distance",
            ySuffix: " miles",
            xPrefix: " "
        },
        {
            filter: com.capstone.ReportFilter.AveragePassengers,
            type: com.capstone.Report.ColumnGraph,
            title: "Average Passengers",
            ySuffix: "",
            xPrefix: ""
        },
        {
            filter: com.capstone.ReportFilter.AverageTime,
            type: com.capstone.Report.ColumnGraph,
            title: "Average Time",
            ySuffix: " min",
            xPrefix: ""
        },
        {
            filter: com.capstone.ReportFilter.AverageSpeedPerDriver,
            type: com.capstone.Report.ColumnGraph,
            title: "Average Speed Per Driver",
            ySuffix: " mph",
            xPrefix: ""
        },
        {
            filter: com.capstone.ReportFilter.VendorTotals,
            type: com.capstone.Report.PieGraph,
            title: "Taxi Vendor Totals",
            ySuffix: "",
            xPrefix: ""
        },


        {
            filter: com.capstone.ReportFilter.PassengerDistance,
            type: com.capstone.Report.ColumnGraph,
            title: "Average Passengers per Distance",
            ySuffix: "ppd",
            xPrefix: ""
},



    ];

    $("#selectChart").empty();
    for (var chart in com.capstone.ReportFilter.chart) {
        $("<option value=" + chart + ">" + com.capstone.ReportFilter.chart[chart].title + "</option>").appendTo($("#selectChart"));
        console.log(chart);
    }

    $("#selectChart").on("change", function () {
        if (com.capstone.mapController.ReportController == null) {
            com.capstone.mapController.ReportController = new com.capstone.ReportController('chartView');
        }
        com.capstone.mapController.ReportController.graph($("#selectChart").val());
        com.capstone.mapController.activeMapQueries.forEach(function (query) {
            com.capstone.mapController.ReportController.updateChart(query.QueryResults);
        });
    });

    $("#clearGraphs").on("click", function () {
        com.capstone.mapController.ReportController.clearAll();
    });
})