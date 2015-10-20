var com = com || {};
com.capstone = com.capstone || {};

com.capstone.ReportController = function (reportid, mapController) {
    // Closure
    var self = this;

    // DIV ID for report
    this.reportID = reportid;

    this.chart = null;

    this.mapController = mapController;
    console.log(this.mapController);

    window.onload = function () {
        this.chart = new CanvasJS.Chart("chartContainer",
        {
            theme: "theme2",
            title: {
                text: "Average Travel Time"
            },
            animationEnabled: true,
            axisX: {
                title: "Trips",
                valueFormatString: "hh:mm tt",
                interval: 1,
                intervalType: "hour"
            },
            axisY: {
                title: "Time",
                includeZero: false
            },
            data: [
                    {
                        type: "line",
                        showInLegend: true,
                        lineThickness: 2,
                        name: "Pickups",
                        markerType: "square",
                        color: "#008000",

                        dataPoints: [
                        //{ x: new Date(Date.UTC(2012, 01, 1, 1, 0)), y: (Math.random() * 1000) },
                        //{ x: new Date(Date.UTC(2012, 01, 1, 2, 0)), y: (Math.random() * 1000) },
                        //{ x: new Date(Date.UTC(2012, 01, 1, 3, 0)), y: (Math.random() * 1000) },
                        //{ x: new Date(Date.UTC(2012, 01, 1, 4, 0)), y: (Math.random() * 1000) },
                        //{ x: new Date(Date.UTC(2012, 01, 1, 5, 0)), y: (Math.random() * 1000) },
                        //{ x: new Date(Date.UTC(2012, 01, 1, 6, 0)), y: (Math.random() * 1000) },
                        //{ x: new Date(Date.UTC(2012, 01, 1, 7, 0)), y: (Math.random() * 1000) },
                        //{ x: new Date(Date.UTC(2012, 01, 1, 8, 0)), y: (Math.random() * 1000) },
                        //{ x: new Date(Date.UTC(2012, 01, 1, 9, 0)), y: (Math.random() * 1000) },
                        //{ x: new Date(Date.UTC(2012, 01, 1, 10, 0)), y: (Math.random() * 1000) },
                        //{ x: new Date(Date.UTC(2012, 01, 1, 11, 0)), y: (Math.random() * 1000) },
                        //{ x: new Date(Date.UTC(2012, 01, 1, 12, 0)), y: (Math.random() * 1000) }
                        ]
                    },
                    {
                        type: "line",
                        showInLegend: true,
                        lineThickness: 2,
                        name: "Drop-Offs",
                        markerType: "circle",
                        color: "#00FF00",

                        dataPoints: [
                        { x: new Date(Date.UTC(2012, 01, 1, 1, 0)), y: (Math.random() * 1000) },
                        { x: new Date(Date.UTC(2012, 01, 1, 2, 0)), y: (Math.random() * 1000) },
                        { x: new Date(Date.UTC(2012, 01, 1, 3, 0)), y: (Math.random() * 1000) },
                        { x: new Date(Date.UTC(2012, 01, 1, 4, 0)), y: (Math.random() * 1000) },
                        { x: new Date(Date.UTC(2012, 01, 1, 5, 0)), y: (Math.random() * 1000) },
                        { x: new Date(Date.UTC(2012, 01, 1, 6, 0)), y: (Math.random() * 1000) },
                        { x: new Date(Date.UTC(2012, 01, 1, 7, 0)), y: (Math.random() * 1000) },
                        { x: new Date(Date.UTC(2012, 01, 1, 8, 0)), y: (Math.random() * 1000) },
                        { x: new Date(Date.UTC(2012, 01, 1, 9, 0)), y: (Math.random() * 1000) },
                        { x: new Date(Date.UTC(2012, 01, 1, 10, 0)), y: (Math.random() * 1000) },
                        { x: new Date(Date.UTC(2012, 01, 1, 11, 0)), y: (Math.random() * 1000) },
                        { x: new Date(Date.UTC(2012, 01, 1, 12, 0)), y: (Math.random() * 1000) }
                        ]
                    }

            ]
        });

        this.chart.render()
    };

    this.updateChart = function (activeMapQueries) {
        console.log(activeMapQueries);
        var data = { 
            type: "line",
            showInLegend: true,
            lineThickness: 2,
            name: "Pickups",
            markerType: "square",
            color: "#008000",

            dataPoints: [
                ]
        };

        //this.chart.options.data = [];
        //this.chart.options.data.push(data);



        //series1.dataPoints = [
        //        { label: "banana", y: 18 },
        //        { label: "orange", y: 29 },
        //        { label: "apple", y: 40 },
        //        { label: "mango", y: 34 },
        //        { label: "grape", y: 24 }
        //];

        //series2.dataPoints = [
        //    { label: "banana", y: 23 },
        //    { label: "orange", y: 33 },
        //    { label: "apple", y: 48 },
        //    { label: "mango", y: 37 },
        //    { label: "grape", y: 20 }
        //];

        //this.chart.render();
    }

}