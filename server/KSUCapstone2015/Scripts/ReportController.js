var com = com || {};
com.capstone = com.capstone || {};

com.capstone.ReportController = function (reportid) {
    // Closure
    var self = this;

    // DIV ID for report
    this.reportID = reportid;

    this.chart = null;
    this.dataPoints = [];
    this.title = null;
    this.subTitle = null;
    this.type = null;
    this.xTitle = null;
    this.yTitle = null;
    this.xSuffix = null;
    this.ySuffix = null;
    this.toolTip = null;
    this.counter = 1;


    this.barGraph = function (title, subtitle, xTitle, yTitle, xSuffix, ySuffix, toolTip) {
        this.type = "column";
        self.title = title;
        self.subTitle = subtitle;
        self.xTitle = xTitle;
        self.yTitle = yTitle;
        self.xSuffix = xSuffix;
        self.ySuffix = ySuffix;
        self.toolTip = toolTip;

        self.chart = new CanvasJS.Chart("chartContainer",
       {
           theme: "theme2",
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
               interval: 0,
               labelFontColor: "white",
               tickColor: "white"
           },
           axisY: {
               title: self.yTitle,
               suffix: self.ySuffix,
               viewportMaximum: 65
           },
           data: [
                   {
                       type: self.type,
                       showInLegend: false,
                       lineThickness: 2,
                       markerType: "square",
                       color: "#008000",
                       toolTipContent: self.toolTip,
                       dataPoints: self.dataPoints
                   }

           ]
       });
        setInterval(function () { self.chart.render(); }, 1000);
    };

    this.updateChart = function (QueryResults) {
        if (self.type == "pie") {
            this.pieChart("Average Passengers", QueryResults);
        } else if (self.type == "column") {
            this.updateBarGraph(QueryResults);
        }
        self.chart.render();
    };

    this.updateBarGraph = function (Data) {
        if (self.title == "Average Speed") {
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
        }
    }


    this.pieChart = function (title,yData) {
        self.title = title;
        var passengers = 0;
        var count = 0;
        yData.forEach(function (result) {
            passengers += result.Passengers;
            count++;
        });
        passengers = passengers / count;
        self.dataPoints.push({ label: self.counter, y: passengers });
        self.counter++;
    }

    this.removeQuery = function (id) {
        self.dataPoints.splice(id, 1);
        self.chart.options.data[0].dataPoints = self.dataPoints;
        self.counter--;
        self.chart.render();
    }

    this.clearChart = function () {
        self.dataPoints = [];
        self.chart.options.data[0].dataPoints = self.dataPoints;
        self.counter = 1;
        self.chart.render();
    }
}