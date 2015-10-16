﻿var com = com || {};
com.capstone = com.capstone || {};

com.capstone.ReportController = function (reportid) {
    // Closure
    var self = this;

    // DIV ID for report
    this.reportID = reportid;


        window.onload = function () {
            var chart = new CanvasJS.Chart("chartContainer",
            {
                theme: "theme2",
                title: {
                    text: "Pickups and Drop-offs per hour"
                },
                animationEnabled: true,
                axisX: {
                    title: "Hours",
                    valueFormatString: "hh:mm tt",
                    interval: 1,
                    intervalType: "hour"
                },
                axisY: {
                    title: "Hits",
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

            chart.render()
    };
}