/* global d3 */


import noUiSlider from "nouislider";
//import 'nouislider/distribute/nouislider.css';
var countStreak = 1;
let dragging = false;
let svg = null;
let fixedFace = null;
let faces = null;
let face = null;
let lines = null;
let faceAdjust = 0;
let globalGain = null;
let source2 = null;

var viewportWidth;
var viewportHeight;

viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

var margin = {top: 0, right: 0, bottom: 0, left:0},
		width = Math.min(1100,viewportWidth) - margin.left - margin.right,
		height = (712 - 112) - margin.top - margin.bottom;

let faceSize = Math.min((width-40)/5,110);

d3.select(".ranking").style("margin-left",function(){
	if(viewportWidth > 420){
		return faceSize/2+"px"
	}
	return null;
})

if(viewportWidth < 700){
	width = Math.floor(viewportWidth,550)
}
if(viewportWidth < 421){
	width = viewportWidth - 0;
	height = 550;
	//faceSize = Math.min(faceSize,(width)/5);
}

// if(viewportHeight - 112 < 600){
// 	height = viewportHeight - 112;
// }

d3.select(".chart").style("width",width+"px").style("height",height+"px")

function resize() {}

function init() {
	newCode()
}

export default { init, resize };

function newCode(){
	var cumulativeStats = d3.select(".cumulative-container");
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
	var shiftDuration = 3000;
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
	var niceParseThree = d3.time.format("%b %e, '%y");

	if(viewportWidth < 700){
		niceParseThree = d3.time.format("%b<br>%Y");
	}

	var numParse = d3.time.format("%Y%m%d");
	var numParseDate = d3.time.format("%Y%m%d").parse;

	var sideBarParse = d3.time.format("%b '%y");
	var yearParse = d3.time.format("%Y")

	var uniqueRowsCsv = "assets/data/unique_rows_2019_1.csv";

	var startString = "1964-04-11";
	if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	  mobile = true;
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

	$( document ).ready(function() {

	d3.csv("assets/data/all_rows_2019_1.csv", function(error, data) {
	  d3.csv(uniqueRowsCsv, function(error, songsUnique) {

	  if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

	  }

	  var songsUniqueMap = d3.map(songsUnique, function(d){ return d.key });

	  var x = d3.time.scale().domain([dates[0],dates[dates.length-1]]).range([height, 0]);

	  var y = d3.scale.linear()
	      .domain([6, 1])
	      .range([width, 0])
				;

	  var line = d3.svg.line()
      .interpolate("linear")
      .x(function(d, i) {
				return y(+d.rank);
			})
			.y(function(d,i){
				return x(d.chart_date);
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
			return i % 4 == 0
		})

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

	    var duration1 = 800;
	    var duration2 = 400;

			var filteredDataFirst = testDates.get(unParse(dates[0]).slice(0,7)).values;
			if(dates[0] <= new Date(parseDate("2019-02-02"))){
				var filteredDataNext = testDates.get(unParse(d3.time.month.offset(dates[0],1)).slice(0,7)).values;
				var filteredDataThird = testDates.get(unParse(d3.time.month.offset(dates[0],2)).slice(0,7)).values;
				var filteredDataFourth = testDates.get(unParse(d3.time.month.offset(dates[0],2)).slice(0,7)).values;
				filteredData = _.unionBy(filteredDataFirst, filteredDataNext,filteredDataThird,filteredDataFourth, 'key');
			}
			else {
				filteredData = filteredDataFirst;
			}

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

	    path.enter()
				.append("path")
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
				// .style("display",function(d){
				// 	return faceDisplay(d)
				// })
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
				.append("p")
				.html(function(d){
					return niceParseThree(d);
				})
				;

	    face.enter()
				.append("div")
	      .attr("class","face tk-futura-pt")
				// .style("display",function(d){
				// 	return faceDisplay(d)
				// })
	      .style("background-image", function(d){
					if(changedYear == "scroll"){
						return null;
					}
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
					var title = d.track_info.title;
					if(title.length > 20){
						return title.slice(0,17)+"..."
					}
					return title;
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

		// var colorScheme = d3.schemeYlGnBu[5];
		//colorScheme = d3.schemeGnBu[5];
		var colorScheme = ["#49217a","#852c82","#b52f59","#f5af71","#fcfbbc"].reverse()
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
	    .attr("x", 0)
	    .attr("y", -500)
	    .attr("width", width)
	    .attr("height",function(d){
				if(viewportWidth < 326){
					return 500 + height - faceSize*.9
				}
				if(viewportWidth < 376){
					return 500 + height - faceSize*.8
				}
				if(viewportWidth < 411){
					return 500 + height - faceSize*.75
				}
				if(viewportWidth < 421){
					return 500 + height - faceSize*.7
				}
				return 500 + height - faceSize*.6
			})

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
			.style("stroke", function(d){
				//var data = d;
				//return "red"
				return pathStroke(d);
			})
			.style("opacity",function(d){
				var data = d;
				return pathOpacity(data);
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
					clone(d3.select(this)).attr('filter', 'url(#blurred)').style("stroke-width",'9px').style("stroke",colorScheme[0]).style("opacity",.8).attr("id","glow")
				}
			}
		})

		var bottomFrame = d3.select(".bottom-frame")
			.style("width",width+"px")
			//.style("width",(620)+"px")
			.style("height",height+"px");

		bottomFrame.select(".ranking").selectAll(".rank-num")
			.style("color",function(d,i){
				if(i==4){
					return "#71598e"
				}
				return colorScheme[colorScheme.length - i - 1];
			})
			;

		//guitar hero outline
		var guitarHeroOutline = d3.select(".guitar-frame")
			.style("width",width+"px")
			//.style("width",(620)+"px")
			.style("height",height+"px")
			.append("svg");

		// guitarHeroOutline.append("rect")
		// 	.attr("x","0")
		// 	.attr("y",height-30-1)
		// 	.attr("height",30)
		// 	.attr("width","100%")
		// 	;

		svg.append("linearGradient")
	      .attr("id", "white-fade")
	      .attr("gradientUnits", "userSpaceOnUse")
	      .attr("x1", 0)
				.attr("y1", -400)
	      .attr("x2", "20%")
				.attr("y2", height-30)
	      .selectAll("stop")
	        .data([
						{offset:(0)+"%",color:"rgba(255,255,255,0.0)"},
						{offset:(100)+"%",color:"rgba(255,255,255,1)"}
					]
				)
	      .enter().append("stop")
	        .attr("offset", function(d) { return d.offset; })
	        .attr("stop-color", function(d) { return d.color; });


		svg.append("linearGradient")
	      .attr("id", "yellow-fade")
	      .attr("gradientUnits", "userSpaceOnUse")
	      .attr("x1", 0)
				.attr("y1", -400)
	      .attr("x2", "20%")
				.attr("y2", height-30)
	      .selectAll("stop")
	        .data([
						{offset:(0)+"%",color:"rgb(255,193,7)",opacity: 0},
						{offset:(100)+"%",color:"rgb(255,193,7)",opacity: .2}
					]
				)
	      .enter().append("stop")
	        .attr("offset", function(d) { return d.offset; })
	        .attr("stop-color", function(d) { return d.color; })
					.attr("stop-opacity", function(d) { return d.opacity; });

		guitarHeroOutline.append("rect")
			.attr("x",0)
			.attr("width","20%")
			.attr("y",-400)
			.attr("height",function(d){
				return 400+height-30;
			})
			.style("fill","url(#yellow-fade)");

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
				return i*20+"%"
			})
			.attr("x2",function(d,i){
				if(i==0){
					return 1
				}
				if(i==5){
					return "100%"
				}
				return i*20+"%"
			})
			.attr("y1",function(d){
				return -400
			})
			.attr("y2",function(d){
				return height-30-1
			})
			.style("stroke","url(#white-fade)");

			;




		// build faces
	  faces = d3.select(".chart").append("div")
	    .attr("id","faces")
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
				var title = d.track_info.title;
				if(title.length > 20){
					return title.slice(0,17)+"..."
				}
				return title;
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
			.html(function(d){
				return niceParseThree(d);
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
			if(dateAhead in d.nestedDateArray){
				return x(dates[1])+"px";
			}
			else {
				if(currentDate in d.nestedDateArray || unParse(d3.time.day.offset(dates[0], -7)) in d.nestedDateArray || unParse(d3.time.day.offset(dates[0], -14)) in d.nestedDateArray){
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

	  function faceBackgroundImage(d){
	    if(d["track_info"]["artist_url"] == "NULL"){
	      return null
	    }
	    return "url(https://i.scdn.co/image/"+d["track_info"]["artist_url"]+")"
	  }

	  function faceOpacity(d){
			if(dateAhead in d.nestedDateArray){
				return null;
			}
			else {
				if(unParse(d3.time.day.offset(dates[0], -7)) in d.nestedDateArray || unParse(d3.time.day.offset(dates[0], -14)) in d.nestedDateArray){
					return 0;
				}
				if(unParse(dates[2]) in d.nestedDateArray || unParse(dates[3]) in d.nestedDateArray || unParse(dates[4]) in d.nestedDateArray){
					return .8;
				}
				if(dates[0] > d3.max(d.values, function(d){ return d.chart_date})){
					return 0;
				}
				else{
					return .1
				}
			}
	  }

		function faceDisplay(d){
			if(dateAhead in d.nestedDateArray){
				return null;
			}
			else {
				if(unParse(d3.time.day.offset(dates[0], -7)) in d.nestedDateArray || unParse(d3.time.day.offset(dates[0], -14)) in d.nestedDateArray){
					return null;
				}
				if(unParse(dates[2]) in d.nestedDateArray || unParse(dates[3]) in d.nestedDateArray || unParse(dates[4]) in d.nestedDateArray){
					return null;
				}
				if(dates[0] > d3.max(d.values, function(d){ return d.chart_date})){
					return "none";
				}
				else{
					return "none";
				}
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

	  var searchArray = [];
	  var searchResults = d3.select(".search-results-new");
	  var searchResultMouseOver = false;

	  function artistClean(artist){
	    return artist.split(" Featuring")[0];
	  }

	  var sampleRotate;

		// window.addEventListener("wheel", event => {
	  //   const delta = Math.sign(event.deltaY);
		// 	if(Math.round(event.timeStamp) % 2 == 0){
		// 		testScroll(delta);
		// 	}
		// });

		var timeoutScroll = null;

		function testScroll(direction){

			if(playing){
				moveChart("stop")
			}

			window.clearTimeout(timeoutScroll);

			timeoutScroll = window.setTimeout(function(d){

				face
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

				moveChart(dates[0].getTime())

			},1000)

			for (var i in dates){
	      dates[i] = d3.time.day.offset(dates[i], 7*direction);
	    };

			currentDate = unParse(dates[0]);
			dateAhead = unParse(d3.time.day.offset(dates[0], 7));
			twoDatesAhead = unParse(d3.time.day.offset(dates[0], 14));

			changeYear("scroll");

			x.domain([dates[0], dates[dates.length-1]]);

			face
				.style("opacity",function(d){
					return faceOpacity(d)
				})
				.style("width",faceSize+"px")
				.style("height",faceSize+"px")
				.style("border-color",function(d){
					return faceBorder(d);
				})
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
				.style("opacity",function(d,i){
					if(i==0){
						return 0;
					}
				})
				;

			d3.select(".date-lines-container")
				.style("transform", "translate(0px,"+ x(d3.time.day.offset(dates[dates.length-1], 7)) + "px)")
				;

			path
			.attr("d", function(d){
					//return lineFunction(d.values);
					return line(d.values);
					return line(getPathWeeks(d));
				})
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
								.style("stroke","#2a292f").attr("id","glow").style("stroke-width",'6px');
						}
					}
				})
				;

			d3.select(".path-container").selectAll("path")
				.attr("transform", "translate(0,0)")

				//.attr("transform", "translate(0,"+ x(d3.time.day.offset(dates[dates.length-1], 7)) + ")")


			// d3.select(".path-container").selectAll("path")
			// 	.transition()
			// 	.attr("transform", "translate(0,0)")
			// 	;


	  };

		// d3.select("body").on("click",function(d){
		// 	console.log("here");
		// 	testScroll("hi");
		// })


		function moveChart(d){

	    if(playing==true){
	      transition = transition.transition(0).duration(0);

				globalGain.gain.cancelScheduledValues(context.currentTime);
				globalGain.gain.setValueAtTime(0,context.currentTime)

				// if ( source ) {
				// 	if(!source.stop){
				// 		source.stop = source.noteOff;
				// 	}
				// }
				//
				// if ( lastSource ) {
				// 	if(!lastSource.stop){
				// 		lastSource.stop = lastSource.noteOff;
				// 	}
				// 	lastSource.stop(0);
				// }
	    }
			if(d == "stop"){
				playing = false;
				d3.select(".play-button").style("display","block");
				d3.select(".pause-button").style("display","none");
				// lines.transition().duration(0);
				// face.transition().duration(0);
				// path.transition().duration(0);
			}

			if(d != "stop"){
				playing = true;
				d3.select(".play-button").style("display",null);
				d3.select(".pause-button").style("display",null);

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

				x.domain([dates[0], dates[dates.length-1]]);

		    window.clearTimeout(tickDelay);

		    tickDelay = setTimeout(function(){

		      if(1 < 2){

		        for (i=1; i<20; i++){
		          var timeOne = dates[1];
		          var timeTwo = d3.time.day.offset(dates[1], 7*i);

		          if(nestedDatesTwo[unParse(timeOne)]["track"] != nestedDatesTwo[unParse(timeTwo)]["track"]){
		            playLength = Math.max((i-1) * shiftDuration,shiftDuration);
		            break;
		          }
		        }

		        var currTime = context.currentTime;

		        var currSong;
		        var previewItemId = nestedDatesTwo[unParse(d3.time.day.offset(dates[1], 0))]["preview"];
		        currSong = "https://p.scdn.co/mp3-preview/" + previewItemId

		        startTime = currTime + 1;
		        loadSounds(currSong, playLength, startTime, "now");

		      }
		      transition = d3.select({}).transition()
		          .duration(shiftDuration)
		          .ease("linear");


		      tick();

		    }, 100);
			}
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
			return "none";

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
	    return 0;
	  }

		function pathStrokeWidth(d){
	    if (dateAhead in d.nestedDateArray){
	      var rank = d.nestedDateArray[dateAhead];
	      if(rank==1){
	        return "4px";
	      }
	      return "4px";
	    }
	    return "1px";
	  }

	  var transition = d3.select({}).transition()
	      .duration(shiftDuration)
	      .ease("linear");

	  var tickCount = 0;


		var extentDates = d3.extent(nestedDates,function(d){
			return parseDate(d.key);
		})

		extentDates[0] = parseDate("1958-10-06")

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
		var orientation = "vertical"

		if(viewportWidth < 700){
			orientation = "horizontal"
		}

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
				orientation: orientation,
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
				console.log("changing");
				moveChart(unencoded)
			});

		sliderDates
			.on('end', function (values, handle, unencoded, tap, positions) {
				dragging = false;
				moveChart(unencoded)
			});

		let playVisible = true;

		d3.select(".start-button").on("click",function(){
			d3.select(".loading-screen").style("opacity",0).style("pointer-events","none").transition().duration(0).delay(2000).remove();
			d3.select("#content").classed("not-loaded",false);
			moveChart(dates[0].getTime())

			var playNow2 = createSource(scratch);
	    source2 = playNow2.source;

	    if (!source2.start){
	      source2.start = source.noteOn;
	    }
	    source2.start(0);

		});

		d3.select(".start-button-muted").on("click",function(){
			d3.select(".loading-screen").style("opacity",0).style("pointer-events","none").transition().duration(0).delay(2000).remove();
			d3.select("#content").classed("not-loaded",false);

			d3.select(".vol").select(".mute-icon").style("display","none");
			d3.select(".vol").select(".vol-icon").style("display","block");

			var playNow2 = createSource(scratch);
	    source2 = playNow2.source;

	    if (!source2.start){
	      source2.start = source.noteOn;
	    }
			var gainNode = playNow2.gainNode;
			gainNode.gain.value = 0;
			source2.start(0);


			// var playNow = createSource(bufferNow);
			// source = playNow.source;
			// source.loop = true;
			// var gainNode = playNow.gainNode;
			// var duration = playingLength/1000 + 2;
			//
			//
			// if(!muted){
			// 	gainNode.gain.linearRampToValueAtTime(0, startingTime);
			// 	gainNode.gain.linearRampToValueAtTime(1, startingTime + 1);
			// }
			// else {
			// 	gainNode.gain.value = 0;
			// }
			//
			// if (!source.start){
			// 	source.start = source.noteOn;
			// }
			//
			// source.start(context.currentTime + (startingTime - context.currentTime));
			//
			// if(!muted){
			// 	gainNode.gain.linearRampToValueAtTime(1, startingTime + duration-1);
			// 	gainNode.gain.linearRampToValueAtTime(0, startingTime + duration);
			// }
			//
			// source.stop(context.currentTime + (startingTime - context.currentTime) + duration + .1)
			//
			// globalGain = gainNode;

			muted = true;
			moveChart(dates[0].getTime())
		});

		d3.select(".play-pause").on("click",function(){
			if(playing){
				moveChart("stop");
			}
			else {
				moveChart(dates[0].getTime())
			}
		})

		d3.select(".vol").on("click",function(){
			if(muted){
				muted = false;
				globalGain.gain.cancelScheduledValues(context.currentTime);
				globalGain.gain.setValueAtTime(1,context.currentTime)

				d3.select(".vol").select(".mute-icon").style("display",null);
				d3.select(".vol").select(".vol-icon").style("display",null);
			}
			else {
				muted = true;
				//globalGain.gain.value = 0;
				globalGain.gain.cancelScheduledValues(context.currentTime);
				globalGain.gain.setValueAtTime(0,context.currentTime)

				d3.select(".vol").select(".mute-icon").style("display","none");
				d3.select(".vol").select(".vol-icon").style("display","block");
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
			if(unParse(dates[0]) == "2019-03-30"){
				moveChart("stop");
				return null;
			}

	    var currTime = context.currentTime;

	    for (var i in dates){
	      dates[i] = d3.time.day.offset(dates[i], 7);
	    };

	    var nextSong;

	    if(nestedDatesTwo[unParse(dates[0])]["track"] != nestedDatesTwo[unParse(d3.time.day.offset(dates[0], 7))]["track"] && 1 < 2){

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
				sliderDates.set(Number(dates[0].getTime()));
			}

	    transition = transition.each(function() {

	      // var numberShiftDuration = shiftDuration/7;

	      // d3.select(".year-drop-down-text").text(currentDate.slice(0,4));

	      // d3.select("#top-date-sub")
	      //   .transition().duration(numberShiftDuration).text(function(d){
	      //     return niceParseTwo(numberOneDates[0]);
	      //   })
	      //   .transition().duration(numberShiftDuration).text(function(d){
	      //     return niceParseTwo(numberOneDates[1]);
	      //   })
	      //   .transition().duration(numberShiftDuration).text(function(d){
	      //     return niceParseTwo(numberOneDates[2]);
	      //   })
	      //   .transition().duration(numberShiftDuration).text(function(d){
	      //     return niceParseTwo(numberOneDates[3]);
	      //   })
	      //   .transition().duration(numberShiftDuration).text(function(d){
	      //     return niceParseTwo(numberOneDates[4]);
	      //   })
	      //   .transition().duration(numberShiftDuration).text(function(d){
	      //     return niceParseTwo(numberOneDates[5]);
	      //   })
	      //   .transition().duration(numberShiftDuration).text(function(d){
	      //     return niceParseTwo(numberOneDates[6]);
	      //   })
	      //   .transition().duration(numberShiftDuration).text(function(d){
	      //     return niceParseTwo(numberOneDates[7]);
	      //   })
	      //   ;

				d3.select("#top-title-sub").text(function(d){
					var title = nestedDatesTwo[unParse(dates[0])].title;
					if(title.length > 25 && mobile){
						return title.slice(0,22)+"..."
					}
					return nestedDatesTwo[unParse(dates[0])].title;
				});
				d3.select("#top-artist-sub").text(function(){
					return artistClean(nestedDatesTwo[unParse(dates[0])].artist);
				});


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
						.text(countStreak)//.style("font-size","70px")

						// window.setTimeout(function(){
						// 	d3.select(".streak").select(".big")
						// 		.style("font-size",null)
						// },100)
				}

	      x.domain([dates[0], dates[dates.length-1]]);

	      face
					.style("opacity",function(d){
						return faceOpacity(d)
	        })
					// .style("display",function(d){
					// 	return faceDisplay(d)
	        // })
					.style("width",faceSize+"px")
					.style("height",faceSize+"px")
					.style("border-color",function(d){
						return faceBorder(d);
					})
					// .style("box-shadow",function(d){
					// 	return faceShadow(d);
					// })
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
        .style("stroke", function(d){
          var data = d;
          return pathStroke(data);
        })
				.style("opacity", function(d){
					var data = d;
					return pathOpacity(data);
				})
				// .style("display",function(d){
				// 	return faceDisplay(d)
				// })
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
								.style("stroke","#2a292f").attr("id","glow").style("stroke-width",'6px');
						}
					}
				})
				;

				d3.select(".path-container").selectAll("path")
					.attr("transform", "translate(0,"+ x(d3.time.day.offset(dates[dates.length-1], 7)) + ")")


				d3.select(".path-container").selectAll("path")
	        .transition()
					.attr("transform", "translate(0,0)")
	        ;

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
	            moveChart("stop");
	          }
	        }else{
	          if(playing){
	            moveChart(dates[0].getTime());
	          }
	        }
	      }
	    }

	    // set the initial state (but only if browser supports the Page Visibility API)
	    if( document[hidden] !== undefined )
	      onchange({type: document[hidden] ? "blur" : "focus"});
	  })();









	});
	});
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
	loadScratch("assets/i_wish.mp3");
	// loadHit("url/scratch.wav");

	function loadSounds(url,playingLength,startingTime,thing){
	  if(url == "https://p.scdn.co/mp3-preview/NULL"){
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


			if(!muted){
				gainNode.gain.linearRampToValueAtTime(0, startingTime);
		    gainNode.gain.linearRampToValueAtTime(1, startingTime + 1);
			}
			else {
				gainNode.gain.value = 0;
			}

	    if (!source.start){
	      source.start = source.noteOn;
	    }

	    source.start(context.currentTime + (startingTime - context.currentTime));

			if(!muted){
				gainNode.gain.linearRampToValueAtTime(1, startingTime + duration-1);
		    gainNode.gain.linearRampToValueAtTime(0, startingTime + duration);
			}

			source.stop(context.currentTime + (startingTime - context.currentTime) + duration + .1)

			globalGain = gainNode;
	}

}
