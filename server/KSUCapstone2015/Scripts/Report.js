var com = com || {};
com.capstone = com.capstone || {};
com.capstone.ReportType = {};
com.capstone.ReportType.Column = function (title, subtitle, xAxisTitle, yAxisTitle, data) {
    return {
        type: "column",
        title: title,
        subtitle: subtitle,
        xAxisTitle: xAxisTitle,
        yAxisTitle: yAxisTitle,
        dataSets: data || []
    };
}

// Bar needs a type per datapoint grouping.
com.capstone.ReportType.Bar = function (title, subtitle, xAxisTitle, yAxisTitle, data) {
    return {
        type: "bar",
        title: title,
        subtitle: subtitle,
        xAxisTitle: xAxisTitle,
        yAxisTitle: yAxisTitle,
        dataSets: data || []
    };
}

com.capstone.ReportType.Pie = function (title, subtitle) {
    return {
        type: "pie",
        title: title,
        legend: {
            maxWidth: 350,
            itemWidth: 120
        }
    }
}
/*
com.capstone.ReportType.Line = "line";
com.capstone.ReportType.Scatter = "scatter";
com.capstone.ReportType.Area = "area";
*/

com.capstone.Report = function (options, updateCallback) {
    var report = this;
    this.options = {
        title: "",
        subtitle: "",
        xAxisTitle: "",
        yAxisTitle: "",
        dataSets: [],
        type: "column"
    }

    this.updateCallback = updateCallback;

    this.options = $.extend(this.options, options);

    this.update = function () {
        report.updateCallback(report);
    }
}