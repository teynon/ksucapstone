var com = com || {};
com.capstone = com.capstone || {};

com.capstone.ReportController = function (reportid) {
    // Closure
    var self = this;

    // DIV ID for report
    this.reportID = reportid;

    this.chart = null;
    this.dataPoints = [];


    window.onload = function () {
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
                viewportMaximum: 55,
                interval: 15
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

    this.updateChart = function (activeMapQueries) {
        var counter = 1;
        activeMapQueries.forEach(function (activeMapQuery) {
            activeMapQuery.QueryResults.forEach(function (result) {
                self.dataPoints.push({ label: counter, y: Math.round(result.Distance / (result.Duration / 3600)) });
                ++counter;
            });
        });

        self.chart.render();
    };
}