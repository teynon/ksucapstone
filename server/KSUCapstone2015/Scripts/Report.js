var com = com || {};
com.capstone = com.capstone || {};
com.capstone.reportCounter = 0;
com.capstone.Report = {};

com.capstone.ReportBase = function (container, options, updateCallback, multiset) {
    var report = this;
    this.updateCallback = updateCallback;
    this.multiset = multiset; // Does this report use multiple sets of data?
    this.options = {
        canvasJS: {
            title: {
                text: "Unnamed Report"
            },
            legend: {
                maxWidth: 350,
                itemWidth: 120
            }
        },
        dataSetOptions: {
            type: "column",
            showInLegend: true,
            legendText: "{indexLabel}"
        },
        id: ""
    }

    this.initialized = false;

    this.options = $.extend(this.options, options);

    // Give the element an ID if it doesn't have one.
    if (this.options.id == "") {
        this.options.id = "capstoneReport_" + com.capstone.reportCounter++;
    }

    // Create a new element for the report in the specified container.
    this.target = $("<div></div>").prop("id", this.options.id).css({
        width: "100%",
        height: "300px"
    }).appendTo($(container));

    // Draw the initial report.
    this.init = function (data) {
        if (data.length == 0) return;
        var dataSet = this.compileDataSet(data);

        var chartData = $.extend(this.options.canvasJS, dataSet);
        this.chart = new CanvasJS.Chart(this.options.id, chartData);
        this.chart.render();
        this.initialized = true;
    }

    this.update = function (multipleSets) {
        var data = report.updateCallback(report);
        if (data.length > 0) {
            if (this.initialized) {
                var dataSet = this.compileDataSet(data);

                this.chart.options.data = dataSet.data;
                this.chart.render();
            }
            else {
                this.init(data, multipleSets);
            }
        }
    }

    this.compileDataSet = function (data) {
        var dataSet = {};
        var compiledData = [];
        if (!this.multiset) {
            var obj = $.extend({}, this.options.dataSetOptions);
            obj.dataPoints = data;
            dataSet = {
                data: [obj]
            };
        }
        else {
            dataSet = {
                data: []
            };
            for (var i = 0; i < data.length; i++) {
                var obj = $.extend({}, this.options.dataSetOptions);
                obj.dataPoints = data[i];
                dataSet.data.push(obj);
            }
        }

        return dataSet;
    }
}

com.capstone.Report.BarGraph = function (container, options, updateCallback, multiset) {
    com.capstone.ReportBase.call(this, container, options, updateCallback, multiset);
    this.options.dataSetOptions.type = "bar";
}

com.capstone.Report.ColumnGraph = function (container, options, updateCallback, multiset) {
    com.capstone.ReportBase.call(this, container, options, updateCallback, multiset);
    this.options.dataSetOptions.type = "column";
}

com.capstone.Report.PieGraph = function (container, options, updateCallback, multiset) {
    com.capstone.ReportBase.call(this, container, options, updateCallback, multiset);
    this.options.dataSetOptions.type = "pie";
}