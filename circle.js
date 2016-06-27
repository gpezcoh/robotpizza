var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
var table= document.getElementById("results");
var results = [0]
var total = 0
var running = document.getElementById("running");
var timeoutID

$(document).ready(function (){
	console.log("ayy")
});

function restart(){
	ctx.clearRect(0, 0, c.width, c.height);
	total = 0
	results = [0]
	while(table.rows.length > 1){
		table.deleteRow(-1)
	}
}

function preRun(){
	$("#warning").hide()
	$("#running").show()
	timeoutID = window.setTimeout(run, 500);
}

function run(){
	var iterations = document.getElementById("iterations").value
	if(iterations > 100000){
		console.log("hey")
		$("#running").hide()
	 	window.clearTimeout(timeoutID);
		$("#warning").show()
		return
	}
	for(var i = 0; i < iterations; ++i){
		result = draw()
		while(results.length - 1 < result){
			results.push(0)
		}
		results[result]++
		total++
		// if(!document.getElementById("row" + result)){
		// 		createRow(result)
		// 	}
		// document.getElementById("row" + result).textContent = "" + results[result]
		// document.getElementById("percent" + result).textContent = "" + ((results[result]/total) * 100).toFixed(0)
	}
	for(var i = 0; i < results.length; ++i){
		if(results[i] > 0){
			if(!document.getElementById("row" + i)){
				createRow(i)
			}
				document.getElementById("row" + i).textContent = "" + results[i]
				document.getElementById("percent" + i).textContent = "" + ((results[i]/total) * 100).toFixed(0)
		}
	}
	$("#running").hide()
	 window.clearTimeout(timeoutID);
}

function createRow(num){
	var row = table.insertRow()
	var col1 = row.insertCell(0)
	var col2 = row.insertCell(1)
	var col3 = row.insertCell(2)
	col1.textContent = num
	col2.id = "row" + num
	col3.id = "percent" + num
}

function draw(){
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.beginPath();
	ctx.arc(200,200,100,0,2*Math.PI);
	ctx.stroke();
	points = findPoints(200,200,100)
	var lines = []
	var intersections = 0
	var slices = document.getElementById("slices").value
	for(var i = 0; i < slices; ++i){
		lines.push(drawLines(points,ctx))
	}
	for(var i = 0; i < lines.length - 1; ++i){
		for(var j = i + 1; j < lines.length; ++j){
			if(checkLineIntersection(lines[i],lines[j])){
				intersections++
			}
		}
	}
	var sections = intersections + (slices - 0) + 1
	return sections
}

function drawLines(points,ctx){
	var point = points[Math.ceil(Math.random() * points.length - 1)]
	var pointx = point["x"]
	var pointy = point["y"]
	ctx.beginPath()
	ctx.moveTo(pointx,pointy)
	point = points[Math.ceil(Math.random() * points.length - 1)]
	if(!point){
		console.log(point)
		return false
	}
	pointx2 = point["x"]
	pointy2 = point["y"]
	ctx.lineTo(pointx2,pointy2)
	ctx.stroke()
	return [pointx,pointy,pointx2,pointy2]
}

function checkLineIntersection([line1StartX, line1StartY, line1EndX, line1EndY], [line2StartX, line2StartY, line2EndX, line2EndY]) {

	// From http://jsfiddle.net/justin_c_rounds/Gd2S2/

    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2
    // result = {
    //     x: null,
    //     y: null,
    //     onLine1: false,
    //     onLine2: false
    // };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        return false;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    // result.x = line1StartX + (a * (line1EndX - line1StartX));
    // result.y = line1StartY + (a * (line1EndY - line1StartY));
/*
        // it is worth noting that this should be the same as:
        x = line2StartX + (b * (line2EndX - line2StartX));
        y = line2StartX + (b * (line2EndY - line2StartY));
        */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        // result.onLine1 = true;
        return true
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        // result.onLine2 = true;
        return true
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return false;
};


function findPoints(centerX,centerY,radius){
	var points=[];

	for(var degree=0;degree<360;degree++){
	    var radians = degree * Math.PI/180;
	    var x = centerX + radius * Math.cos(radians);
	    var y = centerY + radius * Math.sin(radians);
	    points.push({x:x,y:y});
	}

	return points
}