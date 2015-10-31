var com = com || {};
com.capstone = com.capstone || {};

com.capstone.ReportController = function (reportid) {
    // Closure
    var self = this;

    // DIV ID for report
    this.reportID = reportid;

    this.chart = null;
    this.dataPoints = [];
    this.title = "Average Speed";
    this.subTitle = "In mph";
    this.type = "splineArea";
    this.xTitle = "Trip";
    this.yTitle = "Speed";


    this.initChart = function () {
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
               interval: 0,
               labelFontColor: "white",
               tickColor: "white"
           },
           axisY: {
               title: self.yTitle,
               suffix: " MPH",
               viewportMaximum: 65
           },
           data: [
                   {
                       type: self.type,
                       showInLegend: false,
                       lineThickness: 2,
                       markerType: "square",
                       color: "#008000",
                       toolTipContent: "Speed: {y}mph",
                       dataPoints: self.dataPoints
                   }

           ]
       });
        setInterval(function () { self.chart.render(); }, 1000);
    };

    this.updateChart = function (QueryResults) {
        if (self.type == "pie") {
            this.pieChart("Average Passengers", QueryResults);
        } else if (self.type == "splineArea") {
            this.lineGraph(self.title, self.subTitle, self.xTitle, self.yTitle, QueryResults);
        }

        self.chart.render();
    };

    this.lineGraph = function (title, subtitle, xTitle, yTitle, Data) {
        var counter = 1;
        self.title = title;
        self.subTitle = subtitle;
        self.xTitle = xTitle;
        self.yTitle = yTitle;
        Data.forEach(function (result) {
            var resultSpeed = Math.ceil(result.Distance / (result.Duration / 3600));
            if (resultSpeed < 75 && resultSpeed > 0) {
                self.dataPoints.push({ label: counter, y: resultSpeed });
                ++counter;
            }
        });
    }


    this.pieChart = function (title,yData) {
        self.title = title;
        var counter = 1;
        yData.forEach(function (result) {
            self.dataPoints.push({ label: counter, y: result.Passengers });
        });
    }

    this.clearChart = function () {
        self.dataPoints = [];
        self.chart.options.data[0].dataPoints = self.dataPoints;
        self.chart.render();
    }

    this.initChart();
}