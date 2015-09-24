function BarGraph(ctx){
	
	//Private properties and methods
	
	var that = this;
	var startArr;
	var endArr;
	var looping = false;
	
	
	//adjusts the height of bar and redraws if necessary
	var loop = funtion(){
		
		
	};
	
	//updates canvas with current display
	var draw = function(arr){
		
		var numofBars = arr.length;
		var barWidth;
		var barHeight;
		var border = 2;
		var ratio;
		var maxBarHeight;
		var gradient;
		var largestValue;
		var graphAreaX = 0;
		var graphAreaY = 0;
		var graphAreaWidth = that.width;
		var graphAreaHeight = that.height;
		var i;
		
	};
	
	//Update dimensions of canvas if they have changed
	if(ctx.canvas.width !== that.width || ctx.canvas.height !== that.height){
		ctx.canvas.width = that.width;
		ctx.canvas.height = that.height;		
	}
	
	//Creates background color
	ctx.fillStyle = that.backgroundColor;
	ctx.fillRect(0, 0, that.width, that.height);
	
	//Makes room for x-axis label if it exists
	if(that.xAsisLabelArr.length){
		graphAreaHeight -= 40;
		}
	
	//Calculate size of the bars
	barWidth = graphAreaWidth / numofBars - that.margin * 2;
	maxBarHeight = graphAreaHeight - 25;
	
	//Determine largest balue in the bar array
	var largestValue = 0;
	for (i = 0; i < arr.length; i ++){
		if(arr[i] > largestValue){
			largestValue = arr[i];
		}
	}
	
	//For Each Bar 
	for(i = 0; i < arr.length; i++){
		//Set the ratio of current bar compared to the maximum
		if (that.maxValue){
			ratio = arr[i] / that.maxValue;
		}else {
			ratio = arr[i] / largestValue;
		}
		
	}
	
	//Turn on shadows
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;
	ctx.shadowBlur = 2;
	ctx.shadowColor = "#999";
	
	//Draw bar background
	ctx.fillStyle = "#333";
	ctx.fillRect(that.margin + i * that.width / numofBars, graphAreaHeight - barHeight, barWidth, barHeight);
	
	//Turn off shadows
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 0;
	
	//Create gradients
	gradient = ctx.createLinearGradient(0, 0, 0, graphAreaHeight);
	gradient = ctx.addColorStop(1-ratio, that.colors[i % that.colors.length]);
	gradient = ctx.addColorStop(1, "#ffffff");
	
	ctx.fillStyle = gradient;
	//Fill rectangle with the gradient
	ctx.fillRect(that.margin + i * that.width / numofBars + border, graphAreaHeight - barHeight + border, barWidth - border * 2, barHeight - border * 2);
	
	//Write bar value
	ctx.fillStyle ="#333";
	ctx.font = "bold 12px sans-serif";
	ctx.textAlign = "center";
	// Use try / catch to stop IE 8 from going to error town
    try {
      ctx.fillText(parseInt(arr[i],10),
        i * that.width / numOfBars + (that.width / numOfBars) / 2,
        graphAreaHeight - barHeight - 10);
    } catch (ex) {}
	
	
	//Public properties and methods
	this.width = 350;
	this.height = 200;
	this.maxValue;
	this.margin = 5;
	this.colors = ["purple", "red", "green", "yellow"];
	this.currArr = [];
	this.backgroundColor = "#fff";
	this.xAxisLabelArr = [];
	this.yAxisLabelArr = [];
	this.animationInterval = 100;
	this.animationSteps = 10;
	
	//sets end bar array and starts the animation
	this.update = function(newArr){
		
		
	};
	
	
}