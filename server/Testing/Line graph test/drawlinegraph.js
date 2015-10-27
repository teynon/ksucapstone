function BuildLineChart(Title, subtitle, Axis1Title, Axis2Title, dataValue) {
	   var chart = new CanvasJS.Chart("chartContainer",
    {
        title:{
        text: Title
      },
	  subtitles:[
      {
            text: subtitle,
            fontSize: 15
      }
      ],
      animationEnabled: true,
      axisX: {
		title: Axis1Title,
        valueFormatString: "MMM",
        interval:1,
        intervalType: "month"
        
      },
      axisY:{
		title: Axis2Title,
        includeZero: false
        
      },
      data: [
      {        
        type: "line",        
        dataPoints: {x: new Date(Date.UTC (2012, 01, 1, 1,0)), y: dataValue}
      }
      
      
      ] 
})

chart.render();
}