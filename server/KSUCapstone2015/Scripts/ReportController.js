var com = com || {};
com.capstone = com.capstone || {};

com.capstone.ReportController = function (reportid) {
    // Closure
    var self = this;

    // DIV ID for report
    this.reportID = reportid;

    this.chart = null;
    this.dataPoints = [];


    this.initChart = function () {
        self.chart = new CanvasJS.Chart("chartContainer",
        {
            theme: "theme2",
            title: {
                text: "Average Speed"
            },
            subtitles:[
            {
                text: "In mph",
                fontSize: 15
            }
            ],
            animationEnabled: true,
            axisX: {
                title: "Trip",
                interval: 0,
                labelFontColor: "white",
                tickColor: "white"
            },
            axisY: {
                title: "Speed",
                suffix: " MPH",
                viewportMaximum: 65
            },
            data: [
                    {
                        type: "splineArea",
                        showInLegend: false,
                        lineThickness: 2,
                        name: "Pickups",
                        markerType: "square",
                        color: "#008000",
                        toolTipContent: "Speed: {y}mph",
                        dataPoints: self.dataPoints
                    }

            ]
        });
        setInterval(function () { self.chart.render(); }, 1000);
    };

    this.updateChart = function (activeMapQuery) {
        var counter = 1;
        activeMapQuery.QueryResults.forEach(function (result) {
                       var resultSpeed = Math.ceil(result.Distance / (result.Duration / 3600));
                       if (resultSpeed < 75 && resultSpeed > 0) {
                               self.dataPoints.push({ label: counter, y: resultSpeed });
                               ++counter;
                           }
        });

        self.chart.render();
    };

    this.initChart();
}