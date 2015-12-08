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

    this.graph = function (val) {
        for (var i in this.reportList) {
            if (this.reportList[i].title == com.capstone.ReportFilter.chart[Number(val)].filter) {
                return;
            }
        }
        var report = new com.capstone.ReportFilter.chart[Number(val)].type(this.container,
            {
                canvasJS: {
                    title: { text: com.capstone.ReportFilter.chart[Number(val)].title },
                    axisY: { suffix: com.capstone.ReportFilter.chart[Number(val)].ySuffix },
                    axisX: { prefix: com.capstone.ReportFilter.chart[Number(val)].xPrefix, labelAngle: 45 }
                }
            },
            com.capstone.ReportFilter.chart[Number(val)].filter,
            com.capstone.ReportFilter.chart[Number(val)].multi);
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

com.capstone.ReportFilter.AverageSpeed = function (report, type) {
    var dataSet = [
    ];
    if (type == undefined) type = "";
    var queries = com.capstone.mapController.activeMapQueries;
    var axis = 0;
    for (var i in queries) {
        var totalSpeed = 0;
        var count = 0;
        var outliers = 0;
        // Sum the speed and divide by total
        var resultObject = queries[i].QueryResults;
        if (type == "sbs")
            resultObject = queries[i].QueryResultsSBS;

        for (var j in resultObject) {
            var result = resultObject[j];
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
            label: queries[i].queryID,
            color: queries[i].BorderColor
        });
    }

    return dataSet;
}

com.capstone.ReportFilter.TripsPerQuery = function (report, type) {
    var dataSet = [
    ];
    var axis = 0;
    var queries = com.capstone.mapController.activeMapQueries;
    for (var i in queries) {
        dataSet.push({
            x: axis++,
            y: (type == "sbs") ? queries[i].QueryResultsSBS.length : queries[i].QueryResults.length,
            label: queries[i].queryID,
            color: queries[i].BorderColor
        });
    }
    return dataSet;
}

com.capstone.ReportFilter.AverageDistance = function (report, type) {
    var dataSet = [
    ];
    var axis = 0;
    var queries = com.capstone.mapController.activeMapQueries;
    for (var i in queries) {
        var totalDistance = 0;
        var count = 0;

        var resultObject = queries[i].QueryResults;
        if (type == "sbs")
            resultObject = queries[i].QueryResultsSBS;

        for (var j in resultObject) {
            var result = resultObject[j];
            totalDistance += Math.ceil(result.Distance);
            count++;
        }
        dataSet.push({
            x: axis++,
            y: totalDistance / count,
            label: queries[i].queryID,
            color: queries[i].BorderColor
        });
    }

    return dataSet;
}

com.capstone.ReportFilter.AveragePassengers = function (report, type) {
    var dataSet = [
    ];
    var axis = 0;
    var queries = com.capstone.mapController.activeMapQueries;
    for (var i in queries) {
        var totalPassengers = 0;
        var count = 0;

        var resultObject = queries[i].QueryResults;
        if (type == "sbs")
            resultObject = queries[i].QueryResultsSBS;

        for (var j in resultObject) {
            var result = resultObject[j];
            totalPassengers += result.Passengers;
            count++;
        }
        dataSet.push({
            x: axis++,
            y: totalPassengers / count,
            label: queries[i].queryID,
            color: queries[i].BorderColor
        });
    }

    return dataSet;
}

com.capstone.ReportFilter.AverageTime = function (report, type) {
    var dataSet = [
    ];
    var axis = 0;
    var queries = com.capstone.mapController.activeMapQueries;
    for (var i in queries) {
        var totalTime = 0;
        var count = 0;

        var resultObject = queries[i].QueryResults;
        if (type == "sbs")
            resultObject = queries[i].QueryResultsSBS;

        for (var j in resultObject) {
            var result = resultObject[j];
            totalTime += (result.Duration / 60);
            count++;
        }
        dataSet.push({
            x: axis++,
            y: totalTime / count,
            label: queries[i].queryID,
            color: queries[i].BorderColor
        });
    }

    return dataSet;
}

com.capstone.ReportFilter.AverageSpeedPerDriver = function (report, type) {
    var dataSet = [
    ];
    if (type == "sbs") return dataSet;
    var drivers = {};
    var axis = 0;
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

com.capstone.ReportFilter.VendorTotals = function (report, type) {
    var dataSet = [
    ];
    var localVTSTotal = 0;
    var localCMTTotal = 0;
    var queries = com.capstone.mapController.activeMapQueries;
    for (var i in queries) {
        var resultObject = queries[i].QueryResults;
        if (type == "sbs")
            resultObject = queries[i].QueryResultsSBS;

        for (var j in resultObject) {
            var result = resultObject[j];
            if (result.VendorID == "VTS") { localVTSTotal++; }
            else { localCMTTotal++; }
        }        
    }
    dataSet.push({
        y: localVTSTotal,
        label: "VTS"
    });
    dataSet.push({
        y: localCMTTotal,
        label: "CMT"
    });
    return dataSet;
}




com.capstone.ReportFilter.PassengerDistance = function (report, type) {
    var dataSet = [
    ];
    var axis = 0;
    var queries = com.capstone.mapController.activeMapQueries;
    for (var i in queries) {
        var totalPassengers = 0;
        var count = 0;
        var totalDistance = 0;
        var countD = 0;

        var resultObject = queries[i].QueryResults;
        if (type == "sbs")
            resultObject = queries[i].QueryResultsSBS;

        for (var j in resultObject) {
            var result = resultObject[j];
            totalPassengers += result.Passengers;
            count++;

            var resultD = resultObject[j];
            totalDistance += Math.ceil(result.Distance);
            countD++;
        }
        dataSet.push({
            x: axis++,
            y: totalPassengers / totalDistance,
            label: queries[i].queryID,
            color: queries[i].BorderColor
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
            xPrefix: "",
            multi: true
        },
        {
            filter: com.capstone.ReportFilter.TripsPerQuery,
            type: com.capstone.Report.ColumnGraph,
            title: "Trips Per Query",
            ySuffix: "",
            xPrefix: "",
            multi: true
        },
        {
            filter: com.capstone.ReportFilter.AverageDistance,
            type: com.capstone.Report.ColumnGraph,
            title: "Average Distance",
            ySuffix: " miles",
            xPrefix: " ",
            multi: true
        },
        {
            filter: com.capstone.ReportFilter.AveragePassengers,
            type: com.capstone.Report.ColumnGraph,
            title: "Average Passengers",
            ySuffix: "",
            xPrefix: "",
            multi: true
        },
        {
            filter: com.capstone.ReportFilter.AverageTime,
            type: com.capstone.Report.ColumnGraph,
            title: "Average Time",
            ySuffix: " min",
            xPrefix: "",
            multi: true
        },
        {
            filter: com.capstone.ReportFilter.AverageSpeedPerDriver,
            type: com.capstone.Report.ColumnGraph,
            title: "Average Speed Per Driver",
            ySuffix: " mph",
            xPrefix: "",
            multi: false
        },
        {
            filter: com.capstone.ReportFilter.VendorTotals,
            type: com.capstone.Report.PieGraph,
            title: "Points per Vendor",
            ySuffix: "",
            xPrefix: "",
            multi: false
        },


        {
            filter: com.capstone.ReportFilter.PassengerDistance,
            type: com.capstone.Report.ColumnGraph,
            title: "Average Passengers per Distance",
            ySuffix: "ppd",
            xPrefix: "",
            multi: true
},



    ];

    $("#selectChart").empty();
    for (var chart in com.capstone.ReportFilter.chart) {
        $("<option value=" + chart + ">" + com.capstone.ReportFilter.chart[chart].title + "</option>").appendTo($("#selectChart"));
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