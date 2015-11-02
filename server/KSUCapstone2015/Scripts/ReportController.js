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
    this.type = "column";
    this.xTitle = "Trip";
    this.yTitle = "Speed";
    this.counter = 1;


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
        } else if (self.type == "column") {
            this.barGraph(self.title, self.subTitle, self.xTitle, self.yTitle, QueryResults);
        }
        self.chart.render();
    };

    this.barGraph = function (title, subtitle, xTitle, yTitle, Data) {
        self.title = title;
        self.subTitle = subtitle;
        self.xTitle = xTitle;
        self.yTitle = yTitle;
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

    this.initChart();
}