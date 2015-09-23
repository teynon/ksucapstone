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