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
                text: "Speed Per Trip"
            },
            animationEnabled: true,
            axisX: {
                title: "Trip",
                interval: 20000,
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
                        toolTipContent: "Speed: {y}",
                        dataPoints: self.dataPoints
                    }

            ]
        });
        setInterval(function () { self.chart.render(); }, 1000);
    };

    this.updateChart = function (activeMapQueries) {
        for (var queryCounter = 0; queryCounter < activeMapQueries.length; ++queryCounter)
            for (var resultCounter = 0; resultCounter < activeMapQueries[queryCounter].QueryResults.length; ++resultCounter) {
            self.dataPoints.push({ label: resultCounter, y: activeMapQueries[queryCounter].QueryResults[resultCounter].Distance / ( activeMapQueries[queryCounter].QueryResults[resultCounter].Duration / 3600 ) });
        }
        self.chart.render();
    };
}