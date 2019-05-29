/* global d3 */


import noUiSlider from "nouislider";
//import 'nouislider/distribute/nouislider.css';
var countStreak = 1;
let dragging = false;
let svg = null;
let fixedFace = null;
let faces = null;
let face = null;
let faceSize = 65;
let lines = null;
let faceAdjust = 0;

var margin = {top: 0, right: 0, bottom: 0, left:0},
		width = 550 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom;

d3.select(".chart").style("width",width+"px").style("height",height+"px")

function project(matrix, point) {
  point = multiply(matrix, [point[0], point[1], 0, 1]);
  return [point[0] / point[3], point[1] / point[3]];
}

function multiply(matrix, vector) {
  return [
    matrix[0] * vector[0] + matrix[4] * vector[1] + matrix[8 ] * vector[2] + matrix[12] * vector[3],
    matrix[1] * vector[0] + matrix[5] * vector[1] + matrix[9 ] * vector[2] + matrix[13] * vector[3],
    matrix[2] * vector[0] + matrix[6] * vector[1] + matrix[10] * vector[2] + matrix[14] * vector[3],
    matrix[3] * vector[0] + matrix[7] * vector[1] + matrix[11] * vector[2] + matrix[15] * vector[3]
  ];
}

function resize() {}

function init() {
	newCode()
}

export default { init, resize };

function newCode(){
	var cumulativeStats = d3.select(".cumulative-container");
	var topArtistCountArray = {};
	var n = 9,
	    duration = 1500,
	    now = new Date(Date.now() - duration);

	var searchData;
	var count = [];
	var started = false;
	var axis;
	var chartData;
	var nestedDatesTwo;
	var imageData;
	var shiftDuration = 2500;
	var tickDelay;
	var playLength = 0;
	var startTime = 0;
	var colorOne = "#FF2F28";
	var colorTwo = "#FF2F28";
	var context;
	var bufferLoader;
	var scratch;
	var hit;
	var source;
	var lastSource;
	var currentYear = 1995;
	var windowFocus = 0;
	var hidden;
	var textAdjust = 6;
	var textColor = "#797979";
	var pathColor = "#FFFFFF";
	var playing = false;
	var muted = false;
	var hidden;
	var mobile = false;

	var parseDate = d3.time.format("%Y-%m-%d").parse;
	var unParse = d3.time.format("%Y-%m-%d");
	var niceParse = d3.time.format("%b, '%y");
	var niceParseTwo = d3.time.format("%B %d, '%y");
	var niceParseThree = d3.time.format("%b %d, '%y");
	var numParse = d3.time.format("%Y%m%d");
	var numParseDate = d3.time.format("%Y%m%d").parse;

	var sideBarParse = d3.time.format("%b '%y");
	var yearParse = d3.time.format("%Y")

	var uniqueRowsCsv = "assets/data/unique_rows.csv";

	var startString = "1964-03-14";
	if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	  //startString = "1997-03-15";
	  mobile = true;
	  textColor = "white";
	  faceAdjust = -25;
	  textAdjust = 3;
	  uniqueRowsCsv = "assets/data/unique_rows_mobile.csv"
	}
	var start = new Date(parseDate(startString));

	//interate through 17 weeks by adding 7 to the start day
	var dates = [start];
	var i;
	for (i=0; i<n; i++){
	  var length  = dates.length;
	  var date = d3.time.day.offset(dates[length - 1],7);
	  dates.push(date);
	}
	var dateAhead = unParse(d3.time.day.offset(dates[0], 7));
	let twoDatesAhead = unParse(d3.time.day.offset(dates[0], 14));
	var currentDate = unParse(dates[0]);

	var viewportWidth;
	var viewportHeight;

	viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

	$( document ).ready(function() {

	d3.csv("assets/data/all_rows.csv", function(error, data) {
	  d3.csv(uniqueRowsCsv, function(error, songsUnique) {

	  if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	    width = 250;
	    if(viewportWidth<400){
	      width = 227;
	    }

	    if(viewportWidth<330){
	      width = 195;
	      height = viewportHeight - 230;
	    }
	    margin.left = 25;
	  }

	  var searchData = d3.nest().key(function(d){
		      return d.artist;
		  })
		  .entries(
		    songsUnique.sort(function(b,a) {
		      var o1 = a.title;
		      var o2 = b.title;

		      if (o1 > o2) return -1;
		      if (o1 < o2) return 1;
		      return 0;
		    })
		  );

	  var songsUniqueMap = d3.map(songsUnique, function(d){ return d.key });

	  var x = d3.time.scale().domain([dates[0],dates[dates.length-1]]).range([height, 0]);

	  var y = d3.scale.linear()
	      .domain([6, 1])
	      .range([width, 0])
				;

	  var xAxis = d3.svg.axis()
	    .scale(x)
	    .ticks(3)
	    .tickFormat(d3.time.format("%b %d '%y"))
	    .innerTickSize(0)
	    .outerTickSize(0)
	    .tickPadding(0)
	    .orient("bottom")
	    ;

	  if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	    xAxis.tickFormat(d3.time.format("%b-%Y")).ticks(2);
	  }

	  var yAxis = d3.svg.axis().scale(y)
	    .tickFormat(function(d,i){
	      if(d==1){
	      return "#" + d;
	      }
	      return d;
	    })
	    .innerTickSize(-10)
	    .tickValues([1,2,3,4,5])
	    .tickPadding(3)
	    .orient("left")
	    ;

	  var line = d3.svg.line()
      .interpolate("linear")
      .x(function(d, i) {
				return y(+d.rank);
				// var date = d.chart_date;
				// var adjust = d3.scale.linear().domain([dates[0],dates[dates.length-1]]).range([0,1]).clamp(true);
				// var rankAdjust = d3.scale.linear().domain([0,1]).range([d.rank,2.5])
				// return y(rankAdjust(adjust(date)));
			})
			.y(function(d,i){
				return x(d.chart_date); //this x is now translating between 0 and height with date on y-axis
			})
			;

	  data.forEach(function(d) {
	    if(+d.chart_date.slice(0,4)<1962 && d.chart_date != "1961-12-30"){
	      d.chart_date = d3.time.day.offset(parseDate(d.chart_date),-2);
	      d.chart_date_num = unParse(d.chart_date);
	    }
	    else {
	      d.chart_date_num = d.chart_date;
	      d.chart_date = parseDate(d.chart_date);
	    }
	    // d.id = d.title + " by " + d.artist;
	    d.id = d.track_id;
	    if(songsUniqueMap.has(d.id)){

	    }else{
	      // console.log(d.id);
	    }
	    d.track_info = songsUniqueMap.get(d.id);
	  });

	  var artistData = d3.nest().key(function(d){
		      return d.id;
		  })
		  .entries(data);

	  var testDates = d3.nest().key(function(d){
		    return d.chart_date_num.slice(0,7);
		  })
		  .entries(data.filter(function(d){
				return +d.rank < 6
			}));

	  //chartdata is nested by artist
	  chartData = d3.nest().key(function(d){
	      return d.id;
	  })
	  .entries(data);

	  //nestedDates is nested by week
	  var nestedDates = d3.nest().key(function(d){
		      return d.chart_date_num;
		  })
		  .entries(data);



		var weeksForDateLines = nestedDates.map(function(d){
			return +d.key.replace("-","").replace("-","")
		}).filter(function(d,i){
			return i % 5 == 0
		})

		// var weeksForDateLines = d3.nest().key(function(d){
		// 	return +d.chart_date_num.slice(0,7).replace("-","");
		// })
		// .rollup(function(leaves){
		// 	d3.nest().key(function(d){
		// 		return
		// 	})
		// 	return +d.chart_date_num.replace("-","").replace("-","")
		// })
		// .rollup(function(leaves){
		// 	console.log(leaves);
		// 	return leaves;
		// })
		// .entries(data);
		//
		// console.log(weeksForDateLines);



	  for (var i = 0; i < chartData.length; i++) {
	    //add peak to the top-level node

	    //rank by week
	    var dateRank = {};
	    for (var j=0; j < chartData[i].values.length; j++){
	      var date = chartData[i].values[j].chart_date_num;
	      var rank = chartData[i].values[j].rank;
				if(rank < 6){
					dateRank[date] = rank
				}
	    }
	    chartData[i].nestedDateArray = dateRank;
	  }

	  var chartMap = d3.map(chartData, function(d){ return d.key });

	  for (var date in testDates){
	    for (var track in testDates[date].values){
	      var item = chartMap.get(testDates[date].values[track].id);
	      testDates[date].values[track].nestedDateArray = item.nestedDateArray;
	      testDates[date].values[track].key = item.key;
	      testDates[date].values[track].values = item.values
					.filter(function(d){
						return +d.rank < 6;
					});
	    }
	  }


	  testDates = d3.map(testDates, function(d){ return d.key });

		var filteredData = testDates.get(unParse(dates[0]).slice(0,7)).values;

		var nextMonth = unParse(d3.time.month.offset(dates[0],1)).slice(0,7)
		var filteredDataNext = testDates.get(unParse(d3.time.month.offset(dates[0],1)).slice(0,7)).values;
		filteredData = _.unionBy(filteredData, filteredDataNext);

	  //nestedDatesTwo is for the audio so that it knows what it will play each week
	  var nestedDatesTwo = {};

	  //sorts everything for getting the top ranked track that goes into nestedDatesTwo
	  for (var i in nestedDates){
	    nestedDates[i].values.sort(function(a,b) {return a.rank-b.rank;});
	  }

	  //nestedDates is the data nested by week
	  for (var i in nestedDates){
	    var date = nestedDates[i].key;
	    nestedDatesTwo[date] = {
	      track:nestedDates[i]["values"][0]["id"],
	      preview:nestedDates[i]["values"][0]["track_info"]["song_url"],
	      artist:nestedDates[i]["values"][0]["track_info"]["artist"],
	      title:nestedDates[i]["values"][0]["track_info"]["title"]
	    };
	  }


		//week map for getting top ranked songs
		var rankingMap = d3.map(nestedDates,function(d){
			return d.key;
		})

	  function changeYear(changedYear){

			console.log("changing year");

	    var duration1 = 800;
	    var duration2 = 400;


			var filteredDataFirst = testDates.get(unParse(dates[0]).slice(0,7)).values;
			var filteredDataNext = testDates.get(unParse(d3.time.month.offset(dates[0],1)).slice(0,7)).values;
			var filteredDataThird = testDates.get(unParse(d3.time.month.offset(dates[0],2)).slice(0,7)).values;
			var filteredDataFourth = testDates.get(unParse(d3.time.month.offset(dates[0],2)).slice(0,7)).values;

			filteredData = _.unionBy(filteredDataFirst, filteredDataNext,filteredDataThird,filteredDataFourth, 'key');

			d3.selectAll("#glow").remove();

	    path = path.data(filteredData, function(d){
	      return d.key;
	    })
	    ;

			lines = lines.data(dates,function(d){
				return d;
			});

	    face = face.data(filteredData, function(d){
	      return d.key;
	    });

	    path.enter().append("path")
	      .attr("class", "line")
	      .attr("d", function(d){
					return line(d.values);
	        //return lineFunction(d.values);
					return line(getPathWeeks(d));
	      })
	      .attr("transform", "translate(" + x(dates[dates.length-1]) + ")")
	      .style("stroke", function(d){
	        var data = d;
	        return pathStroke(data);
	      })
	      .style("opacity",function(d){
					return pathOpacity(d);
	      })
	      ;

			lines.enter()
				.append("div")
				.attr("class","date-line")
				.style("top",function(d){
					return x(d)+"px";
				})
				.style("display",function(d){
					var date = +unParse(d).replace("-","").replace("-","");
					if(weeksForDateLines.indexOf(date) > -1){
						return "block"
					};
					return null;
				})
				// .style("transform",function(d){
				// 	return "translate(0px,"+x(d)+"px)";
				// })
				// .style("display",function(d,i){
				// 	if(i<2){
				// 		return "none"
				// 	}
				// 	return null
				// })
				.append("p")
				.text(function(d){
					return niceParse(d);
				})
				;

	    face.enter()
				.append("div")
	      .attr("class","face tk-futura-pt")
	      .style("background-image", function(d){
	        if(d["track_info"]["artist_url"] == "NULL"){
	          return null
	        }
	        if(d["track_info"]["artist_url"] == "manual"){
	          var hostUrl = document.location.origin;
	          var pathUrl = document.location.pathname.replace("index.html","");
	          var idSong = nestedDatesTwo[unParse(d3.time.day.offset(dates[dates.length-1], 7))]["track"];
	          nextSong = hostUrl+pathUrl+"url/"+idSong + ".m4a"
	          return "url("+nextSong+")";
	        }
	        return "url(https://i.scdn.co/image/"+d["track_info"]["artist_url"]+")"
	      })
				.style("top",function(d){
					return faceTop(d);
				})
				.style("left",function(d){
					var data = d;
					return faceLeft(data);
				})
				.append("p")
				.append("span")
				.text(function(d){
					return d.track_info.title;
				})
	      ;

	    path.exit().remove();
	    face.exit().remove();
			lines.exit().remove();
	  }

	  var currentDate = unParse(dates[0]);
	  var dateAhead = unParse(d3.time.day.offset(dates[0], 7));
		var twoDatesAhead = unParse(d3.time.day.offset(dates[0], 14));

	  var opacityScale = d3.scale.linear().domain([20,4,1]).range([.05,.3,1]);
	  var timelineScale = d3.scale.linear().domain([0,354]).range([23,375]);

	  function topArtist(d){
	    return nestedDatesTwo[currentDate].title+"â€”"+nestedDatesTwo[currentDate].artist;
	  }

	  function faceBackground(d) {
	    var rank = d.nestedDateArray[dateAhead];
	    if (rank == 1){
	      return colorTwo;
	    }
	    else{
	      if (currentDate in d.nestedDateArray){
	        var rank = d.nestedDateArray[currentDate];
	        return d3.interpolate("#fff", "#000")(opacityScale(rank));
	      }
	      else {
	        return d3.interpolate("#fff", "#000")(opacityScale(.05));
	      }
	    }
	  };

	  svg = d3.select(".chart").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
			.style("width", width + margin.left + margin.right + "px")
			.style("height", height + margin.top + margin.bottom + "px")
	    .attr("class","lines-container")
	    ;

		var colorScheme = d3.schemeYlGnBu[5];
		//colorScheme = d3.schemeGnBu[5];
		colorScheme = ["#49217a","#852c82","#b52f59","#f5af71","#fcfbbc"].reverse()
		//colorScheme = ["yellow","orange","red","green","steelblue"]//.reverse()

	  svg.append("linearGradient")
	      .attr("id", "temperature-gradient")
	      .attr("gradientUnits", "userSpaceOnUse")
	      .attr("x1", y(5))
				.attr("y1", 0)
	      .attr("x2", y(1))
				.attr("y2", 0)
	      .selectAll("stop")
	        .data(
						colorScheme.reverse()
							.map(function(d,i){
							return {offset:(i*25)+"%",color:d}
						})
					// 	[
	        //   {offset: "0%", color: "steelblue"},
					// 	{offset: "20%", color: "green"},
					// 	{offset: "40%", color: "yellow"},
	        //   {offset: "60%", color: "orange"},
	        //   {offset: "100%", color: "#FF2F28"}
	        // ]
				)
	      .enter().append("stop")
	        .attr("offset", function(d) { return d.offset; })
	        .attr("stop-color", function(d) { return d.color; });

		svg.append("defs").html('<filter id="outline"> <feMorphology in="SourceAlpha" result="DILATED" operator="dilate" radius="3"></feMorphology> <feFlood flood-color="#111" flood-opacity="1" result="PINK"></feFlood> <feComposite in="PINK" in2="DILATED" operator="in" result="OUTLINE"></feComposite> <feMerge> <feMergeNode in="OUTLINE"></feMergeNode> <feMergeNode in="SourceGraphic"></feMergeNode> </feMerge> </filter>')

	  svg.append("defs")
	    .append("clipPath")
	    .attr("id", "clip")
	    .append("rect")
	    .attr("x", -10)
	    .attr("y", -500)
	    .attr("width", width)
	    .attr("height", 500+height-70)//height);

	  svg.append("defs")
	    .append("clipPath")
	    .attr("id", "xaxisclip")
	    .append("rect")
      .attr("width", width + 20)
      .attr("height", height + margin.bottom * 2 + margin.top);


		svg.append("defs").append("filter")
      .attr("id",'blurred')
    	//.attr({"width":"200%", "height":"200%"})
    	.append("feGaussianBlur").attr("stdDeviation", 8);

		svg.append("defs").append("filter")
      .attr("id",'blurredTwo')
    	//.attr({"width":"200%", "height":"200%"})
    	.append("feGaussianBlur").attr("stdDeviation", 2);

	  var ySvg = svg.append("g")
	    .attr("transform", function(){
	      var leftAdjust = margin.left + 20;
	      if(mobile){
	        leftAdjust = 75;
	      }
	      return "translate(" + leftAdjust + "," + margin.top + ")";
	    })
	    .attr("class", "y axis tk-futura-pt")
	    .call(yAxis);
	    ;

		var xSvg = svg.append("g").append("g")
	    .attr("class","x-axis-container")
	    ;

		// build paths

		var pathSvg = svg.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr("clip-path", "url(#clip)")
			.attr("class","path-container")
			;

		function getPathWeeks(d){
			var weeks = d.values.map(function(d){return d;});
			var weekArray = [];

			var startOfWeek = d.values[0]
			var end = d3.time.day.offset(startOfWeek.chart_date,3)
			var range = d3.time.day.range(startOfWeek.chart_date,end);

			for (var item in range){
				weeks.push({rank:startOfWeek.rank, chart_date:range[item]});
			}

			var endOfWeek = d.values[d.values.length-1]
			var endTwo = d3.time.day.offset(endOfWeek.chart_date,3)
			var rangeTwo = d3.time.day.range(endOfWeek.chart_date,endTwo);

			for (var item in rangeTwo){
				weeks.push({rank:endOfWeek.rank, chart_date:rangeTwo[item]});
			}

			weeks = weeks.sort(function(a,b){
				return a.chart_date - b.chart_date;
			});

			return weeks
		}

		var lineFunction = d3.svg.line()
			.interpolate(function(points){
				for (var point in points){
					points[point] = project(matrix, points[point])
				}
				return points.join("L");
			})
			.x(function(d, i) {
				return y(+d.rank);
			})
			.y(function(d,i){
				return x(d.chart_date); //this x is now translating between 0 and height with date on y-axis
			})
			;


		var path = pathSvg.selectAll('path').data(filteredData, function(d){
				return d.key;
			})
			.enter().append("path")
			.attr("class", "line")
			.attr("d", function(d){
				return line(d.values);
				//return lineFunction(d.values);
				return line(getPathWeeks(d));

			})
			// .attr("filter",function(d){
			// 	if (dateAhead in d.nestedDateArray){
			// 		if(d.nestedDateArray[dateAhead] == 1){
			// 			return null;
			// 		}
			// 	}
			// 	return "url(#outline)";
			// })
			//.attr("transform", "translate(0," + x(dates[1]) + ")") //this is shifting the line
			.style("stroke", function(d){
				//var data = d;
				//return "red"
				return pathStroke(d);
			})
			.style("opacity",function(d){
				var data = d;
				return 1;
				return pathOpacity(data);
			})
			.on("mouseover",function(d){
				console.log(d);
			})
			;

		function clone(selector) {
	    var node = selector.node();
	    return d3.select(node.parentNode.insertBefore(node.cloneNode(true),
			node));
		}

		path.each(function(d,i){
			if (dateAhead in d.nestedDateArray){
				var rank = d.nestedDateArray[dateAhead];
				if(rank==1){
					clone(d3.select(this)).attr('filter', 'url(#blurred)').style("stroke-width",'9px').style("stroke","#c000ff").style("opacity",.8).attr("id","glow")
				}
			}
		})

		var bottomFrame = d3.select(".bottom-frame")
			.style("width",width+"px")
			//.style("width",(620)+"px")
			.style("height",height+"px");

		bottomFrame.select(".ranking").selectAll("p")
			.style("color",function(d,i){
				return colorScheme[colorScheme.length - i - 1];
			})

		//guitar hero outline
		var guitarHeroOutline = d3.select(".guitar-frame")
			.style("width",width+"px")
			//.style("width",(620)+"px")
			.style("height",height+"px")
			.append("svg");

		guitarHeroOutline.append("rect")
			.attr("x","0")
			.attr("y",height-30-1)
			.attr("height",30)
			.attr("width","100%")
			;

		guitarHeroOutline.selectAll("line")
			.data(d3.range(6))
			.enter()
			.append("line")
			.attr("x1",function(d,i){
				if(i==0){
					return 1
				}
				if(i==5){
					return "100%"
				}
				// if(i==1){
				// 	return "19%"
				// }
				// if(i==2){
				// 	return "39.4%"
				// }
				// if(i==3){
				// 	return "60%"
				// }
				// if(i==4){
				// 	return "79.4%"
				// }
				return i*20+"%"
			})
			// .attr("x1",function(d,i){
			// 	return "50%"
			// })
			.attr("x2",function(d,i){
				if(i==0){
					return 1
				}
				if(i==5){
					return "100%"
				}
				// if(i==1){
				// 	return "19%"
				// }
				// if(i==2){
				// 	return "39.4%"
				// }
				// if(i==3){
				// 	return "60%"
				// }
				// if(i==4){
				// 	return "79.4%"
				// }
				return i*20+"%"
			})
			.attr("y1",function(d){
				return -400
			})
			// .attr("y1",function(d){
			// 	return -400
			// })
			.attr("y2",function(d){
				return height-30-1
			})
			;



		// build faces
	  faces = d3.select(".chart").append("div")
	    .attr("id","faces")
	    ;

		fixedFace = faces.append("div")
			.attr("class","face-fixed-container")
			.selectAll(".face-fixed")
			.data(d3.range(5))
			.enter()
			.append("div")
			.attr("class","face-fixed face")
			.style("left",function(d,i){
				return y(i+1) + faceAdjust + margin.top + "px"
			})
			.style("top",function(d){
				return x(dates[1])+"px";
			})
			.style("background-image",function(d,i){
				var data = rankingMap.get(dateAhead).values[i];
				return faceBackgroundImage(data);
			})
			;

		face = faces.append("div").attr("class","face-container")
			.selectAll(".face")
			.data(filteredData, function(d){
				return d.key;
			})
			.enter()
			.append("div")
			.attr("class","face tk-futura-pt")
			.style("background-image", function(d){
				var data = d;
				return faceBackgroundImage(data);
			})
			.style("border-color",function(d){
				return faceBorder(d);
			})
			.style("opacity",function(d){
				var data = d;
				return faceOpacity(data);
			})
			.style("top",function(d){
				return faceTop(d);
			})
			.style("left",function(d){
				var data = d;
				return faceLeft(data);
			})
			.style("width",faceSize+"px")
			.style("height",faceSize+"px")
			.on("mouseover",function(d){
				var data = d;
				var element = d3.select(this);
				faceMouseOver(data,element);
			})

		face
			.append("p")
			.append("span")
			.text(function(d){
				return d.track_info.title;
			})
			;


		lines = faces.append("div").attr("class","date-lines-container")
			.selectAll("div")
			.data(dates)
			.enter()
			.append("div")
			.attr("class","date-line")
			.style("top",function(d){
				return x(d)+"px";
			})
			.style("display",function(d){
				var date = +unParse(d).replace("-","").replace("-","");
				if(weeksForDateLines.indexOf(date) > -1){
					return "block"
				};
				return null;
			})

		lines
			.append("p")
			.text(function(d){
				return niceParse(d);
			})
			;




	  var chartContainer = d3.select(".chart")
	    .on("mouseover", function(){
	      if(!playing){
	        pausePlay.style("opacity",1);
	      }
	    })
	    .on("mouseout",function(){
	      if(!playing){
	        pausePlay.style("opacity",0);
	      }
	    })
	    ;

	  var textLeftOffset = 240;
	  if(mobile){
	    if(viewportWidth<330){
	      textLeftOffset = 230;
	    }
	    else{
	      textLeftOffset = 230;
	    }
	  }

	  var svgTwo = d3.select(".chart").append("svg")
	    .attr("class","text-container")
	    .append("g")
	    .attr("clip-path", "url(#clip)")
	    .attr("transform", function(){
	      var marginTop = margin.top;
	      return "translate(" + textLeftOffset + "," + marginTop + ")";
	    })
	    ;

	  var clickPlayTip = d3.select(".click-to-play");

	  var trackLegend = d3.select(".track-legend").selectAll("div");

	  var interpolateOne = d3.interpolate("#0C0C0C","#FFFFFF");

		function faceTop(d){
			if(dateAhead in d.nestedDateArray || currentDate in d.nestedDateArray){
				return x(dates[1])+"px";
			}
			else {
				if(unParse(d3.time.day.offset(dates[0], -7)) in d.nestedDateArray || unParse(d3.time.day.offset(dates[0], -14)) in d.nestedDateArray){
					return x(dates[0])+"px";
				}
				var chart_date = d.values[d.values.length-1].chart_date;
				return x(chart_date)+"px"; //this x is now translating between 0 and height with date on y-axis
			}
		}



		function faceLeft(d){
	    if (dateAhead in d.nestedDateArray){
	      var rank = d.nestedDateArray[dateAhead];
	      return y(rank) + faceAdjust + margin.top + "px";
	    }
	    else {
				if(unParse(d3.time.day.offset(dates[0], -7)) in d.nestedDateArray){
					var rank = d.nestedDateArray[currentDate];
					return y(rank) + faceAdjust + margin.top + "px";
				}
				var rank = d.values[d.values.length-1].rank;
				return y(rank) + faceAdjust + margin.top + "px";
	    }


			// if(d.values[d.values.length-1].chart_date >= dates[0]){
			//
			//   if(dateAhead in d.nestedDateArray){
		  //     var rank = d.nestedDateArray[currentDate];
		  //     return y(rank) + faceAdjust + margin.top + "px";
			//   }
			// }
		}

	  function faceTopPosition(d){
	    if (dateAhead in d.nestedDateArray){
	      var rank = d.nestedDateArray[dateAhead];
	      return y(rank) + faceAdjust + margin.top + "px";
	    }
	    else {
	      return width + 100 + "px";
	    }
	  }
	  ;

	  function textTopPosition(d){
	    if (dateAhead in d.nestedDateArray){
	      var rank = d.nestedDateArray[dateAhead];
	      return y(rank) + textAdjust;
	    }
	    return height + 100;
	  }
	  ;

	  function faceMouseOver(d,element){
	    var artist = d["track_info"]["artist"];
	    var title = d["track_info"]["title"];
	    if( !/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	      // clickPlayTip.style("opacity",1).style("top",positionTop);
	      d3.select(".number-one-artist").style("color","#FFF").text(title+"â€”"+artist);
	    }
	  }

	  function faceBackgroundImage(d){
	    if(d["track_info"]["artist_url"] == "NULL"){
	      return null
	    }
	    return "url(https://i.scdn.co/image/"+d["track_info"]["artist_url"]+")"
	  }

	  function faceOpacity(d){
			if(dateAhead in d.nestedDateArray || currentDate in d.nestedDateArray){
				return null;
			}
			else {
				if(dates[0] > d3.max(d.values, function(d){ return d.chart_date})){
					//if(unParse(d3.time.day.offset(dates[0], -7)) in d.nestedDateArray || unParse(d3.time.day.offset(dates[0], -14)) in d.nestedDateArray){
					return 0;
				}
				else{
					return .5
				}
				// var chart_date = d.values[d.values.length-1].chart_date;
				// return x(chart_date)+"px"; //this x is now translating between 0 and height with date on y-axis
			}
	  }

	  var bioName = d3.select(".bio-name");
	  var bioText = d3.select(".bio-info");

		var pausePlay = d3.selectAll(".paused-play-button")
	    .on("click",function(){
	      d3.select(this).style("pointer-events","none");
	      d3.select(".pause-section").style("display","initial");
	      returnPath();
	    })
	    ;

	  // function returnPath(){
		//
	  //   d3.select(".number-one-date-wrapper").style("opacity",1);
	  //   pausePlay.style("background","#F33").transition().duration(1000).style("opacity",0);
	  //   trackLegend.style("visibility","hidden");
	  //   face.style("visibility","visible");
	  //   text.style("visibility","visible");
	  //   clickPlayTip.style("visibility","visible");
		//
	  //   y.domain([10, 1]);
	  //   x.domain([dates[2], dates[dates.length-1]]);
		//
	  //   yAxis
	  //     .scale(y)
	  //     .tickFormat(function(d,i){
	  //       if(d==1){
	  //       return "#" + d;
	  //       }
	  //       return d;
	  //     })
	  //     .innerTickSize(-width)
	  //     .tickValues( y.ticks( 10 ).concat( y.domain() ) )
	  //     .tickPadding(5)
	  //     .orient("left")
	  //     ;
		//
	  //   xAxis
	  //     .ticks(5)
	  //     .tickFormat(d3.time.format("%b-%d %Y"))
	  //     ;
		//
	  //   if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	  //     xAxis.tickFormat(d3.time.format("%b-%Y")).ticks(2);
	  //   }
		//
	  //   ySvg.call(yAxis);
		//
	  //   if ( source ) {
	  //     if(!source.stop){
	  //       source.stop = source.noteOff;
	  //     }
	  //     source.stop(0);
	  //   }
	  //   if ( lastSource ) {
	  //     if(!lastSource.stop){
	  //       lastSource.stop = lastSource.noteOff;
	  //     }
	  //     lastSource.stop(0);
	  //   }
		//
	  //   axis.transition().duration(500).call(xAxis);
		//
	  //   playing = true;
	  //   playMusic();
		//
	  // }

	  var searchArray = [];
	  var searchResults = d3.select(".search-results-new");
	  var searchResultMouseOver = false;


	  var searchInputLabel = d3.select(".search-input")
	      .on("keyup", keyupedLabel);

	  function artistClean(artist){
	    return artist.split(" Featuring")[0];
	  }

	  function keyupedLabel() {
	    searchLabel(this.value.trim(),searchData);
	  }

	  function searchLabel(value,searchData) {

	    if (value.length > 2) {

	      d3.select(".cumulative-stats").style("display","none");
	      searchResults.style("display","block");

	      var re = new RegExp("\\b" + d3.requote(value), "i");

	      var artistPaths = _.filter(searchData, function(d,i) {
	        return re.test(d.key);
	      })
	      ;

	      // for (artist in artistPaths){
	      //   artistPaths[artist].values = artistPaths[artist].values.filter(function(d,i){
	      //     return chartMap.has(artistPaths[artist].values[track].key) == true;
	      //   })
	      // }

	      d3.selectAll(".search-result-wrapper").remove();

	      for (artist in artistPaths){
	        for (track in artistPaths[artist].values){
	          var dates = chartMap.get(artistPaths[artist].values[track].key).nestedDateArray;
	          var datesArray = Object.keys(dates);
	          var min_date = datesArray[0];
	          for (item in datesArray){
	            if (min_date > datesArray[item] && dates[datesArray[item]] < 6){
	              min_date = datesArray[item]
	            }
	          }
	          artistPaths[artist].values[track].min_date = parseDate(min_date);
	        }
	      }

	      var searchData = searchResults.selectAll("p")
	        .data(artistPaths, function(d){
	          return d.key;
	        })
	        ;

	      var searchEnter = searchData
	        .enter()
	        .append("div")
	        .attr("class","tk-futura-pt search-result-wrapper")
	        ;

	      searchEnter
	        .append("p")
	        .attr("class","tk-futura-pt search-result-artist")
	        .text(function(d){
	          return d.key;
	        })
	        ;

	      var searchTrackContainer = searchEnter.append("div")
	        .attr("class","tk-futura-pt search-result-tracks-container")
	        ;

	      var searchTrackRows = searchTrackContainer
	        .selectAll("div")
	        .data(function(d,i){
	          return d.values
	        })
	        .enter()
	        .append("div")
	        .sort(function(a,b) {return a.min_date-b.min_date;})
	        .attr("class","tk-futura-pt search-result-track-wrapper")
	        ;

	      searchTrackRows
	        .append("p")
	        .attr("class","tk-futura-pt search-result-track-text")
	        .text(function(d,i){
	          if(d.title.length > 20){
	            return d.title.slice(0,18)+"..."
	          }
	          return d.title;
	        })
	        ;

	      searchTrackRows
	        .append("p")
	        .attr("class","tk-futura-pt search-result-track-date")
	        .text(function(d){
	          return sideBarParse(d.min_date);
	        })
	        .on("click",function(d){
	          var date = unParse(d3.time.day.offset(d.min_date,(-7*3)));
	          moveChart(date);
	        })
	        ;

	        searchData.exit().remove();

	    }
	    else {
	      d3.select(".cumulative-stats").style("display","block");
	      searchResults.style("display","none");
	    }
	  }

	  var sampleRotate;

		console.log(testDates);

	  d3.select(".paused-play-button-two")
	    .on("click",function(){
	      d3.select("body").style("height","auto").style("overflow","auto");
	      d3.select(".screen").transition().duration(500).style("opacity",0).transition().duration(500).delay(500).style("display","none");
	      d3.select(".content").style("opacity",1);
	      setTimeout(function(){
	        playMusic();
	      }, 200);
	      d3.select(".paused-play-button-two").style("pointer-events","none");
	    })


		function moveChart(d){

	    if ( source ) {
	      if(!source.stop){
	        source.stop = source.noteOff;
	      }
	      source.stop(0);
	    }

	    if ( lastSource ) {
	      if(!lastSource.stop){
	        lastSource.stop = lastSource.noteOff;
	      }
	      lastSource.stop(0);
	    }

	    if(playing==true){
	      transition = transition.transition(0).duration(0);
	    }

	    playing = true;

	    var dateSelected = new Date(+d);
			var goal = numParse(dateSelected);
			var closest = weeksForDateLines.reduce(function(prev, curr) {
  			return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
			});

			//interate through 17 weeks by adding 7 to the start day

			dates = [numParseDate(JSON.stringify(closest))];
			var i;
			for (i=0; i<n; i++){
			  var length  = dates.length;
			  var date = d3.time.day.offset(dates[length - 1],7);
			  dates.push(date);
			}

			var dateAhead = unParse(d3.time.day.offset(dates[0], 7));
			let twoDatesAhead = unParse(d3.time.day.offset(dates[0], 14));
			var currentDate = unParse(dates[0]);

	    // x.domain([dates[2], dates[dates.length-1]]);
			//
	    // var duration1 = 800;
	    // var duration2 = 400;
			//
	    // filteredData = testDates.get(unParse(dates[dates.length-1]).slice(0,7)).values;
			x.domain([dates[0], dates[dates.length-1]]);

			// changeYear(currentYear);

	    window.clearTimeout(tickDelay);
			//
	    tickDelay = setTimeout(function(){

	      if(muted == false){

	        for (i=2; i<20; i++){
	          var timeOne = d3.time.day.offset(dates[0], 7);
	          var timeTwo = d3.time.day.offset(dates[0], 7*i);
	          if(nestedDatesTwo[unParse(timeOne)]["track"] != nestedDatesTwo[unParse(timeTwo)]["track"]){
	            playLength = Math.max((i-1) * shiftDuration,shiftDuration);
	            break;
	          }
	        }

	        var currTime = context.currentTime;
	      //
	        var currSong;
	        var previewItemId = nestedDatesTwo[unParse(d3.time.day.offset(dates[dates.length-1], 7))]["preview"];
	        currSong = "https://p.scdn.co/mp3-preview/" + previewItemId
	        if(previewItemId == "manual"){
	          var hostUrl = document.location.origin;
	          var pathUrl = document.location.pathname.replace("index.html","");
	          var idSong = nestedDatesTwo[unParse(d3.time.day.offset(dates[dates.length-1], 7))]["track"];
	          currSong = hostUrl+pathUrl+"url/"+idSong + ".m4a"
	        }

	        startTime = currTime + 1;
	        loadSounds(currSong, playLength, startTime, "now");

	      }
	      transition = d3.select({}).transition()
	          .duration(shiftDuration)
	          .ease("linear");


	      tick();

	    }, 100);

	  };




	  function textFill(d){
	    var rank = d.nestedDateArray[currentDate];
	    if (rank == 1){
	      return colorTwo;
	    }
	    else{
	      return textColor;
	    }
	  }

	  function pathStroke(d){

			if (dateAhead in d.nestedDateArray){
				var rank = d.nestedDateArray[dateAhead];
				return "url(#temperature-gradient)";

				if(rank==1){
					return "red";
				}
				else{
				  return "url(#temperature-gradient)";
				}

				// if(rank==2){
				// 	return "blue";
				// }
				// if(rank==3){
				// 	return "green";
				// }
				// if(rank==4){
				// 	return "purple";
				// }
				// return "yellow";
			}
			return "#fff";

	    // var rank = d.nestedDateArray[currentDate];
	    // if (rank == 1){
	    //   return "url(#temperature-gradient)";
	    //   // return colorTwo;
	    // }
	    // else{
	    //   return "url(#temperature-gradient)";
	    // }
	  }

		function faceBorder(d){
	    if (dateAhead in d.nestedDateArray){
	      var rank = d.nestedDateArray[dateAhead];
				return colorScheme[5-rank];
	    }
			return null;
	  }
		function faceShadow(d){
			if (dateAhead in d.nestedDateArray){
				var rank = d.nestedDateArray[dateAhead];
				if(rank == 1){
					return "1px 3px 6px #800080, 1px 3px 9px #800080";
				}
			}
			return null;
		}



	  function pathOpacity(d){
	    if (dateAhead in d.nestedDateArray){
	      var rank = d.nestedDateArray[dateAhead];
	      if(rank==1){
	        return 1;
	      }
				if(rank==2){
					return .8
				}
	      return .6;
	    }
	    return .1;
	  }

		function pathStrokeWidth(d){
	    if (dateAhead in d.nestedDateArray){
	      var rank = d.nestedDateArray[dateAhead];
	      if(rank==1){
	        return null;
	      }
	      return "2px";
	    }
	    return "1px";
	  }

	  d3.select(".number-one").transition().duration(5000).text(function(d){
	    var date = niceParseTwo(dates[dates.length-1]);
	    return date;
	  });

	  d3.select(".number-one-artist")
	    .style("color",null)
	    .text(topArtist)
	    ;

	  axis = xSvg.append("g").attr("class", "x axis tk-futura-pt")
	    .attr("transform", function(){
	      var shift = height + 60;
	      return "translate(0," + shift +")";
	    })
	    .call(xAxis)
	    ;

	  var transition = d3.select({}).transition()
	      .duration(shiftDuration)
	      .ease("linear");

	  var tickCount = 0;

	  var dataTopArtist = Object.keys(topArtistCountArray).map(function(d){
	    return {"artist":d,"count":topArtistCountArray[d]};
	  });

		var extentDates = d3.extent(nestedDates,function(d){
			return parseDate(d.key);
		})


		var yearArray = [];
		var yearsForPips = ["1960-01","1970-01","1980-01","1990-01","2000-01","2010-01"]


		for (var date in yearsForPips){
			var items = testDates.get(yearsForPips[date]);
			var last = items.values[items.values.length-1].chart_date.getTime()
			yearArray.push(last);
		}

		function toFormatYear ( v ) {
		  return yearParse(new Date(+v));
		}

		function toFormat ( v ) {
			return niceParse(new Date(+v));
		}

		// Add a formatter to the slider


		var sliderDates = noUiSlider.create(d3.select("#slider").node(), {
		    start: [start.getTime()],
				step: 7 * 24 * 60 * 60 * 1000,
		    range: {
		        'min': extentDates[0].getTime(),
		        'max': extentDates[1].getTime()
		    },
				format: { to: toFormat, from: Number },
				connect: [true, false],
				tooltips: [true],
				pips: {
					mode: 'values',
					values: yearArray,
					density: 4,
					stepped: true,
					format: { to: toFormatYear, from: Number }
				}
		});

		sliderDates
			.on('start', function (values, handle) {
				dragging = true;
			});


		sliderDates
			.on('change', function (values, handle, unencoded, tap, positions) {
				console.log(values,handle,unencoded,tap, positions);
				moveChart(unencoded)
			});



		sliderDates
			.on('end', function (values, handle) {
				dragging = false;
			});

		let playVisible = true;

		d3.select(".play-pause").on("click",function(){
			if(playVisible){
				playVisible = false;
				d3.select(".play-pause").select(".play-button").style("display","none");
				d3.select(".play-pause").select(".pause-button").style("display","block");
			}
			else {
				playVisible = true;
				d3.select(".play-pause").select(".play-button").style("display",null);
				d3.select(".play-pause").select(".pause-button").style("display",null);
			}
		})

		// d3.selectAll(".noUi-value").text(function(d){
		// 	return yearParse(new Date(+d3.select(this).text()));
		// })

		function clickOnPip() {
			var value = this.getAttribute('data-value');
			sliderDates.set(Number(value));
			moveChart(Number(value))
		}

		var pips = d3.select("#slider").selectAll('.noUi-value').each(function(d){
			d3.select(this).node().addEventListener('click', clickOnPip);
		});


	  function tick() {

	    var currTime = context.currentTime;

	    for (var i in dates){
	      dates[i] = d3.time.day.offset(dates[i], 7);
	    };

	    var nextSong;

	    if(nestedDatesTwo[unParse(dates[0])]["track"] != nestedDatesTwo[unParse(d3.time.day.offset(dates[0], 7))]["track"] && muted == false){

	      for (i=2; i<20; i++){
	        var timeOne = d3.time.day.offset(dates[0], 7);
	        var timeTwo = d3.time.day.offset(dates[0], 7*i);
	        if(nestedDatesTwo[unParse(timeOne)]["track"] != nestedDatesTwo[unParse(timeTwo)]["track"]){
	          playLength = (i-1) * shiftDuration;
	          break;
	        }
	      }

	      var previewItemId = nestedDatesTwo[unParse(d3.time.day.offset(dates[0], 7))]["preview"];

	      nextSong = "https://p.scdn.co/mp3-preview/" + previewItemId
	      if(previewItemId == "manual"){
	        var hostUrl = document.location.origin;
	        var pathUrl = document.location.pathname.replace("index.html","");
	        var idSong = nestedDatesTwo[unParse(d3.time.day.offset(dates[0], 7))]["track"];
	        nextSong = hostUrl+pathUrl+"url/"+idSong + ".m4a"
	      }
	      startTime = currTime + shiftDuration/1000;

	      loadSounds(nextSong, playLength, startTime, "scheduled");
	    };

			currentDate = unParse(dates[0]);
	    dateAhead = unParse(d3.time.day.offset(dates[0], 7));
			twoDatesAhead = unParse(d3.time.day.offset(dates[0], 14));

	    changeYear(currentYear);

	    var numberOneDates = [dates[0]];

	    for (i=0; i<8; i++){
	      var length = numberOneDates.length;
	      var date = d3.time.day.offset(numberOneDates[length - 1],1);
	      numberOneDates.push(date);
	    }

			if(!dragging){
				console.log(dragging);
				sliderDates.set(Number(dates[0].getTime()));
			}

	    transition = transition.each(function() {

	      var numberShiftDuration = shiftDuration/7;

	      d3.select(".year-drop-down-text").text(currentDate.slice(0,4));

	      d3.select("#top-date-sub")
	        .transition().duration(numberShiftDuration).text(function(d){
	          return niceParseTwo(numberOneDates[0]);
	        })
	        .transition().duration(numberShiftDuration).text(function(d){
	          return niceParseTwo(numberOneDates[1]);
	        })
	        .transition().duration(numberShiftDuration).text(function(d){
	          return niceParseTwo(numberOneDates[2]);
	        })
	        .transition().duration(numberShiftDuration).text(function(d){
	          return niceParseTwo(numberOneDates[3]);
	        })
	        .transition().duration(numberShiftDuration).text(function(d){
	          return niceParseTwo(numberOneDates[4]);
	        })
	        .transition().duration(numberShiftDuration).text(function(d){
	          return niceParseTwo(numberOneDates[5]);
	        })
	        .transition().duration(numberShiftDuration).text(function(d){
	          return niceParseTwo(numberOneDates[6]);
	        })
	        .transition().duration(numberShiftDuration).text(function(d){
	          return niceParseTwo(numberOneDates[7]);
	        })
	        ;


	      if(!mobile){
	        var topArtistName = nestedDatesTwo[currentDate].artist.split(" Feat")[0];
	        if(topArtistName in topArtistCountArray){
	          topArtistCountArray[topArtistName] = topArtistCountArray[topArtistName] + 1;
	        }else{
	          topArtistCountArray[topArtistName] = 1;
	        }
	        ;

	        var dataTopArtistUpdated = Object.keys(topArtistCountArray).map(function(d){
	          return {"artist":d,"count":topArtistCountArray[d]};
	        }).sort(function(a,b) {return b.count-a.count;})
	        .filter(function(d,i){
	          return i < 10;
	        })
	        ;

	        cumulativeStats = d3.select(".cumulative-container").selectAll("p")
	          .data(dataTopArtistUpdated,function(d){
	            return d.artist;
	          })
	          ;

	        cumulativeStats
	          .enter()
	          .append("p")
	          .attr("class","cumlative-artist")
	          ;

	        d3.selectAll(".cumlative-artist")
	          .sort(function(a,b) {return b.count-a.count;})
	          .text(function(d){
	            return d.artist + ": " + d.count;
	          })
	          ;

	        cumulativeStats.exit().remove();
	      }

				d3.select("#top-title-sub").text(nestedDatesTwo[unParse(dates[0])].title);


	      if(nestedDatesTwo[unParse(dates[0])]["track"] != nestedDatesTwo[unParse(dates[1])]["track"]) {
	        countStreak = 1;
					// d3.select("#top-title-sub").text(nestedDatesTwo[unParse(dates[0])].title);

					//var topArtistName = nestedDatesTwo[currentDate].artist.split(" Feat")[0];

					d3.select(".streak").style("opacity",0);

					//d3.select(".streak").select(".big").text(countStreak)

	      } else{
					countStreak = countStreak + 1;
					if(countStreak > 2){
						d3.select(".streak").style("opacity",1);
					}
					d3.select(".streak").select(".big")
						.text(countStreak).style("font-size","70px")

						window.setTimeout(function(){
							d3.select(".streak").select(".big")
								.style("font-size",null)
						},100)
				}

	      x.domain([dates[0], dates[dates.length-1]]);

				fixedFace.style("background-image",function(d,i){
						var data = rankingMap.get(currentDate).values[i];
						return faceBackgroundImage(data);
					})
					.style("top",function(d){
						return x(dates[1])+"px";
					})

				face.select("p")
					.style("color",function(d){
						if (dateAhead in d.nestedDateArray){
							var rank = d.nestedDateArray[dateAhead];
							if(rank==1){
								return "#fff"
							}
						}
						return null;
					})
					.style("font-size",function(d){
						if (dateAhead in d.nestedDateArray){
							var rank = d.nestedDateArray[dateAhead];
							if(rank==1){
								return "18px"
							}
						}
						return null;
					})

	      face
					.style("opacity",function(d){
						return faceOpacity(d)
	        })
					.style("width",faceSize+"px")
					.style("height",faceSize+"px")
					.style("border-color",function(d){
						return faceBorder(d);
					})
					.style("box-shadow",function(d){
						return faceShadow(d);
					})
	        .transition()
					.style("top",function(d){
						return faceTop(d);
					})
					.style("left",function(d){
						var data = d;
						return faceLeft(data);
					})
	        ;

				lines
					.style("top",function(d){
						return x(d)+"px";
					})
					.transition()
					.style("opacity",function(d,i){
						if(i==0){
							return 0;
						}
					})

				d3.select(".date-lines-container")
					.style("transform", "translate(0px,"+ x(d3.time.day.offset(dates[dates.length-1], 7)) + "px)")
					.transition()
					.styleTween('transform', function (d) {
							return d3.interpolateString("translate(0px,"+ x(d3.time.day.offset(dates[dates.length-1], 7)) + "px)", "translate(0px,0px)");
					})
					;

	     path
				.attr("d", function(d){
						//return lineFunction(d.values);
						return line(d.values);
	          return line(getPathWeeks(d));
	        })
					// .style("filter",function(d){
					// 	if (dateAhead in d.nestedDateArray){
					// 		if(d.nestedDateArray[dateAhead] == 1){
					// 			return null;
					// 		}
					// 	}
					// 	return "url(#outline)";
					// })
	        .style("stroke", function(d){
	          var data = d;
	          return pathStroke(data);
	        })
					.style("opacity", function(d){
						var data = d;
						return pathOpacity(data);
					})
					.style("stroke-width", function(d){
						var data = d;
						return pathStrokeWidth(data);
					})
					.each(function(d,i){
						if (dateAhead in d.nestedDateArray){
							var rank = d.nestedDateArray[dateAhead];
							if(rank==1){
								clone(d3.select(this)).attr('filter', 'url(#blurred)').style("stroke",colorScheme[0]).attr("id","glow").style("stroke-width",'10px').style("opacity",1)
							}
							else{
								clone(d3.select(this))
									//.attr('filter', 'url(#blurredTwo)')
									.style("stroke","rgb(17,17,17)").attr("id","glow").style("stroke-width",'6px');
							}
						}
					})

				d3.select(".path-container").selectAll("path")
					.attr("transform", "translate(0,"+ x(d3.time.day.offset(dates[dates.length-1], 7)) + ")")


				d3.select(".path-container").selectAll("path")
	        .transition()
					.attr("transform", "translate(0,0)")
	        ;

	        axis.call(xAxis);


	      // }).transition().each("start", tick);
	      }).transition().each("start", function(){
	        if (this.__transition__.count < 2) tick();
	      //   //tick();
	      });
	      // });
	    };

	  (function() {
	    hidden = "hidden";

	    // Standards:
	    if (hidden in document)
	      document.addEventListener("visibilitychange", onchange);
	    else if ((hidden = "mozHidden") in document)
	      document.addEventListener("mozvisibilitychange", onchange);
	    else if ((hidden = "webkitHidden") in document)
	      document.addEventListener("webkitvisibilitychange", onchange);
	    else if ((hidden = "msHidden") in document)
	      document.addEventListener("msvisibilitychange", onchange);
	    // IE 9 and lower:
	    else if ("onfocusin" in document)
	      document.onfocusin = document.onfocusout = onchange;
	    // All others:
	    else
	      window.onpageshow = window.onpagehide
	      = window.onfocus = window.onblur = onchange;

	    function onchange (evt) {
	      var v = "visible", h = "hidden",
	          evtMap = {
	            focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
	          };

	      evt = evt || window.event;
	      if (evt.type in evtMap){
	      }
	      else {
	        if(this[hidden] == true){
	          if(playing){
	            pause();
	          }
	        }else{
	          if(playing){
	            playMusic();
	          }
	        }
	      }
	    }

	    // set the initial state (but only if browser supports the Page Visibility API)
	    if( document[hidden] !== undefined )
	      onchange({type: document[hidden] ? "blur" : "focus"});
	  })();

	  var chartWideContainer = d3.select(".change-year-wide");

	  var chartWide = d3.select(".change-year-wide-data");

	  var shortCut = d3.selectAll(".text-section");
	  var markerMoveScale = d3.scale.linear().domain([nestedDates.length,0]).range([0,530])

	  shortCut.on("click",function(d,i){
	    d3.select(".bio-info").transition().duration(300).style("opacity",1);
	    var dateSelected;
	    if(i==0){
	      dateSelected = 1343;
	    }
	    else if (i==1){
	      dateSelected = 1154;
	    }
	    else if (i==2){
	      dateSelected = 1099;
	    }
	    else if (i==3){
	      dateSelected = 1045;
	    }
	    else if (i==4){
	      dateSelected = 1040;
	    }
	    else if (i==5){
	      dateSelected = 924;
	    }
	    // chartWideMarker.transition().duration(200).style("left",function(d){
	    //   return markerMoveScale(dateSelected) - 10 + "px";
	    // })
	    if(playing){
	      // var coordinates = d3.mouse(this);
	      // chartWideMarker.style("left",function(d){
	      //   return coordinates[0] - 8 + "px"

	      // })
	      // chartWideMarkerMouseMove.style("opacity",0);
	      moveChart(nestedDates[dateSelected].key);
	    }
	    else if(!playing){
	      trackLegend.style("visibility","hidden");
	      face.style("visibility","visible");
	      text.style("visibility","visible");
	      clickPlayTip.style("visibility","visible");
	      y.domain([10, 1]);
	      x.domain([dates[2], dates[dates.length-1]]);
	      yAxis
	        .scale(y)
	        .tickFormat(function(d,i){
	          if(d==1){
	          return "#" + d;
	          }
	          return d;
	        })
	        .innerTickSize(-width)
	        .tickValues( y.ticks( 10 ).concat( y.domain() ) )
	        .tickPadding(5)
	        .orient("left")
	        ;
	      xAxis
	        // .scale(x)
	        .ticks(5)
	        .tickFormat(d3.time.format("%b-%d %Y"))
	        ;

	      if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	        xAxis.tickFormat(d3.time.format("%b-%Y")).ticks(2);
	      }
	      ySvg.call(yAxis);
	      axis.transition().duration(100).call(xAxis);
	      pausePlay.style("pointer-events","none");
	      moveChart(nestedDates[dateSelected].key);
	    }
	  })
	  ;

	  var yearDecadeNest = d3.nest()
	    .key(function(d){
	      return d.key.slice(0,3);
	    })
	    .key(function(d){
	      return d.key.slice(0,4);
	    })
	    .sortKeys(function(a,b) { return +a - +b; })
	    .key(function(d){
	      return d.key.slice(5,7);
	    })
	    .sortKeys(function(a,b) { return +a - +b; })
	    .entries(nestedDates.slice(10,3015))
	    ;

	  function widthIdeal(d){
	    var yearLength = d.values.length;
	    if(mobile){
	      return null;
	    }
	    if (d.key == startString.slice(0,3)){
	      return "236px";
	    }
	    if(yearLength>4){
	      if(yearLength>8){
	        return "114px"
	      }
	      return "78px";
	    }
	    return null;
	  }

	  function widthExpanded(d){
	    if(mobile){
	      return null;
	    }
	    var yearLength = d.values.length;
	    if(yearLength>4){
	      if(yearLength>8){
	        return "208px"
	      }
	      return "192px";
	    }
	    return "146px";
	  }

	  var decadeBucket = chartWide.selectAll("div")
	    .data(yearDecadeNest)
	    .enter()
	    .append("div")
	    .attr("class","chart-year-wide-data-decade-container")
	    .style("width",function(d,i){
	      var data = d;
	      return widthIdeal(data);
	    })
	    .on("touchstart",function(d,i){
	      if(mobile){
	        var mouseOvered = d3.select(this);
	        var notSelected = decadeBucket.select("div")
	          .style("pointer-events","none")
	          .selectAll(".chart-year-wide-data-year")
	          .style("opacity",null)
	          ;
	        mouseOvered.select("div")
	          .style("visibility","visible")
	          .style("pointer-events","all")
	          .selectAll(".chart-year-wide-data-year")
	          .style("opacity",1)
	          ;
	      }
	    })
	    .on("mouseover",function(d,i){
	      if(!mobile){
	        var mouseOvered = d3.select(this);

	        var notSelected = decadeBucket.filter(function(d,i){
	          return d.key != startString.slice(0,3);
	        })
	        ;

	        notSelected
	          .selectAll(".chart-year-wide-data-year")
	          .style("opacity",null)
	          ;

	        mouseOvered.select("div")
	          // .style("visibility","visible")
	          .selectAll(".chart-year-wide-data-year")
	          .style("opacity",1)
	          ;
	      }
	    })
	    .on("mouseout",function(d){
	      if(!mobile){
	        var notSelected = decadeBucket.filter(function(d,i){
	          return d.key != startString.slice(0,3);
	        })
	        ;
	        notSelected
	          .selectAll(".chart-year-wide-data-year")
	          .style("opacity",null)
	          ;
	      }
	    })
	    ;

	  decadeBucket.append("p")
	    .attr("class","chart-year-wide-data-decade-text")
	    .text(function(d){
	      return d.key + "0s";
	    })
	    ;

	  var yearBucket = decadeBucket
	    .append("div")
	    .attr("class","chart-year-wide-data-year-wrapper")
	    .selectAll(".chart-year-wide-data-year-container")
	    .data(function(d,i){
	      return d.values;
	    })
	    .enter()
	    .append("div")
	    .attr("class","chart-year-wide-data-year-container")
	    ;

	  var monthMap = {"01":"JAN","02":"FEB","03":"MAR","04":"APR","05":"MAY","06":"JUN","07":"JUL","08":"AUG","09":"SEP","10":"OCT","11":"NOV","12":"DEC"};

	  yearBucket.append("p")
	    .attr("class","chart-year-wide-data-year")
	    .text(function(d,i){
	      return d.key;
	    })
	    .on("click",function(d,i){

	      startString = d.values[0].values[0].key;

	      d3.select(".play-button-new").style("pointer-events","none").style("color",null);
	      d3.select(".pause-button-new").style("pointer-events","all").style("color","white");

	      moveChart(startString)

	      var notSelected = decadeBucket.filter(function(d,i){
	        return d.key != startString.slice(0,3);
	      })
	      ;

	      notSelected.select("p").style("color",null);
	      notSelected.select("div").selectAll("div").select("p").style("opacity",null).style("color",null);
	      notSelected.select("div").selectAll("div").select("div").style("visibility","hidden");

	      notSelected
	        .style("width",function(d,i){
	          var data = d;
	          return widthIdeal(data);
	        })
	        ;

	      var decade = d3.select(this.parentNode.parentNode.parentNode);

	      decade.select("p").style("color","#FF2F28")
	      decade.select("div").selectAll("div").select("div").style("visibility","hidden");
	      decade.select("div").selectAll("div").select("p").style("color",null).style("opacity",1);

	      decade.style("width",function(d,i){
	          var data = d;
	          return widthExpanded(data);
	        })
	        ;

	      var yearSelected = d3.select(this.parentNode);
	      //
	      yearSelected.select("p")
	        .style("color","#FF2F28")
	        ;
	      //
	      yearSelected.select("div").style("visibility","visible").selectAll("p")
	        .style("color",function(d,i){
	          if(i==0){
	            return "#FF2F28";
	          }
	          return null;
	        })
	        .style("opacity",0)
	        .transition()
	        .duration(300)
	        .delay(function(d,i){
	          return i*70;
	        })
	        .style("opacity",1)
	        ;
	    })
	    ;

	  var monthBucket = yearBucket.append("div")
	    .attr("class","chart-year-wide-data-month-container")
	    .style("left",function(d,i){
	      var yearLength = d3.select(this.parentNode.parentNode).datum().values.length;
	      if(yearLength > 8){
	        return "122px"
	      }
	      else if(yearLength < 5){
	        return "48px";
	      }
	      return null;
	    })
	    ;

	  monthBucket
	    .selectAll("p")
	    .data(function(d,i){
	      return d.values;
	    })
	    .enter()
	    .append("p")
	    .attr("class","chart-year-wide-data-month")
	    .text(function(d,i){
	      return monthMap[d.key];
	    })
	    .on("click",function(d,i){
	      d3.select(this.parentNode).selectAll("p").style("color",null);
	      d3.select(this).style("color","#FF2F28");
	      startString = d.values[0].key;
	      d3.select(".play-button-new").style("pointer-events","none").style("color",null);
	      d3.select(".pause-button-new").style("pointer-events","all").style("color","white");
	      if(startString.length<5){
	        startString = d.values[0].values[0].key;
	      }
	      moveChart(startString)

	    })
	    ;

	  var decadeSelected = decadeBucket.filter(function(d,i){
	    return d.key == startString.slice(0,3);
	  })
	  .style("width",function(d,i){
	    var data = d;
	    return widthExpanded(data);
	  })
	  ;

	  decadeSelected.select("p")
	    .style("color","#FF2F28")
	    ;

	  decadeSelected.select("div")
	    .style("visibility","visible")
	    .style("pointer-events","all")
	    ;

	  decadeSelected.selectAll(".chart-year-wide-data-year-container").select("p").style("opacity",1);

	  var yearSelected = decadeSelected.selectAll(".chart-year-wide-data-year-container")
	    .filter(function(d,i){
	      return d.key==startString.slice(0,4);
	    })
	    ;

	  yearSelected.select("p")
	    .style("color","#FF2F28")
	    ;

	  var monthSelected = yearSelected.select("div")
	    .style("visibility","visible")
	    .selectAll(".chart-year-wide-data-month")
	    .filter(function(d){
	      return d.key==startString.slice(5,7);
	    })
	    .style("color","#FF2F28")
	    ;

	  function playMusic(){

	    clearInterval(sampleRotate);
	    d3.select(".number-one-date-wrapper").style("opacity",1);

	    var playNow2 = createSource(scratch);
	    var source2 = playNow2.source;

	    if (!source2.start){
	      source2.start = source.noteOn;
	    }
	    source2.start(0);

	    var delayTime = 100;
	    playing = true;

	    tickDelay = setTimeout(function(){

	      if(muted == false){

	        for (i=2; i<20; i++){
	          var timeOne = d3.time.day.offset(dates[dates.length-1], 7);
	          var timeTwo = d3.time.day.offset(dates[dates.length-1], 7*i);
	          if(nestedDatesTwo[unParse(timeOne)]["track"] != nestedDatesTwo[unParse(timeTwo)]["track"]){
	            playLength = Math.max((i-1) * shiftDuration,shiftDuration);
	            break;
	          }
	        }

	        var currTime = context.currentTime;
	      //
	        var currSong;
	        var previewItemId = nestedDatesTwo[unParse(d3.time.day.offset(dates[dates.length-1], 7))]["preview"];
	        currSong = "https://p.scdn.co/mp3-preview/" + previewItemId
	        if(previewItemId == "manual"){
	          var hostUrl = document.location.origin;
	          var pathUrl = document.location.pathname.replace("index.html","");
	          var idSong = nestedDatesTwo[unParse(d3.time.day.offset(dates[dates.length-1], 7))]["track"];
	          currSong = hostUrl+pathUrl+"url/"+idSong + ".m4a"
	        }
	        startTime = currTime + 1;
	        loadSounds(currSong, playLength, startTime, "now");
	    //
	      }
	      transition = d3.select({}).transition()
	          .duration(shiftDuration)
	          .ease("linear");

	      tick();

	    }, delayTime);

	  }

	  function pause(){
	    transition = transition.transition(0).duration(0);
	    axis.transition().duration(0);
	    face.transition().duration(0);
	    path.transition().duration(0);
	    d3.selectAll(".number-one").transition().duration(0);

	    if ( source ) {
	      if(playing == true){
	        if(!source.stop){
	          source.stop = source.noteOff;
	        }
	        source.stop(0);
	      }
	    }

	    if ( lastSource ) {
	      if(playing == true){
	        if(!lastSource.stop){
	          lastSource.stop = lastSource.noteOff;
	        }
	        lastSource.stop(0);
	      }
	    }

	  }

	  d3.select(".pause-button-new").on("click",function(){
	    if(playing){
	      d3.select(this).style("pointer-events","none").style("color",null);
	      d3.select(".play-button-new").style("pointer-events","all").style("color","white");
	      playing = false;

	      if ( source ) {
	        if(!source.stop){
	          source.stop = source.noteOff;
	        }
	        source.stop(0);
	      }
	      if ( lastSource ) {
	        if(!lastSource.stop){
	          lastSource.stop = lastSource.noteOff;
	        }
	        lastSource.stop(0);
	      }
	      pause();
	    }
	  });

	  d3.select(".play-button-new").on("click",function(){
	    if(!playing){
	      d3.select(this).style("pointer-events","none").style("color",null);
	      d3.select(".pause-button-new").style("pointer-events","all").style("color","white");
	      playing = true;
	      playMusic();
	    }
	  })
	  ;
	});
	});
	openingAnimation();
	});

	function BufferLoader(context, urlList, callback, playingLength, startingTime, thing) {
	  this.context = context;
	  this.urlList = urlList;
	  this.onload = callback;
	  this.bufferList = new Array();
	  this.loadCount = 0;
	  this.startingTime = startingTime;
	  this.playingLength = playingLength;
	  this.thing = thing;
	}

	BufferLoader.prototype.loadBuffer = function(url, index) {
	  // Load buffer asynchronously
	  var request = new XMLHttpRequest();
	  request.open("GET", url, true);
	  request.responseType = "arraybuffer";

	  var loader = this;

	  request.onload = function() {
	    // Asynchronously decode the audio file data in request.response
	    loader.context.decodeAudioData(
	      request.response,
	      function(buffer) {
	        if (!buffer) {
	          alert('error decoding file data: ' + url);
	          return;
	        }
	        loader.bufferList[index] = buffer;
	        if (++loader.loadCount == loader.urlList.length)
	          loader.onload(loader.bufferList, loader.playingLength, loader.startingTime, loader.thing);
	      },
	      function(error) {
	        console.error('decodeAudioData error', error);
	      }
	    );
	  }

	  request.onerror = function() {
	    alert('BufferLoader: XHR error');
	  }

	  request.send();
	}

	BufferLoader.prototype.load = function() {
	  for (var i = 0; i < this.urlList.length; ++i)
	  this.loadBuffer(this.urlList[i], i);
	}

	function loadScratch(url) {
	  var req = new XMLHttpRequest();
	  req.open("GET",url,true);
	  req.responseType = "arraybuffer";
	  req.onload = function() {
	      //decode the loaded data
	      context.decodeAudioData(req.response, function(buffer) {
	          scratch = buffer;
	      });
	  };
	  req.send();
	}

	function loadHit(url) {
	  var req = new XMLHttpRequest();
	  req.open("GET",url,true);
	  req.responseType = "arraybuffer";
	  req.onload = function() {
	      //decode the loaded data
	      context.decodeAudioData(req.response, function(buffer) {
	          hit = buffer;
	      });
	  };
	  req.send();
	}

	function play() {
	    //create a source node from the buffer
	    var src = context.createBufferSource();
	    src.buffer = buf;
	    //connect to the final output node (the speakers)
	    src.connect(context.destination);
	    //play immediately
	    src.noteOn(0);
	}

	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext();
	loadScratch("url/i_wish.mp3");
	// loadHit("url/scratch.wav");

	function loadSounds(url,playingLength,startingTime,thing){
	  if(url == "https://p.scdn.co/mp3-preview/NULL"){
	    console.log("null song");
	  }
	  else{
	    var bufferLoader = new BufferLoader(
	      context,
	      [
	        url
	      ],
	      finishedLoading,playingLength,startingTime,thing
	      );

	    bufferLoader.load();
	  }

	}

	function finishedLoading(bufferList,playingLength,startingTime,thing) {
	  playHelper(bufferList[0],playingLength,startingTime,thing);
	};


	function createSource(buffer) {
	  var source = context.createBufferSource();
	  var gainNode = context.createGain ? context.createGain() : context.createGainNode();
	  source.buffer = buffer;
	  // Connect source to gain.
	  source.connect(gainNode);
	  // Connect gain to destination.
	  gainNode.connect(context.destination);

	  return {
	    source: source,
	    gainNode: gainNode
	  };
	}

	function playHelper(bufferNow,playingLength,startingTime,thing) {

	    var currTime = context.currentTime;

	    lastSource = source;

	    var playNow = createSource(bufferNow);
	    source = playNow.source;
	    source.loop = true;
	    var gainNode = playNow.gainNode;
	    var duration = playingLength/1000 + 2;

	    gainNode.gain.linearRampToValueAtTime(0, startingTime);
	    gainNode.gain.linearRampToValueAtTime(1, startingTime + 2);

	    if (!source.start){
	      source.start = source.noteOn;
	    }

	    source.start(context.currentTime + (startingTime - context.currentTime));

	    gainNode.gain.linearRampToValueAtTime(1, startingTime + duration-2);
	    gainNode.gain.linearRampToValueAtTime(0, startingTime + duration);

	}

	function openingAnimation(){

	  var rows = Math.floor(viewportHeight/50);
	  var columns = Math.floor(viewportWidth/50);
	  var columnRange = d3.range(0,columns*50,50);
	  var columnRangeOne = columnRange.slice(0,Math.floor(columns*.33));
	  var columnRangeTwo = columnRange.slice(Math.floor(columns*.66),columnRange.length-1);
	  var columnScale = d3.scale.quantize().domain([0,1]).range(columnRangeOne.concat(columnRangeTwo));
	  d3.select(".opening-one")
	    .text("How Music")
	    ;

	  if(!mobile){
	    setTimeout(function(){
	      d3.selectAll(".images-screen").selectAll(".img-screen")
	        .style("top",function(d,i){
	          var change = i*50;
	          return change+"px";
	        })
	        .style("left",function(d,i){
	          var change = columnScale(Math.random());
	          // var change = (Math.floor(Math.random()*rows))*50;
	          // var change = i*50;
	          return change+"px";
	        })
	        .transition()
	        .duration(1500)
	        .delay(function(d,i){
	          return i*350;
	        })
	        .ease("linear")
	        .style("opacity",.2)
	        .style("left",function(d,i){
	          var left = d3.select(this).style("left").replace("px","");
	          if(left<viewportWidth/2){
	            var change = +left+(25);
	            return change+"px";
	          }
	          return left+"px";
	        })
	        ;
	    }, 100);

	    setTimeout(function(){
	      d3.selectAll(".opening-two")
	        .transition()
	        .duration(500)
	        .ease("cubic")
	        .style("opacity",1)
	        ;
	      d3.select(".opening-one")
	        .transition()
	        .duration(500)
	        .ease("cubic")
	        .style("margin-top","0px")
	        .style("opacity",1)
	        ;

	      d3.selectAll(".description-section")
	        .transition()
	        .duration(500)
	        .delay(400)
	        .ease("cubic")
	        .style("opacity",1)
	        ;

	      d3.selectAll(".button-border")
	        .transition()
	        .duration(800)
	        .delay(1000)
	        .ease("exp")
	        .style("width","100%")
	        ;

	      d3.selectAll(".text-load")
	        .transition()
	        .duration(800)
	        .delay(1100)
	        .ease("exp")
	        .style("opacity",1)
	        ;

	    }, 1600);
	  }
	  else{
	    d3.selectAll(".opening-two")
	      .style("opacity",1)
	      ;
	    d3.select(".opening-one")
	      .text("How Music")
	      ;

	    d3.selectAll(".description-section")
	      .style("opacity",1)
	      ;

	    d3.selectAll(".button-border")
	      .style("width","100%")
	      ;

	    d3.selectAll(".text-load")
	      .style("opacity",1)
	      ;

	    d3.selectAll(".button-symbol")
	      .style("opacity",1)
	      ;

	  }
	}
}
