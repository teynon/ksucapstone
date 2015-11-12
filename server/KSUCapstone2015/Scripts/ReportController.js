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

    this.barGraph = function (title, subtitle, xTitle, yTitle, xSuffix, ySuffix, xPrefix, toolTip) {
        var report = new com.capstone.Report.ColumnGraph(this.container, { canvasJS: { title: { text: "Average Speed Per Query" }, axisY: { suffix: " mph" }, axisX: { prefix: "Query " }}}, com.capstone.ReportFilter.AverageSpeed, false);
        report.update(false);
        this.reportList.push(report);
        /*return;
        this.type = "column";
        self.title = title;
        self.subTitle = subtitle;
        self.xTitle = xTitle;
        self.yTitle = yTitle;
        self.xSuffix = xSuffix;
        self.ySuffix = ySuffix;
        self.xPrefix = xPrefix;
        self.toolTip = toolTip;

        CanvasJS.addColorSet("customColorSet",
        [//colorSet Array

        "#FF0000",
        "#00FF00",
        "#0000FF"
        ]);

        self.chart = new CanvasJS.Chart("chartContainer",
       {
           colorSet: "customColorSet",
           title: {
               text: self.title
           },
           subtitles: [
           {
               text: self.subTitle,
               fontSize: 15
           }
           ],
           animationEnabled: true,
           axisX: {
               title: self.xTitle,
               suffix: self.xSuffix,
               prefix: self.xPrefix,
               interval: 0
           },
           axisY: {
               title: self.yTitle,
               suffix: self.ySuffix
           },
           data: [
                   {
                       type: self.type,
                       toolTipContent: self.toolTip,
                       dataPoints: self.dataPoints
                   }

           ]
       });
        setInterval(function () { self.chart.render(); }, 1000);*/
    };

    this.updateChart = function (QueryResults) {
        for (var i in this.reportList) {
            this.reportList[i].update();
        }
        /*
        var report = new com.capstone.Report.BarGraph($("#chartContainer"), {}, com.capstone.ReportFilter.AverageSpeed);
        report.update(false);
        return;
        if (self.type == "pie") {
            this.pieChart("Valid vs. Invalid Data", QueryResults);
        } else if (self.type == "column") {
            this.updateBarGraph(QueryResults);
        }
        self.chart.render();*/
    };

    this.updateBarGraph = function (Data) {
        for (var i in this.reportList) {
            this.reportList[i].update();
        }
        /*if (self.title == "Average Speed") {
            var speed = 0;
            var count = 0;
            Data.forEach(function (result) {
                var resultSpeed = Math.ceil(result.Distance / (result.Duration / 3600));
                if (resultSpeed < 75 && resultSpeed > 0) {
                    speed += resultSpeed;
                    count++;
                }
            });
            speed = speed / count;
            self.dataPoints.push({ label: self.counter, y: speed });
            self.counter++;
        } else if (self.title == "Trips per Selection") {
            self.dataPoints.push({ label: self.counter, y: Data.length });
            self.counter++;
        } else if (self.title == "Valid vs. Invalid Data") {

        }*/
    }


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
com.capstone.ReportFilter.AverageSpeed = function() {
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