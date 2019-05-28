// function oldCode(){
// 	var cumulativeStats = d3.select(".cumulative-container");
// 	var topArtistCountArray = {};
// 	var n = 9,
// 	    duration = 1500,
// 	    now = new Date(Date.now() - duration),
// 	    random = d3.random.normal(0, .2),
// 	    random = d3.random.normal(.1, .2);
//
// 	var searchData;
// 	var count = [];
// 	var started = false;
// 	var axis;
// 	var chartData;
// 	var nestedDatesTwo;
// 	var imageData;
// 	var shiftDuration = 2500;
// 	var tickDelay;
// 	var playLength = 0;
// 	var startTime = 0;
// 	var colorOne = "#FF2F28";
// 	var colorTwo = "#FF2F28";
// 	var context;
// 	var bufferLoader;
// 	var scratch;
// 	var hit;
// 	var source;
// 	var lastSource;
// 	var currentYear = 1995;
// 	var windowFocus = 0;
// 	var hidden;
// 	var faceAdjust = -30;
// 	var textAdjust = 6;
// 	var textColor = "#797979";
// 	var pathColor = "#FFFFFF";
// 	var playing = false;
// 	var muted = false;
// 	var hidden;
// 	var mobile = false;
//
// 	var parseDate = d3.time.format("%Y-%m-%d").parse;
// 	var unParse = d3.time.format("%Y-%m-%d");
// 	var niceParse = d3.time.format("%B %d, '%y");
// 	var niceParseTwo = d3.time.format("%B %d, '%y");
// 	var sideBarParse = d3.time.format("%b '%y");
//
// 	var uniqueRowsCsv = "assets/data/unique_rows.csv";
//
// 	var startString = "1997-03-15";
// 	if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
// 	  startString = "1997-03-15";
// 	  mobile = true;
// 	  textColor = "white";
// 	  faceAdjust = -25;
// 	  textAdjust = 3;
// 	  uniqueRowsCsv = "assets/data/unique_rows_mobile.csv"
// 	}
// 	var start = new Date(parseDate(startString));
//
// 	// var startHead = new Date(parseDate("1964-01-25"));
// 	// var endHead = new Date(parseDate("1964-01-25"));
//
// 	//interate through 17 weeks by adding 7 to the start day
// 	var dates = [start];
// 	var i;
// 	for (i=0; i<n; i++){
// 	  var length  = dates.length;
// 	  var date = d3.time.day.offset(dates[length - 1],7);
// 	  dates.push(date);
// 	}
//
// 	var dateAhead = unParse(d3.time.day.offset(dates[dates.length-1], 7));
// 	var currentDate = unParse(dates[dates.length-1]);
//
// 	var margin = {top: 50, right: 0, bottom: 20, left:0},
// 	    width = 516 - margin.left - margin.right,
// 	    height = 450 - margin.top - margin.bottom;
//
// 	var viewportWidth;
// 	var viewportHeight;
//
// 	viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
// 	viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
//
// 	$( document ).ready(function() {
//
// 	d3.csv("assets/data/all_rows.csv", function(error, data) {
// 	  d3.csv(uniqueRowsCsv, function(error, songsUnique) {
//
// 	  if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
// 	    width = 250;
// 	    if(viewportWidth<400){
// 	      width = 227;
// 	    }
//
// 	    if(viewportWidth<330){
// 	      width = 195;
// 	      height = viewportHeight - 230;
// 	    }
// 	    margin.left = 25;
// 	  }
//
// 	  var searchData = d3.nest().key(function(d){
// 	      return d.artist;
// 	  })
// 	  .entries(
// 	    songsUnique.sort(function(b,a) {
// 	      var o1 = a.title;
// 	      var o2 = b.title;
//
// 	      if (o1 > o2) return -1;
// 	      if (o1 < o2) return 1;
// 	      return 0;
// 	    })
// 	    // .filter(function(d,i){
// 	    //   return +d.peak_rank < 6
// 	    // })
// 	  );
//
// 	  var songsUniqueMap = d3.map(songsUnique, function(d){ return d.key });
//
// 	  var x = d3.time.scale().domain([dates[2],dates[dates.length-1]]).range([0, width]);
//
// 	  var y = d3.scale.linear()
// 	      .domain([6, 1])
// 	      .range([height, 0]);
//
// 	  var xAxis = d3.svg.axis()
// 	    .scale(x)
// 	    .ticks(3)
// 	    .tickFormat(d3.time.format("%b %d '%y"))
// 	    .innerTickSize(0)
// 	    .outerTickSize(0)
// 	    .tickPadding(0)
// 	    .orient("bottom")
// 	    ;
//
// 	  if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
// 	    xAxis.tickFormat(d3.time.format("%b-%Y")).ticks(2);
// 	  }
//
// 	  var yAxis = d3.svg.axis().scale(y)
// 	    .tickFormat(function(d,i){
// 	      if(d==1){
// 	      return "#" + d;
// 	      }
// 	      return d;
// 	    })
// 	    .innerTickSize(-10)
// 	    .tickValues([1,2,3,4,5])
// 	    .tickPadding(3)
// 	    .orient("left")
// 	    ;
//
// 	  var line = d3.svg.line()
// 	      .interpolate("linear")
// 	      .x(function(d,i){
// 	        return x(d.chart_date);
// 	      })
// 	      .y(function(d, i) { return y(+d.rank); });
//
// 	  data.forEach(function(d) {
// 	    if(+d.chart_date.slice(0,4)<1962 && d.chart_date != "1961-12-30"){
// 	      d.chart_date = d3.time.day.offset(parseDate(d.chart_date),-2);
// 	      d.chart_date_num = unParse(d.chart_date);
// 	    }
// 	    else {
// 	      d.chart_date_num = d.chart_date;
// 	      d.chart_date = parseDate(d.chart_date);
// 	    }
// 	    // d.id = d.title + " by " + d.artist;
// 	    d.id = d.track_id;
// 	    if(songsUniqueMap.has(d.id)){
//
// 	    }else{
// 	      // console.log(d.id);
// 	    }
// 	    d.track_info = songsUniqueMap.get(d.id);
// 	  });
//
// 	  var artistData = d3.nest().key(function(d){
// 	      return d.id;
// 	  })
// 	  .entries(data);
//
// 	  var testDates = d3.nest().key(function(d){
// 	    return d.chart_date_num.slice(0,7);
// 	  })
// 	  .entries(data);
//
// 	  //chartdata is nested by artist
// 	  chartData = d3.nest().key(function(d){
// 	      return d.id;
// 	  })
// 	  .entries(data);
//
// 	  //nestedDates is nested by week
// 	  var nestedDates = d3.nest().key(function(d){
// 	      return d.chart_date_num;
// 	  })
// 	  .entries(data);
//
// 	  for (var i = 0; i < chartData.length; i++) {
// 	    //add peak to the top-level node
//
// 	    //rank by week
// 	    var dateRank = {};
// 	    for (var j=0; j < chartData[i].values.length; j++){
// 	      var date = chartData[i].values[j].chart_date_num;
// 	      var rank = chartData[i].values[j].rank;
// 	      dateRank[date] = rank;
// 	    }
// 	    chartData[i].nestedDateArray = dateRank;
// 	  }
//
// 	  var chartMap = d3.map(chartData, function(d){ return d.key });
//
// 	  for (var date in testDates){
// 	    for (var track in testDates[date].values){
// 	      var item = chartMap.get(testDates[date].values[track].id);
// 	      testDates[date].values[track].nestedDateArray = item.nestedDateArray;
// 	      testDates[date].values[track].key = item.key;
// 	      testDates[date].values[track].values = item.values;
// 	    }
// 	  }
//
// 	  testDates = d3.map(testDates, function(d){ return d.key });
//
// 	  var filteredData = testDates.get(unParse(dates[dates.length-1]).slice(0,7)).values;
//
// 	  //nestedDatesTwo is for the audio so that it knows what it will play each week
// 	  var nestedDatesTwo = {};
//
// 	  //sorts everything for getting the top ranked track that goes into nestedDatesTwo
// 	  for (var i in nestedDates){
// 	    nestedDates[i].values.sort(function(a,b) {return a.rank-b.rank;});
// 	  }
//
// 	  //nestedDates is the data nested by week
// 	  for (var i in nestedDates){
// 	    var date = nestedDates[i].key;
// 	    nestedDatesTwo[date] = {
// 	      track:nestedDates[i]["values"][0]["id"],
// 	      preview:nestedDates[i]["values"][0]["track_info"]["song_url"],
// 	      artist:nestedDates[i]["values"][0]["track_info"]["artist"],
// 	      title:nestedDates[i]["values"][0]["track_info"]["title"]
// 	    };
// 	  }
//
// 	  function changeYear(changedYear){
//
// 	    var duration1 = 800;
// 	    var duration2 = 400;
//
// 	    // var filteredDataOne = testDates.get(unParse(dates[dates.length-1])).values;
// 	    // var filteredDataTwo = testDates.get(unParse(dates[dates.length-2])).values;
//
// 	    var year = unParse(dates[dates.length-1]).slice(0,7);
//
// 	    var filteredData = testDates.get(year).values;
//
// 	    filteredData = _.unionBy(filteredData, 'key');
//
// 	    path = path.data(filteredData, function(d){
// 	      return d.key;
// 	    })
// 	    ;
//
// 	    face = face.data(filteredData, function(d){
// 	      return d.key;
// 	    });
//
// 	    text = text.data(filteredData, function(d){
// 	      return d.key;
// 	    });
//
// 	    path.enter().append("path")
// 	      .attr("class", "line")
// 	      .attr("d", function(d){
// 	        return line(d.values);
// 	      })
// 	      .attr("transform", "translate(" + x(dates[1]) + ")")
// 	      .style("stroke", function(d){
// 	        var data = d;
// 	        return pathStroke(data);
// 	      })
// 	      .style("opacity",function(d){
// 	        //if the current date is in there
// 	        if (currentDate in d.nestedDateArray){
// 	          var rank = d.nestedDateArray[currentDate];
// 	          return opacityScale(rank);
// 	        }
// 	        else {
// 	            return .05;
// 	        }
// 	      })
// 	      ;
//
// 	    face.enter().append("div")
// 	      .attr("class","face tk-futura-pt")
// 	      .style("background-image", function(d){
// 	        if(d["track_info"]["artist_url"] == "NULL"){
// 	          return null
// 	        }
// 	        if(d["track_info"]["artist_url"] == "manual"){
// 	          var hostUrl = document.location.origin;
// 	          var pathUrl = document.location.pathname.replace("index.html","");
// 	          var idSong = nestedDatesTwo[unParse(d3.time.day.offset(dates[dates.length-1], 7))]["track"];
// 	          nextSong = hostUrl+pathUrl+"url/"+idSong + ".m4a"
// 	          return "url("+nextSong+")";
// 	        }
// 	        return "url(https://i.scdn.co/image/"+d["track_info"]["artist_url"]+")"
// 	      })
// 	      .style("border-color", function(d,i){
// 	        var rank = d.nestedDateArray[currentDate];
// 	        if (rank == 1){
// 	          return colorTwo;
// 	        }
// 	        if (currentDate in d.nestedDateArray){
// 	          var rank = d.nestedDateArray[currentDate];
// 	          return interpolateOne(opacityScale(rank));
// 	          // return "rgba(255,255,255,"+opacityScale(rank)+")"
// 	        }
// 	        return interpolateOne(opacityScale(.5));
// 	        // return "rgba(255,255,255,.5)";
// 	      })
// 	      .style("background-color", faceBackground)
// 	      .style("top",function(d){
// 	        var data = d;
// 	        return faceTopPosition(data);
// 	      })
// 	      .on("mouseover",function(d){
// 	        var data = d;
// 	        var element = d3.select(this);
// 	        faceMouseOver(data,element);
// 	      })
// 	      .on("mouseout",function(){
// 	      })
// 	      .on("click",function(d){
// 	      })
// 	      ;
//
// 	    text.enter().append("text")
// 	      .style("fill", function(d){
// 	        var data = d;
// 	        return textFill(data);
// 	      })
// 	      .text(function(d){
// 	        return d.values[0].track_info.title;
// 	      })
// 	      .attr("x", 0)
// 	      .attr("y",function(d){
// 	        var data = d;
// 	        return textTopPosition(data);
// 	      })
// 	      .attr("class","line-name tk-futura-pt")
// 	      ;
//
// 	    path.exit().remove();
// 	    face.exit().remove();
// 	    text.exit().remove();
// 	  }
//
// 	  function moveChart(d){
// 	    d3.selectAll(".cumlative-artist").remove();
// 	    topArtistCountArray = {};
//
// 	    d3.select(".number-one-date-wrapper").style("opacity",1);
// 	    clearInterval(sampleRotate);
//
// 	    if ( source ) {
// 	      if(!source.stop){
// 	        source.stop = source.noteOff;
// 	      }
// 	      source.stop(0);
// 	    }
//
// 	    if ( lastSource ) {
// 	      if(!lastSource.stop){
// 	        lastSource.stop = lastSource.noteOff;
// 	      }
// 	      lastSource.stop(0);
// 	    }
//
// 	    if(playing==true){
// 	      transition = transition.transition(0).duration(0);
// 	    }
//
// 	    playing = true;
//
// 	    //
// 	    // playing = true;
//
// 	    var dateSelected = d;
//
// 	    // d3.select(".year-drop-down-text").text(dateSelected.slice(0,4));
// 	    var end = new Date(parseDate(dateSelected));
// 	    var datesNew = [end];
//
// 	    //move backwards in time, since you've selected the end date
// 	    for (i=0; i<n; i++){
// 	      var length  = datesNew.length;
// 	      var date = d3.time.day.offset(datesNew[0],-7);
// 	      datesNew.unshift(date);
// 	    }
//
// 	    dates = datesNew;
// 	    currentDate = unParse(dates[dates.length-1]);
// 	    dateAhead = unParse(d3.time.day.offset(dates[dates.length-1], 7));
//
// 	    //update x-domain
// 	    x.domain([dates[2], dates[dates.length-1]]);
//
// 	    var duration1 = 800;
// 	    var duration2 = 400;
// 	    //
// 	    var dateToFilter = currentDate.slice(0,4);
//
// 	    filteredData = testDates.get(unParse(dates[dates.length-1]).slice(0,7)).values;
//
// 	    path = path.data(filteredData, function(d){
// 	      return d.key;
// 	    });
// 	    //
// 	    face = face.data(filteredData, function(d){
// 	      return d.key;
// 	    });
//
// 	    text = text.data(filteredData, function(d){
// 	      return d.key;
// 	    });
//
// 	    path
// 	      .style("stroke", function(d){
// 	        var data = d;
// 	        return pathStroke(data);
// 	      })
// 	      .transition()
// 	      .duration(duration1)
// 	      .attr("d", function(d){
// 	        return line(d.values);
// 	      })
// 	      .attr("transform", "translate(" + x(dates[1]) + ")")
// 	      .style("opacity",function(d){
// 	        var data = d;
// 	        return pathOpacity(data);
// 	      })
// 	      ;
//
// 	    path.enter().append("path")
// 	      .attr("class", "line")
// 	      .attr("d", function(d){
// 	        return line(d.values);
// 	      })
// 	      .attr("transform", "translate(" + x(dates[1]) + ")")
// 	      .style("stroke", function(d){
// 	        var data = d;
// 	        return pathStroke(data);
// 	      })
// 	      .style("opacity",function(d){
// 	        var data = d;
// 	        return pathOpacity(data);
// 	      })
// 	      ;
//
//
// 	    face.transition()
// 	      .duration(duration2)
// 	      .style("opacity",function(d){
// 	        var data = d;
// 	        return faceOpacity(data);
// 	      })
// 	      .style("background-color", faceBackground)
// 	      .transition()
// 	      .duration(duration1)
// 	      .style("top",function(d){
// 	        var data = d;
// 	        return faceTopPosition(data);
// 	      })
// 	      ;
//
// 	    text.attr("transform", null)
// 	      .style("fill", function(d){
// 	        var data = d;
// 	        return textFill(data);
// 	      })
// 	      .transition()
// 	      .duration(duration1)
// 	      .attr("y",function(d){
// 	        var data = d;
// 	        return textTopPosition(data);
// 	      })
// 	      ;
//
//
// 	    face.enter().append("div")
// 	      .attr("class","face tk-futura-pt")
// 	      .style("background-image", function(d){
// 	        var data = d;
// 	        var element = d3.select(this);
// 	        return faceBackgroundImage(data,element);
// 	      })
// 	      .style("background-color", faceBackground)
// 	      .style("opacity",function(d){
// 	        var data = d;
// 	        return faceOpacity(data);
// 	      })
// 	      .style("top",function(d){
// 	        var data = d;
// 	        return faceTopPosition(data);
// 	      })
// 	      .on("mouseover",function(d){
// 	        var data = d;
// 	        var element = d3.select(this);
// 	        faceMouseOver(data,element);
// 	      })
// 	      .on("mouseout",function(){
// 	        // var positionTop = d3.select(this).style("top");
// 	        // clickPlayTip.style("opacity",0);
// 	      })
// 	      .on("click",function(d){
// 	      })
// 	      ;
//
// 	    text.enter().append("text")
// 	      .style("fill", function(d){
// 	        var data = d;
// 	        return textFill(data);
// 	      })
// 	      .text(function(d){
// 	        return d.values[0].track_info.title;
// 	      })
// 	      .attr("x", 0)
// 	      .attr("y",function(d){
// 	        var data = d;
// 	        return textTopPosition(data);
// 	      })
// 	      .attr("class","line-name tk-futura-pt");
//
// 	    path.exit().remove();
// 	    face.exit().remove();
// 	    text.exit().remove();
//
// 	    d3.select(".number-one").transition().duration(5000).text(function(d){
// 	      var date = niceParseTwo(dates[dates.length-1]);
// 	      return date;
// 	    })
// 	    ;
//
// 	    d3.select(".number-one-artist").style("color",null).transition().duration(5000).text(topArtist);
//
// 	    axis.transition().duration(100).call(xAxis);
//
// 	    window.clearTimeout(tickDelay);
//
// 	    tickDelay = setTimeout(function(){
//
// 	      if(muted == false){
//
// 	        for (i=2; i<20; i++){
// 	          var timeOne = d3.time.day.offset(dates[dates.length-1], 7);
// 	          var timeTwo = d3.time.day.offset(dates[dates.length-1], 7*i);
// 	          if(nestedDatesTwo[unParse(timeOne)]["track"] != nestedDatesTwo[unParse(timeTwo)]["track"]){
// 	            playLength = Math.max((i-1) * shiftDuration,shiftDuration);
// 	            break;
// 	          }
// 	        }
//
// 	        var currTime = context.currentTime;
// 	      //
// 	        var currSong;
// 	        var previewItemId = nestedDatesTwo[unParse(d3.time.day.offset(dates[dates.length-1], 7))]["preview"];
// 	        currSong = "https://p.scdn.co/mp3-preview/" + previewItemId
// 	        if(previewItemId == "manual"){
// 	          var hostUrl = document.location.origin;
// 	          var pathUrl = document.location.pathname.replace("index.html","");
// 	          var idSong = nestedDatesTwo[unParse(d3.time.day.offset(dates[dates.length-1], 7))]["track"];
// 	          currSong = hostUrl+pathUrl+"url/"+idSong + ".m4a"
// 	        }
//
// 	        startTime = currTime + 1;
// 	        loadSounds(currSong, playLength, startTime, "now");
// 	    //
// 	      }
// 	      transition = d3.select({}).transition()
// 	          .duration(shiftDuration)
// 	          .ease("linear");
//
//
// 	      tick();
//
// 	    }, 100);
//
// 	  };
//
// 	  var currentDate = unParse(dates[dates.length-1]);
// 	  var dateAhead = unParse(d3.time.day.offset(dates[dates.length-1], 7));
// 	  var opacityScale = d3.scale.linear().domain([20,4,1]).range([.05,.3,1]);
// 	  var timelineScale = d3.scale.linear().domain([0,354]).range([23,375]);
//
// 	  function topArtist(d){
// 	    return nestedDatesTwo[currentDate].title+"â€”"+nestedDatesTwo[currentDate].artist;
// 	  }
//
// 	  function faceBackground(d) {
// 	    var rank = d.nestedDateArray[dateAhead];
// 	    if (rank == 1){
// 	      return colorTwo;
// 	    }
// 	    else{
// 	      if (currentDate in d.nestedDateArray){
// 	        var rank = d.nestedDateArray[currentDate];
// 	        return d3.interpolate("#fff", "#000")(opacityScale(rank));
// 	      }
// 	      else {
// 	        return d3.interpolate("#fff", "#000")(opacityScale(.05));
// 	      }
// 	    }
// 	  };
//
// 	  var svg = d3.select(".chart").append("svg")
// 	    .attr("width", width + margin.left + margin.right)
// 	    .attr("height", height + margin.top + margin.bottom)
// 	    .attr("class","lines-container")
// 	    ;
//
// 	  svg.append("linearGradient")
// 	      .attr("id", "temperature-gradient")
// 	      .attr("gradientUnits", "userSpaceOnUse")
// 	      .attr("x1", 0).attr("y1", y(2))
// 	      .attr("x2", 0).attr("y2", y(1))
// 	      .selectAll("stop")
// 	        .data([
// 	          {offset: "0%", color: "steelblue"},
// 	          // {offset: "50%", color: "gray"},
// 	          {offset: "100%", color: "#FF2F28"}
// 	        ])
// 	      .enter().append("stop")
// 	        .attr("offset", function(d) { return d.offset; })
// 	        .attr("stop-color", function(d) { return d.color; });
//
// 	  svg.append("defs")
// 	    .append("clipPath")
// 	    .attr("id", "clip")
// 	    .append("rect")
// 	    .attr("x", 0)
// 	    .attr("y", -10)
// 	    .attr("width", width)
// 	    .attr("height", height+7);
//
// 	  svg.append("defs")
// 	    .append("clipPath")
// 	    .attr("id", "xaxisclip")
// 	    .append("rect")
// 	      .attr("width", width + 20)
// 	      .attr("height", height + margin.bottom * 2 + margin.top);
//
// 	  var ySvg = svg.append("g")
// 	    .attr("transform", function(){
// 	      var leftAdjust = margin.left + 20;
// 	      if(mobile){
// 	        leftAdjust = 75;
// 	      }
// 	      return "translate(" + leftAdjust + "," + margin.top + ")";
// 	    })
// 	    .attr("class", "y axis tk-futura-pt")
// 	    .call(yAxis);
// 	    ;
//
// 	  var pathSvg = svg.append("g")
// 	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
// 	    .attr("clip-path", "url(#clip)")
// 	    .attr("class","path-container")
// 	    ;
//
// 	  var xSvg = svg.append("g").append("g")
// 	    // .attr("clip-path", "url(#xaxisclip)")
// 	    .attr("class","x-axis-container")
// 	    ;
//
// 	  var faces = d3.select(".chart").append("div")
// 	    .attr("id","faces")
// 	    ;
//
// 	  var chartContainer = d3.select(".chart")
// 	    .on("mouseover", function(){
// 	      if(!playing){
// 	        pausePlay.style("opacity",1);
// 	      }
// 	    })
// 	    .on("mouseout",function(){
// 	      if(!playing){
// 	        pausePlay.style("opacity",0);
// 	      }
// 	    })
// 	    ;
//
// 	  var textLeftOffset = 240;
// 	  if(mobile){
// 	    if(viewportWidth<330){
// 	      textLeftOffset = 230;
// 	    }
// 	    else{
// 	      textLeftOffset = 230;
// 	    }
//
// 	  }
//
// 	  var svgTwo = d3.select(".chart").append("svg")
// 	    .attr("class","text-container")
// 	    .append("g")
// 	    .attr("clip-path", "url(#clip)")
// 	    .attr("transform", function(){
// 	      var marginTop = margin.top;
// 	      return "translate(" + textLeftOffset + "," + marginTop + ")";
// 	    })
// 	    ;
//
// 	  var clickPlayTip = d3.select(".click-to-play");
//
// 	  var trackLegend = d3.select(".track-legend").selectAll("div");
//
// 	  var face = faces.selectAll("div").data(filteredData, function(d){
// 	    return d.key;
// 	  })
// 	  ;
//
// 	  var interpolateOne = d3.interpolate("#0C0C0C","#FFFFFF");
//
// 	  function faceTopPosition(d){
// 	    if (dateAhead in d.nestedDateArray){
// 	      var rank = d.nestedDateArray[dateAhead];
// 	      return y(rank) + faceAdjust + margin.top + "px";
// 	    }
// 	    else {
// 	      return height + 100 + "px";
// 	    }
// 	  }
// 	  ;
//
// 	  function textTopPosition(d){
// 	    if (dateAhead in d.nestedDateArray){
// 	      var rank = d.nestedDateArray[dateAhead];
// 	      return y(rank) + textAdjust;
// 	    }
// 	    return height + 100;
// 	  }
// 	  ;
//
// 	  function faceMouseOver(d,element){
// 	    var artist = d["track_info"]["artist"];
// 	    var title = d["track_info"]["title"];
// 	    if( !/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
// 	      // clickPlayTip.style("opacity",1).style("top",positionTop);
// 	      d3.select(".number-one-artist").style("color","#FFF").text(title+"â€”"+artist);
// 	    }
// 	  }
//
// 	  function faceBackgroundImage(d){
// 	    if(d["track_info"]["artist_url"] == "NULL"){
// 	      return null
// 	    }
// 	    return "url(https://i.scdn.co/image/"+d["track_info"]["artist_url"]+")"
// 	  }
//
// 	  function faceOpacity(d){
// 	    if (currentDate in d.nestedDateArray){
// 	      var rank = d.nestedDateArray[currentDate];
// 	      if (rank < 11 && rank > 0){
// 	        if(rank==1){
// 	          return 1;
// 	        }
// 	        return 1;
// 	      }
// 	      else{
// 	        return 1;
// 	      }
// 	    }
// 	    else {
// 	        return 1;
// 	    }
// 	  }
//
// 	  face.enter()
// 	    .append("div")
// 	    .attr("class","face tk-futura-pt")
// 	    .style("background-image", function(d){
// 	      var data = d;
// 	      return faceBackgroundImage(data);
// 	    })
// 	    .style("background-color", faceBackground)
// 	    .style("opacity",function(d){
// 	      var data = d;
// 	      return faceOpacity(data);
// 	    })
// 	    .style("top",function(d){
// 	      var data = d;
// 	      return faceTopPosition(data);
// 	    })
// 	    .on("mouseover",function(d){
// 	      var data = d;
// 	      var element = d3.select(this);
// 	      faceMouseOver(data,element);
// 	    })
// 	    ;
//
// 	  var bioName = d3.select(".bio-name");
// 	  var bioText = d3.select(".bio-info");
// 	  var pausePlay = d3.selectAll(".paused-play-button")
// 	    .on("click",function(){
// 	      d3.select(this).style("pointer-events","none");
// 	      d3.select(".pause-section").style("display","initial");
// 	      returnPath();
// 	    })
// 	    ;
//
// 	  function returnPath(){
//
// 	    d3.select(".number-one-date-wrapper").style("opacity",1);
// 	    pausePlay.style("background","#F33").transition().duration(1000).style("opacity",0);
// 	    trackLegend.style("visibility","hidden");
// 	    face.style("visibility","visible");
// 	    text.style("visibility","visible");
// 	    clickPlayTip.style("visibility","visible");
//
// 	    y.domain([10, 1]);
// 	    x.domain([dates[2], dates[dates.length-1]]);
//
// 	    yAxis
// 	      .scale(y)
// 	      .tickFormat(function(d,i){
// 	        if(d==1){
// 	        return "#" + d;
// 	        }
// 	        return d;
// 	      })
// 	      .innerTickSize(-width)
// 	      .tickValues( y.ticks( 10 ).concat( y.domain() ) )
// 	      .tickPadding(5)
// 	      .orient("left")
// 	      ;
//
// 	    xAxis
// 	      // .scale(x)
// 	      .ticks(5)
// 	      .tickFormat(d3.time.format("%b-%d %Y"))
// 	      ;
//
// 	    if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
// 	      xAxis.tickFormat(d3.time.format("%b-%Y")).ticks(2);
// 	    }
//
// 	    ySvg.call(yAxis);
//
// 	    if ( source ) {
// 	      if(!source.stop){
// 	        source.stop = source.noteOff;
// 	      }
// 	      source.stop(0);
// 	    }
// 	    if ( lastSource ) {
// 	      if(!lastSource.stop){
// 	        lastSource.stop = lastSource.noteOff;
// 	      }
// 	      lastSource.stop(0);
// 	    }
//
// 	    axis.transition().duration(500).call(xAxis);
//
// 	    playing = true;
// 	    playMusic();
//
// 	  }
//
// 	  var searchArray = [];
// 	  var searchResults = d3.select(".search-results-new");
// 	  var searchResultMouseOver = false;
//
// 	  // d3.select(".search-input").on("focus",function(){
// 	  //   d3.select(".cumulative-stats").style("display","none");
// 	  //   searchResults.style("display","block");
// 	  // })
// 	  // ;
//
// 	  var searchInputLabel = d3.select(".search-input")
// 	      .on("keyup", keyupedLabel);
//
// 	  function artistClean(artist){
// 	    return artist.split(" Featuring")[0];
// 	  }
//
// 	  function keyupedLabel() {
// 	    searchLabel(this.value.trim(),searchData);
// 	  }
//
// 	  function searchLabel(value,searchData) {
//
// 	    if (value.length > 2) {
//
// 	      d3.select(".cumulative-stats").style("display","none");
// 	      searchResults.style("display","block");
//
// 	      var re = new RegExp("\\b" + d3.requote(value), "i");
//
// 	      var artistPaths = _.filter(searchData, function(d,i) {
// 	        return re.test(d.key);
// 	      })
// 	      ;
//
// 	      // for (artist in artistPaths){
// 	      //   artistPaths[artist].values = artistPaths[artist].values.filter(function(d,i){
// 	      //     return chartMap.has(artistPaths[artist].values[track].key) == true;
// 	      //   })
// 	      // }
//
// 	      d3.selectAll(".search-result-wrapper").remove();
//
// 	      for (artist in artistPaths){
// 	        for (track in artistPaths[artist].values){
// 	          var dates = chartMap.get(artistPaths[artist].values[track].key).nestedDateArray;
// 	          var datesArray = Object.keys(dates);
// 	          var min_date = datesArray[0];
// 	          for (item in datesArray){
// 	            if (min_date > datesArray[item] && dates[datesArray[item]] < 6){
// 	              min_date = datesArray[item]
// 	            }
// 	          }
// 	          artistPaths[artist].values[track].min_date = parseDate(min_date);
// 	        }
// 	      }
//
// 	      var searchData = searchResults.selectAll("p")
// 	        .data(artistPaths, function(d){
// 	          return d.key;
// 	        })
// 	        ;
//
// 	      var searchEnter = searchData
// 	        .enter()
// 	        .append("div")
// 	        .attr("class","tk-futura-pt search-result-wrapper")
// 	        ;
//
// 	      searchEnter
// 	        .append("p")
// 	        .attr("class","tk-futura-pt search-result-artist")
// 	        .text(function(d){
// 	          return d.key;
// 	        })
// 	        ;
//
// 	      var searchTrackContainer = searchEnter.append("div")
// 	        .attr("class","tk-futura-pt search-result-tracks-container")
// 	        ;
//
// 	      var searchTrackRows = searchTrackContainer
// 	        .selectAll("div")
// 	        .data(function(d,i){
// 	          return d.values
// 	        })
// 	        .enter()
// 	        .append("div")
// 	        .sort(function(a,b) {return a.min_date-b.min_date;})
// 	        .attr("class","tk-futura-pt search-result-track-wrapper")
// 	        ;
//
// 	      searchTrackRows
// 	        .append("p")
// 	        .attr("class","tk-futura-pt search-result-track-text")
// 	        .text(function(d,i){
// 	          if(d.title.length > 20){
// 	            return d.title.slice(0,18)+"..."
// 	          }
// 	          return d.title;
// 	        })
// 	        ;
//
// 	      searchTrackRows
// 	        .append("p")
// 	        .attr("class","tk-futura-pt search-result-track-date")
// 	        .text(function(d){
// 	          return sideBarParse(d.min_date);
// 	        })
// 	        .on("click",function(d){
// 	          var date = unParse(d3.time.day.offset(d.min_date,(-7*3)));
// 	          moveChart(date);
// 	        })
// 	        ;
//
// 	        searchData.exit().remove();
//
// 	    }
// 	    else {
// 	      d3.select(".cumulative-stats").style("display","block");
// 	      searchResults.style("display","none");
// 	    }
// 	  }
//
// 	  var sampleRotate;
//
// 	  d3.select(".paused-play-button-two")
// 	    .on("click",function(){
// 	      d3.select("body").style("height","auto").style("overflow","auto");
// 	      d3.select(".screen").transition().duration(500).style("opacity",0).transition().duration(500).delay(500).style("display","none");
// 	      d3.select(".content").style("opacity",1);
// 	      setTimeout(function(){
// 	        playMusic();
// 	      }, 200);
// 	      d3.select(".paused-play-button-two").style("pointer-events","none");
// 	    })
//
// 	  function getSample(d){
//
// 	    d3.select(".number-one-date-wrapper").style("opacity",0);
// 	    d3.select(".pause-section").style("display","none");
//
// 	    var sampleClicked = d["track_info"]["key"];
// 	    var artist = d["track_info"]["artist"];
// 	    var track = d["track_info"]["track"];
// 	    var loadedUrl = "https://p.scdn.co/mp3-preview/"+d["track_info"]["song_url"];
//
// 	    d3.select(".number-one-artist").transition().duration(0).style("color","#FFF").text(artist);
//
// 	    if(playing){
// 	      pause();
// 	    }
// 	    playing = false;
//
// 	    if ( source ) {
// 	      if(!source.stop){
// 	        source.stop = source.noteOff;
// 	      }
// 	      source.stop(0);
// 	    }
// 	    if ( lastSource ) {
// 	      if(!lastSource.stop){
// 	        lastSource.stop = lastSource.noteOff;
// 	      }
// 	      lastSource.stop(0);
// 	    }
//
// 	    pausePlay.style("pointer-events","all");
//
// 	    function pathChange(artist){
//
// 	      trackLegend.style("visibility","visible");
// 	      face.style("visibility","hidden");
// 	      text.style("visibility","hidden");
// 	      clickPlayTip.style("visibility","hidden");
//
// 	      var re = new RegExp("\\b" + d3.requote(artist), "i");
//
// 	      var artistPaths = _.filter(artistData, function(d,i) {
// 	        return re.test(d.values[0]["track_info"]["artist"]);
// 	      });
//
// 	      var dates = [];
//
// 	      for (track in artistPaths){
// 	        for (date in artistPaths[track].values){
// 	          dates.push(artistPaths[track].values[date]["chart_date"])
// 	        }
// 	      }
//
// 	      // var dateExtent = d3.extent(artistPaths, function(d) { return d.values.chart_date; });
// 	      var dateExtent = d3.extent(dates, function(d) { return d; });
//
// 	      y.domain([20, 1]);
//
// 	      yAxis
// 	        .scale(y)
// 	        .tickFormat(function(d,i){
// 	          if(d==1){
// 	          return "#" + d;
// 	          }
// 	          return d;
// 	        })
// 	        .innerTickSize(-width)
// 	        .tickValues( y.ticks( 5 ).concat( y.domain() ) )
// 	        .tickPadding(5)
// 	        .orient("left")
// 	        ;
//
// 	      x.domain([dateExtent[0],dateExtent[1]]);
//
// 	      xAxis
// 	        // .scale(x)
// 	        .ticks(5)
// 	        .tickFormat(d3.time.format("%b '%y"))
// 	        ;
//
// 	      if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
// 	        xAxis.tickFormat(d3.time.format("%b-%Y")).ticks(2);
// 	      }
//
// 	      axis.transition().duration(800).call(xAxis);
// 	      ySvg.call(yAxis);
//
// 	      artistPathsNest = artistPaths;
//
// 	      artistPathsNest = artistPathsNest.sort(function(a,b) {return a.values[0]["chart_date"]-b.values[0]["chart_date"];});
//
// 	      path = path.data(artistPathsNest, function(d){
// 	        var key = d.key;
// 	        return key + 10000;
// 	      });
//
// 	      trackLegend = trackLegend.data(artistPathsNest,function(d){
// 	        return d.key;
// 	      });
//
// 	      var c10 = d3.scale.category10();
//
// 	      var trackLegendDiv = trackLegend.enter()
// 	        .append("div")
// 	        .style("position","relative")
// 	        ;
//
// 	      trackLegendDiv.append("div")
// 	        .attr("class","track-legend-timer")
// 	        .filter(function(d,i){
// 	          return d.key == sampleClicked;
// 	        })
// 	        .each(function(d){
// 	          // console.log(sampleClicked);
// 	          // console.log(d);
// 	        })
// 	        .style("width","10px")
// 	        .transition()
// 	        .duration(28000)
// 	        .ease("linear")
// 	        .style("width","180px")
// 	        ;
//
// 	      var trackLegendPs = trackLegendDiv.append("p")
// 	        .attr("class","track-legend-item track-legend-item-title tk-futura-pt")
// 	        .style("color",function(d,i){
// 	          return c10(i);
// 	        })
// 	        .style("border-top",function(d,i){
// 	          if(i==0){
// 	            return "1px solid #333";
// 	          }
// 	          return null;
// 	        })
// 	        .text(function(d){
// 	          return d.values[0].title.split("(")[0].split("/")[0];
// 	        })
// 	        .on("mouseover",function(d,i){
// 	          var artistFull = d["values"][0]["track_info"]["artist"];
// 	          d3.select(".number-one-artist").text(function(d,i){
// 	            return artistFull;
// 	          })
// 	          d3.select(".path-container").classed("path-selected",true);
// 	          d3.select(this).style("color","white");
// 	          var index = i;
// 	          path.filter(function(d,i){
// 	            return i == index;
// 	          })
// 	          .style("stroke","white").attr("class", "line path-match");
//
// 	          pausePlay.style("visibility","hidden");
//
// 	        })
// 	        .on("mouseout",function(d,i){
// 	          d3.select(".number-one-artist").text(artist)
// 	          d3.select(".path-container").classed("path-selected",false);
// 	          d3.selectAll(".track-legend-item").style("color",function(d,i){
// 	            return c10(i);
// 	          });
//
// 	          path.style("stroke",function(d,i){
// 	            return c10(i);
// 	          })
// 	          .attr("class", "line");
//
// 	          pausePlay.style("visibility","visible");
// 	        })
// 	        .on("click",function(d,i){
// 	          sampleClicked = +d.key;
//
// 	          clearInterval(sampleRotate);
//
// 	          sampleRotate = setInterval(function(){
// 	            loadedUrl = sampleInterval();
// 	            var startTime = context.currentTime;
// 	            loadSounds(loadedUrl, 30000, startTime, "now");
// 	          },28000);
//
// 	          d3.selectAll(".track-legend-timer").transition().duration(0).style("width","0px");
//
//
// 	          d3.selectAll(".track-legend-timer").filter(function(d,i){
// 	            return d.key == sampleClicked;
// 	          })
// 	          .style("width","10px").transition().duration(28000).ease("linear").style("width","180px");
//
// 	          trackLegend.style("background-color",null).select("svg").style("fill",null).style("opacity",0);
// 	          d3.select(this).select("svg").style("opacity",1).style("fill","white");
// 	          loadedUrl = "https://p.scdn.co/mp3-preview/"+d["values"][0]["track_info"]["song_url"]
// 	          if ( source ) {
// 	            if(!source.stop){
// 	              source.stop = source.noteOff;
// 	            }
// 	            source.stop(0);
// 	          }
// 	          if ( lastSource ) {
// 	            if(!lastSource.stop){
// 	              lastSource.stop = lastSource.noteOff;
// 	            }
// 	            lastSource.stop(0);
// 	          }
// 	          var startTime = context.currentTime + 1;
// 	          loadSounds(loadedUrl, 30000, startTime, "now");
// 	        })
// 	        .append("span")
// 	        .append("svg")
// 	        .attr("class",function(d){
// 	          if(d.key == sampleClicked){
// 	            return "track-legend-item-speaker";
// 	          }
// 	          return "track-legend-item-speaker hidden-opacity";
// 	        })
// 	        .attr("fill",function(d,i){
// 	          return "white";
// 	        })
// 	        .attr("viewBox","0 10 50 50")
// 	        .attr("enable-background","new 0 0 100 100")
// 	        .attr("xml:space","preserve")
// 	        .html(function(){
// 	          return "<g style='-ms-transform: translate(-30px,-7px); -webkit-transform: translate(-30px,-7px);transform: translate(-30px,-13px);'><polygon points='51.964,33.94 38.759,43.759 30.945,43.759 30.945,56.247 38.762,56.247 51.964,66.06  '></polygon><path d='M66.906,34.21l-3.661,2.719c2.517,3.828,3.889,8.34,3.889,13.071s-1.372,9.242-3.889,13.072l3.661,2.718   c3.098-4.604,4.786-10.069,4.786-15.79S70.004,38.821,66.906,34.21'></path><path d='M56.376,42.037h-0.317c1.378,2.441,2.126,5.18,2.126,7.963c0,2.79-0.748,5.528-2.126,7.97h0.321l2.516,1.864   c1.738-2.996,2.676-6.383,2.676-9.834s-0.939-6.839-2.676-9.841L56.376,42.037z'></path></g></svg>";
// 	        })
// 	        ;
//
// 	      path
// 	        .style("stroke", function(d,i){
// 	          return c10(i);
// 	        })
// 	        .transition()
// 	        .duration(0)
// 	        .style("opacity",null)
// 	        .style("stroke-width", function(d){
// 	          return "2px"
// 	        })
// 	        .attr("d", function(d){
// 	          return line(d.values);
// 	        })
// 	        ;
//
// 	      path.enter()
// 	        .append("path")
// 	        .attr("class", "line")
// 	        .attr("d", function(d){
// 	          return line(d.values);
// 	        })
// 	        .on("mouseover",function(d){
// 	          // console.log(d);
// 	        })
// 	        .style("stroke-width", function(d){
// 	          return "2px"
// 	        })
// 	        .style("stroke", function(d,i){
// 	          return c10(i);
// 	        })
// 	        ;
//
// 	      path.exit().remove();
// 	      trackLegend.exit().remove();
// 	    }
//
// 	    pathChange(artist);
//
// 	    var startTime = context.currentTime + 1;
// 	    loadSounds(loadedUrl, 30000, startTime, "now");
//
// 	    function sampleInterval(){
// 	      var lengthofList = d3.selectAll(".track-legend-item").size();
// 	      var itemListCount;
// 	      var loadedUrl;
//
// 	      d3.selectAll(".track-legend-item").style("background-color",null).select("svg").style("fill",null).style("opacity",0);
//
// 	      d3.selectAll(".track-legend-item").each(function(d,i){
// 	        if(d.key == sampleClicked){
// 	          itemListCount = i;
// 	        }
// 	      });
//
// 	      d3.selectAll(".track-legend-item").filter(function(d,i){
// 	        if(itemListCount+1>(lengthofList-1)){
// 	          return i == 0
// 	        }
// 	        return i == itemListCount+1;
// 	      })
// 	      .select("svg").style("opacity",1)
// 	      .style("fill","white")
// 	      .each(function(d,i){
// 	        loadedUrl = "https://p.scdn.co/mp3-preview/"+d["values"][0]["track_info"]["song_url"]
// 	        sampleClicked = +d.key
// 	      })
// 	      ;
//
// 	      d3.selectAll(".track-legend-timer").transition().duration(0).style("width","0px");
//
// 	      d3.selectAll(".track-legend-timer").filter(function(d,i){
// 	        return d.key == sampleClicked;
// 	      })
// 	      .style("width","10px").transition().duration(28000).ease("linear").style("width","180px");
//
// 	      return loadedUrl;
// 	    }
//
// 	    sampleRotate = setInterval(function(){
// 	      loadedUrl = sampleInterval();
// 	      var startTime = context.currentTime;
// 	      loadSounds(loadedUrl, 30000, startTime, "now");
// 	    },28000);
//
// 	  }
//
// 	  var path = pathSvg.selectAll('path').data(filteredData, function(d){
// 	    return d.key;
// 	  });
//
// 	  function textFill(d){
// 	    var rank = d.nestedDateArray[currentDate];
// 	    if (rank == 1){
// 	      return colorTwo;
// 	    }
// 	    else{
// 	      return textColor;
// 	    }
// 	  }
//
// 	  function pathStroke(d){
// 	    var rank = d.nestedDateArray[currentDate];
// 	    if (rank == 1){
// 	      return "url(#temperature-gradient)";
// 	      // return colorTwo;
// 	    }
// 	    else{
// 	      return "url(#temperature-gradient)";
//
// 	      // return pathColor;
// 	    }
// 	  }
// 	  function pathOpacity(d){
// 	    if (currentDate in d.nestedDateArray){
// 	      var rank = d.nestedDateArray[currentDate];
// 	      if(rank==1){
// 	        return 1;
// 	      }
// 	      return .2;
// 	      return opacityScale(rank);
// 	    }
// 	    return .2;
// 	    // return .05;
// 	  }
//
// 	  path.enter().append("path")
// 	    .attr("class", "line")
// 	    .attr("d", function(d){
// 	      return line(d.values);
// 	    })
// 	    .attr("transform", "translate(" + x(dates[1]) + ")")
// 	    .style("stroke", function(d){
// 	      var data = d;
// 	      return pathStroke(data);
// 	    })
// 	    .style("opacity",function(d){
// 	      var data = d;
// 	      return pathOpacity(data);
// 	    });
//
// 	  var text = svgTwo.selectAll("text").data(filteredData, function(d){
// 	    return d.key;
// 	  });
//
// 	  d3.select(".number-one").transition().duration(5000).text(function(d){
// 	    var date = niceParseTwo(dates[dates.length-1]);
// 	    return date;
// 	  });
//
// 	  d3.select(".number-one-artist")
// 	    .style("color",null)
// 	    // .transition().duration(5000)
// 	    .text(topArtist)
// 	    ;
//
// 	  text.enter().append("text")
// 	    .style("fill", function(d){
// 	      var data = d;
// 	      return textFill(data);
// 	    })
// 	    .text(function(d){
// 	      return d.values[0].track_info.title;
// 	    })
// 	    .attr("x", 0)
// 	    .attr("y",function(d){
// 	      var data = d;
// 	      return textTopPosition(data);
// 	    })
// 	    .attr("class","line-name tk-futura-pt")
// 	    ;
//
// 	  axis = xSvg.append("g").attr("class", "x axis tk-futura-pt")
// 	    .attr("transform", function(){
// 	      var shift = height + 60;
// 	      return "translate(0," + shift +")";
// 	    })
// 	    .call(xAxis)
// 	    ;
//
// 	  var transition = d3.select({}).transition()
// 	      .duration(shiftDuration)
// 	      .ease("linear");
//
// 	  var tickCount = 0;
//
// 	  var dataTopArtist = Object.keys(topArtistCountArray).map(function(d){
// 	    return {"artist":d,"count":topArtistCountArray[d]};
// 	  });
//
// 	  function tick() {
// 	    // if(Math.random()>.7){
// 	    //   $(".arrow").velocity('callout.bounce', {duration: 500, complete: function() {
// 	    //   }});
// 	    // }
//
// 	    var currTime = context.currentTime;
//
// 	    for (var i in dates){
// 	      dates[i] = d3.time.day.offset(dates[i], 7);
// 	    };
//
// 	    var nextSong;
//
//
// 	    if(nestedDatesTwo[unParse(dates[dates.length-1])]["track"] != nestedDatesTwo[unParse(d3.time.day.offset(dates[dates.length-1], 7))]["track"] && muted == false){
// 	      // console.log(nestedDatesTwo[unParse(dates[dates.length-1])]);
// 	      // console.log(nestedDatesTwo[unParse(d3.time.day.offset(dates[dates.length-1], 7))]);
//
// 	      for (i=2; i<20; i++){
// 	        var timeOne = d3.time.day.offset(dates[dates.length-1], 7);
// 	        var timeTwo = d3.time.day.offset(dates[dates.length-1], 7*i);
// 	        if(nestedDatesTwo[unParse(timeOne)]["track"] != nestedDatesTwo[unParse(timeTwo)]["track"]){
// 	          playLength = (i-1) * shiftDuration;
// 	          break;
// 	        }
// 	      }
//
// 	      var previewItemId = nestedDatesTwo[unParse(d3.time.day.offset(dates[dates.length-1], 7))]["preview"];
// 	      // console.log(previewItemId);
// 	      // var previewItem = previewData.get(nestedDatesTwo[unParse(d3.time.day.offset(dates[dates.length-1], 7))]["track"]);
// 	      // var previewItemId = previewItem.id;
// 	      // var previewItemFormat = previewItem.format;
// 	      // if (previewItemFormat == "m4a"){
// 	      //   nextSong = "url/" + previewItemId + ".m4a"
// 	      // }
// 	      // else if(previewItemFormat == "wav"){
// 	      //   nextSong = "url/" + previewItemId + ".wav"
// 	      // } else {
//
// 	      nextSong = "https://p.scdn.co/mp3-preview/" + previewItemId
// 	      console.log(nextSong);
// 	      if(previewItemId == "manual"){
// 	        var hostUrl = document.location.origin;
// 	        var pathUrl = document.location.pathname.replace("index.html","");
// 	        var idSong = nestedDatesTwo[unParse(d3.time.day.offset(dates[dates.length-1], 7))]["track"];
// 	        nextSong = hostUrl+pathUrl+"url/"+idSong + ".m4a"
// 	      }
// 	      // }
// 	      startTime = currTime + shiftDuration/1000;
//
// 	      loadSounds(nextSong, playLength, startTime, "scheduled");
// 	    };
//
// 	    currentDate = unParse(dates[dates.length-1]);
//
// 	    dateAhead = unParse(d3.time.day.offset(dates[dates.length-1], 7));
//
// 	    changeYear(currentYear);
//
// 	    var numberOneDates = [dates[dates.length-1]];
//
// 	    for (i=0; i<8; i++){
// 	      var length = numberOneDates.length;
// 	      var date = d3.time.day.offset(numberOneDates[length - 1],1);
// 	      numberOneDates.push(date);
// 	    }
//
// 	    transition = transition.each(function() {
//
// 	      var numberShiftDuration = shiftDuration/7;
//
// 	      d3.select(".year-drop-down-text").text(currentDate.slice(0,4));
//
// 	      d3.select(".number-one")
// 	        .transition().duration(numberShiftDuration).text(function(d){
// 	          return niceParseTwo(numberOneDates[0]);
// 	        })
// 	        .transition().duration(numberShiftDuration).text(function(d){
// 	          return niceParse(numberOneDates[1]);
// 	        })
// 	        .transition().duration(numberShiftDuration).text(function(d){
// 	          return niceParse(numberOneDates[2]);
// 	        })
// 	        .transition().duration(numberShiftDuration).text(function(d){
// 	          return niceParse(numberOneDates[3]);
// 	        })
// 	        .transition().duration(numberShiftDuration).text(function(d){
// 	          return niceParse(numberOneDates[4]);
// 	        })
// 	        .transition().duration(numberShiftDuration).text(function(d){
// 	          return niceParse(numberOneDates[5]);
// 	        })
// 	        .transition().duration(numberShiftDuration).text(function(d){
// 	          return niceParse(numberOneDates[6]);
// 	        })
// 	        .transition().duration(numberShiftDuration).text(function(d){
// 	          return niceParse(numberOneDates[7]);
// 	        })
// 	        ;
//
//
// 	      if(!mobile){
// 	        var topArtistName = nestedDatesTwo[currentDate].artist.split(" Feat")[0];
// 	        if(topArtistName in topArtistCountArray){
// 	          topArtistCountArray[topArtistName] = topArtistCountArray[topArtistName] + 1;
// 	        }else{
// 	          topArtistCountArray[topArtistName] = 1;
// 	        }
// 	        ;
//
// 	        var dataTopArtistUpdated = Object.keys(topArtistCountArray).map(function(d){
// 	          return {"artist":d,"count":topArtistCountArray[d]};
// 	        }).sort(function(a,b) {return b.count-a.count;})
// 	        .filter(function(d,i){
// 	          return i < 10;
// 	        })
// 	        ;
//
// 	        cumulativeStats = d3.select(".cumulative-container").selectAll("p")
// 	          .data(dataTopArtistUpdated,function(d){
// 	            return d.artist;
// 	          })
// 	          ;
//
// 	        cumulativeStats
// 	          .enter()
// 	          .append("p")
// 	          .attr("class","cumlative-artist")
// 	          ;
//
// 	        d3.selectAll(".cumlative-artist")
// 	          .sort(function(a,b) {return b.count-a.count;})
// 	          .text(function(d){
// 	            return d.artist + ": " + d.count;
// 	          })
// 	          ;
//
// 	        cumulativeStats.exit().remove();
// 	      }
//
// 	      if(nestedDatesTwo[unParse(dates[dates.length-2])]["track"] != nestedDatesTwo[unParse(dates[dates.length-1])]["track"]) {
// 	        d3.select(".number-one-artist").text(topArtist).style("color",null);
// 	        $(".number-one-artist").velocity('transition.slideDownIn');
// 	      }
//
// 	      x.domain([dates[2], dates[dates.length-1]]);
//
// 	      face
// 	        .style("opacity",function(d){
// 	          var data = d;
// 	          return faceOpacity(data);
// 	        })
// 	        .transition()
// 	        .style("top",function(d){
// 	          var data = d;
// 	          return faceTopPosition(data);
// 	        })
// 	        .style("background-color", faceBackground)
// 	        ;
//
// 	      text.attr("transform", null)
// 	        .style("fill", function(d){
// 	          var data = d;
// 	          return textFill(data);
// 	        })
// 	        .style("opacity",function(d){
// 	          var dateMin = Object.keys(d.nestedDateArray)[0];
// 	          var dateMax = Object.keys(d.nestedDateArray)[Object.keys(d.nestedDateArray).length - 1];
// 	          if (currentDate in d.nestedDateArray){
// 	          // if (currentDate in d.nestedDateArray && currentDate != dateMax){
// 	            return 1;
// 	          }
// 	          else{
// 	            return 0;
// 	          }
// 	        })
// 	        .transition()
// 	        .attr("y",function(d){
// 	          var data = d;
// 	          return textTopPosition(data);
// 	        })
// 	        ;
//
// 	      path.attr("d", function(d){
// 	          return line(d.values);
// 	        })
// 	        .style("stroke", function(d){
// 	          var data = d;
// 	          return pathStroke(data);
// 	        })
// 	        .attr("transform", null)
// 	        .transition()
// 	        .attr("transform", "translate(" + x(dates[1]) + ")")
// 	        .style("opacity",function(d){
// 	          if (currentDate in d.nestedDateArray){
// 	            var rank = d.nestedDateArray[dateAhead];
// 	            if (rank < 11 && rank > 0){
// 	              return opacityScale(rank);
// 	              //return 1;
// 	            }
// 	            else{
// 	              return .05;
// 	            }
// 	          }
// 	          else {
// 	              return .05;
// 	          }
// 	        })
// 	        ;
//
// 	        axis.call(xAxis);
//
//
// 	      // }).transition().each("start", tick);
// 	      }).transition().each("start", function(){
// 	        if (this.__transition__.count < 2) tick();
// 	      //   //tick();
// 	      });
// 	      // });
// 	    };
//
// 	  (function() {
// 	    hidden = "hidden";
//
// 	    // Standards:
// 	    if (hidden in document)
// 	      document.addEventListener("visibilitychange", onchange);
// 	    else if ((hidden = "mozHidden") in document)
// 	      document.addEventListener("mozvisibilitychange", onchange);
// 	    else if ((hidden = "webkitHidden") in document)
// 	      document.addEventListener("webkitvisibilitychange", onchange);
// 	    else if ((hidden = "msHidden") in document)
// 	      document.addEventListener("msvisibilitychange", onchange);
// 	    // IE 9 and lower:
// 	    else if ("onfocusin" in document)
// 	      document.onfocusin = document.onfocusout = onchange;
// 	    // All others:
// 	    else
// 	      window.onpageshow = window.onpagehide
// 	      = window.onfocus = window.onblur = onchange;
//
// 	    function onchange (evt) {
// 	      var v = "visible", h = "hidden",
// 	          evtMap = {
// 	            focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
// 	          };
//
// 	      evt = evt || window.event;
// 	      if (evt.type in evtMap){
// 	      }
// 	      else {
// 	        if(this[hidden] == true){
// 	          if(playing){
// 	            pause();
// 	          }
// 	        }else{
// 	          if(playing){
// 	            playMusic();
// 	          }
// 	        }
// 	      }
// 	    }
//
// 	    // set the initial state (but only if browser supports the Page Visibility API)
// 	    if( document[hidden] !== undefined )
// 	      onchange({type: document[hidden] ? "blur" : "focus"});
// 	  })();
//
// 	  var chartWideContainer = d3.select(".change-year-wide");
//
// 	  var chartWide = d3.select(".change-year-wide-data");
//
// 	  var shortCut = d3.selectAll(".text-section");
// 	  var markerMoveScale = d3.scale.linear().domain([nestedDates.length,0]).range([0,530])
//
// 	  shortCut.on("click",function(d,i){
// 	    d3.select(".bio-info").transition().duration(300).style("opacity",1);
// 	    var dateSelected;
// 	    if(i==0){
// 	      dateSelected = 1343;
// 	    }
// 	    else if (i==1){
// 	      dateSelected = 1154;
// 	    }
// 	    else if (i==2){
// 	      dateSelected = 1099;
// 	    }
// 	    else if (i==3){
// 	      dateSelected = 1045;
// 	    }
// 	    else if (i==4){
// 	      dateSelected = 1040;
// 	    }
// 	    else if (i==5){
// 	      dateSelected = 924;
// 	    }
// 	    // chartWideMarker.transition().duration(200).style("left",function(d){
// 	    //   return markerMoveScale(dateSelected) - 10 + "px";
// 	    // })
// 	    if(playing){
// 	      // var coordinates = d3.mouse(this);
// 	      // chartWideMarker.style("left",function(d){
// 	      //   return coordinates[0] - 8 + "px"
// 	      // })
// 	      // chartWideMarkerMouseMove.style("opacity",0);
// 	      moveChart(nestedDates[dateSelected].key);
// 	    }
// 	    else if(!playing){
// 	      trackLegend.style("visibility","hidden");
// 	      face.style("visibility","visible");
// 	      text.style("visibility","visible");
// 	      clickPlayTip.style("visibility","visible");
// 	      y.domain([10, 1]);
// 	      x.domain([dates[2], dates[dates.length-1]]);
// 	      yAxis
// 	        .scale(y)
// 	        .tickFormat(function(d,i){
// 	          if(d==1){
// 	          return "#" + d;
// 	          }
// 	          return d;
// 	        })
// 	        .innerTickSize(-width)
// 	        .tickValues( y.ticks( 10 ).concat( y.domain() ) )
// 	        .tickPadding(5)
// 	        .orient("left")
// 	        ;
// 	      xAxis
// 	        // .scale(x)
// 	        .ticks(5)
// 	        .tickFormat(d3.time.format("%b-%d %Y"))
// 	        ;
//
// 	      if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
// 	        xAxis.tickFormat(d3.time.format("%b-%Y")).ticks(2);
// 	      }
// 	      ySvg.call(yAxis);
// 	      axis.transition().duration(100).call(xAxis);
// 	      pausePlay.style("pointer-events","none");
// 	      moveChart(nestedDates[dateSelected].key);
// 	    }
// 	  })
// 	  ;
//
// 	  var yearDecadeNest = d3.nest()
// 	    .key(function(d){
// 	      return d.key.slice(0,3);
// 	    })
// 	    .key(function(d){
// 	      return d.key.slice(0,4);
// 	    })
// 	    .sortKeys(function(a,b) { return +a - +b; })
// 	    .key(function(d){
// 	      return d.key.slice(5,7);
// 	    })
// 	    .sortKeys(function(a,b) { return +a - +b; })
// 	    .entries(nestedDates.slice(10,3015))
// 	    ;
//
// 	  function widthIdeal(d){
// 	    var yearLength = d.values.length;
// 	    if(mobile){
// 	      return null;
// 	    }
// 	    if (d.key == startString.slice(0,3)){
// 	      return "236px";
// 	    }
// 	    if(yearLength>4){
// 	      if(yearLength>8){
// 	        return "114px"
// 	      }
// 	      return "78px";
// 	    }
// 	    return null;
// 	  }
//
// 	  function widthExpanded(d){
// 	    if(mobile){
// 	      return null;
// 	    }
// 	    var yearLength = d.values.length;
// 	    if(yearLength>4){
// 	      if(yearLength>8){
// 	        return "208px"
// 	      }
// 	      return "192px";
// 	    }
// 	    return "146px";
// 	  }
//
// 	  var decadeBucket = chartWide.selectAll("div")
// 	    .data(yearDecadeNest)
// 	    .enter()
// 	    .append("div")
// 	    .attr("class","chart-year-wide-data-decade-container")
// 	    .style("width",function(d,i){
// 	      var data = d;
// 	      return widthIdeal(data);
// 	    })
// 	    .on("touchstart",function(d,i){
// 	      if(mobile){
// 	        var mouseOvered = d3.select(this);
// 	        var notSelected = decadeBucket.select("div")
// 	          .style("pointer-events","none")
// 	          .selectAll(".chart-year-wide-data-year")
// 	          .style("opacity",null)
// 	          ;
// 	        mouseOvered.select("div")
// 	          .style("visibility","visible")
// 	          .style("pointer-events","all")
// 	          .selectAll(".chart-year-wide-data-year")
// 	          .style("opacity",1)
// 	          ;
// 	      }
// 	    })
// 	    .on("mouseover",function(d,i){
// 	      if(!mobile){
// 	        var mouseOvered = d3.select(this);
//
// 	        var notSelected = decadeBucket.filter(function(d,i){
// 	          return d.key != startString.slice(0,3);
// 	        })
// 	        ;
//
// 	        notSelected
// 	          .selectAll(".chart-year-wide-data-year")
// 	          .style("opacity",null)
// 	          ;
//
// 	        mouseOvered.select("div")
// 	          // .style("visibility","visible")
// 	          .selectAll(".chart-year-wide-data-year")
// 	          .style("opacity",1)
// 	          ;
// 	      }
// 	    })
// 	    .on("mouseout",function(d){
// 	      if(!mobile){
// 	        var notSelected = decadeBucket.filter(function(d,i){
// 	          return d.key != startString.slice(0,3);
// 	        })
// 	        ;
// 	        notSelected
// 	          .selectAll(".chart-year-wide-data-year")
// 	          .style("opacity",null)
// 	          ;
// 	      }
// 	    })
// 	    ;
//
// 	  decadeBucket.append("p")
// 	    .attr("class","chart-year-wide-data-decade-text")
// 	    .text(function(d){
// 	      return d.key + "0s";
// 	    })
// 	    ;
//
// 	  var yearBucket = decadeBucket
// 	    .append("div")
// 	    .attr("class","chart-year-wide-data-year-wrapper")
// 	    .selectAll(".chart-year-wide-data-year-container")
// 	    .data(function(d,i){
// 	      return d.values;
// 	    })
// 	    .enter()
// 	    .append("div")
// 	    .attr("class","chart-year-wide-data-year-container")
// 	    ;
//
// 	  var monthMap = {"01":"JAN","02":"FEB","03":"MAR","04":"APR","05":"MAY","06":"JUN","07":"JUL","08":"AUG","09":"SEP","10":"OCT","11":"NOV","12":"DEC"};
//
// 	  yearBucket.append("p")
// 	    .attr("class","chart-year-wide-data-year")
// 	    .text(function(d,i){
// 	      return d.key;
// 	    })
// 	    .on("click",function(d,i){
//
// 	      startString = d.values[0].values[0].key;
//
// 	      d3.select(".play-button-new").style("pointer-events","none").style("color",null);
// 	      d3.select(".pause-button-new").style("pointer-events","all").style("color","white");
//
// 	      moveChart(startString)
//
// 	      var notSelected = decadeBucket.filter(function(d,i){
// 	        return d.key != startString.slice(0,3);
// 	      })
// 	      ;
//
// 	      notSelected.select("p").style("color",null);
// 	      notSelected.select("div").selectAll("div").select("p").style("opacity",null).style("color",null);
// 	      notSelected.select("div").selectAll("div").select("div").style("visibility","hidden");
//
// 	      notSelected
// 	        .style("width",function(d,i){
// 	          var data = d;
// 	          return widthIdeal(data);
// 	        })
// 	        ;
//
// 	      var decade = d3.select(this.parentNode.parentNode.parentNode);
//
// 	      decade.select("p").style("color","#FF2F28")
// 	      decade.select("div").selectAll("div").select("div").style("visibility","hidden");
// 	      decade.select("div").selectAll("div").select("p").style("color",null).style("opacity",1);
//
// 	      decade.style("width",function(d,i){
// 	          var data = d;
// 	          return widthExpanded(data);
// 	        })
// 	        ;
//
// 	      var yearSelected = d3.select(this.parentNode);
// 	      //
// 	      yearSelected.select("p")
// 	        .style("color","#FF2F28")
// 	        ;
// 	      //
// 	      yearSelected.select("div").style("visibility","visible").selectAll("p")
// 	        .style("color",function(d,i){
// 	          if(i==0){
// 	            return "#FF2F28";
// 	          }
// 	          return null;
// 	        })
// 	        .style("opacity",0)
// 	        .transition()
// 	        .duration(300)
// 	        .delay(function(d,i){
// 	          return i*70;
// 	        })
// 	        .style("opacity",1)
// 	        ;
// 	    })
// 	    ;
//
// 	  var monthBucket = yearBucket.append("div")
// 	    .attr("class","chart-year-wide-data-month-container")
// 	    .style("left",function(d,i){
// 	      var yearLength = d3.select(this.parentNode.parentNode).datum().values.length;
// 	      if(yearLength > 8){
// 	        return "122px"
// 	      }
// 	      else if(yearLength < 5){
// 	        return "48px";
// 	      }
// 	      return null;
// 	    })
// 	    ;
//
// 	  monthBucket
// 	    .selectAll("p")
// 	    .data(function(d,i){
// 	      return d.values;
// 	    })
// 	    .enter()
// 	    .append("p")
// 	    .attr("class","chart-year-wide-data-month")
// 	    .text(function(d,i){
// 	      return monthMap[d.key];
// 	    })
// 	    .on("click",function(d,i){
// 	      d3.select(this.parentNode).selectAll("p").style("color",null);
// 	      d3.select(this).style("color","#FF2F28");
// 	      startString = d.values[0].key;
// 	      d3.select(".play-button-new").style("pointer-events","none").style("color",null);
// 	      d3.select(".pause-button-new").style("pointer-events","all").style("color","white");
// 	      if(startString.length<5){
// 	        startString = d.values[0].values[0].key;
// 	      }
// 	      moveChart(startString)
//
// 	    })
// 	    ;
//
// 	  var decadeSelected = decadeBucket.filter(function(d,i){
// 	    return d.key == startString.slice(0,3);
// 	  })
// 	  .style("width",function(d,i){
// 	    var data = d;
// 	    return widthExpanded(data);
// 	  })
// 	  ;
//
// 	  decadeSelected.select("p")
// 	    .style("color","#FF2F28")
// 	    ;
//
// 	  decadeSelected.select("div")
// 	    .style("visibility","visible")
// 	    .style("pointer-events","all")
// 	    ;
//
// 	  decadeSelected.selectAll(".chart-year-wide-data-year-container").select("p").style("opacity",1);
//
// 	  var yearSelected = decadeSelected.selectAll(".chart-year-wide-data-year-container")
// 	    .filter(function(d,i){
// 	      return d.key==startString.slice(0,4);
// 	    })
// 	    ;
//
// 	  yearSelected.select("p")
// 	    .style("color","#FF2F28")
// 	    ;
//
// 	  var monthSelected = yearSelected.select("div")
// 	    .style("visibility","visible")
// 	    .selectAll(".chart-year-wide-data-month")
// 	    .filter(function(d){
// 	      return d.key==startString.slice(5,7);
// 	    })
// 	    .style("color","#FF2F28")
// 	    ;
//
// 	  function playMusic(){
//
// 	    clearInterval(sampleRotate);
// 	    d3.select(".number-one-date-wrapper").style("opacity",1);
//
// 	    var playNow2 = createSource(scratch);
// 	    var source2 = playNow2.source;
//
// 	    if (!source2.start){
// 	      source2.start = source.noteOn;
// 	    }
// 	    source2.start(0);
//
// 	    var delayTime = 100;
// 	    playing = true;
//
// 	    tickDelay = setTimeout(function(){
//
// 	      if(muted == false){
//
// 	        for (i=2; i<20; i++){
// 	          var timeOne = d3.time.day.offset(dates[dates.length-1], 7);
// 	          var timeTwo = d3.time.day.offset(dates[dates.length-1], 7*i);
// 	          if(nestedDatesTwo[unParse(timeOne)]["track"] != nestedDatesTwo[unParse(timeTwo)]["track"]){
// 	            playLength = Math.max((i-1) * shiftDuration,shiftDuration);
// 	            break;
// 	          }
// 	        }
//
// 	        var currTime = context.currentTime;
// 	      //
// 	        var currSong;
// 	        var previewItemId = nestedDatesTwo[unParse(d3.time.day.offset(dates[dates.length-1], 7))]["preview"];
// 	        currSong = "https://p.scdn.co/mp3-preview/" + previewItemId
// 	        if(previewItemId == "manual"){
// 	          var hostUrl = document.location.origin;
// 	          var pathUrl = document.location.pathname.replace("index.html","");
// 	          var idSong = nestedDatesTwo[unParse(d3.time.day.offset(dates[dates.length-1], 7))]["track"];
// 	          currSong = hostUrl+pathUrl+"url/"+idSong + ".m4a"
// 	        }
// 	        startTime = currTime + 1;
// 	        loadSounds(currSong, playLength, startTime, "now");
// 	    //
// 	      }
// 	      transition = d3.select({}).transition()
// 	          .duration(shiftDuration)
// 	          .ease("linear");
//
// 	      tick();
//
// 	    }, delayTime);
//
// 	  }
//
// 	  function pause(){
// 	    transition = transition.transition(0).duration(0);
// 	    axis.transition().duration(0);
// 	    face.transition().duration(0);
// 	    text.transition().duration(0);
// 	    path.transition().duration(0);
// 	    d3.selectAll(".number-one").transition().duration(0);
//
// 	    if ( source ) {
// 	      if(playing == true){
// 	        if(!source.stop){
// 	          source.stop = source.noteOff;
// 	        }
// 	        source.stop(0);
// 	      }
// 	    }
//
// 	    if ( lastSource ) {
// 	      if(playing == true){
// 	        if(!lastSource.stop){
// 	          lastSource.stop = lastSource.noteOff;
// 	        }
// 	        lastSource.stop(0);
// 	      }
// 	    }
//
// 	  }
//
// 	  d3.select(".pause-button-new").on("click",function(){
// 	    if(playing){
// 	      d3.select(this).style("pointer-events","none").style("color",null);
// 	      d3.select(".play-button-new").style("pointer-events","all").style("color","white");
// 	      playing = false;
//
// 	      if ( source ) {
// 	        if(!source.stop){
// 	          source.stop = source.noteOff;
// 	        }
// 	        source.stop(0);
// 	      }
// 	      if ( lastSource ) {
// 	        if(!lastSource.stop){
// 	          lastSource.stop = lastSource.noteOff;
// 	        }
// 	        lastSource.stop(0);
// 	      }
// 	      pause();
// 	    }
// 	  });
//
// 	  d3.select(".play-button-new").on("click",function(){
// 	    if(!playing){
// 	      d3.select(this).style("pointer-events","none").style("color",null);
// 	      d3.select(".pause-button-new").style("pointer-events","all").style("color","white");
// 	      playing = true;
// 	      playMusic();
// 	    }
// 	  })
// 	  ;
// 	});
// 	});
// 	openingAnimation();
// 	});
//
// 	function BufferLoader(context, urlList, callback, playingLength, startingTime, thing) {
// 	  this.context = context;
// 	  this.urlList = urlList;
// 	  this.onload = callback;
// 	  this.bufferList = new Array();
// 	  this.loadCount = 0;
// 	  this.startingTime = startingTime;
// 	  this.playingLength = playingLength;
// 	  this.thing = thing;
// 	}
//
// 	BufferLoader.prototype.loadBuffer = function(url, index) {
// 	  // Load buffer asynchronously
// 	  var request = new XMLHttpRequest();
// 	  request.open("GET", url, true);
// 	  request.responseType = "arraybuffer";
//
// 	  var loader = this;
//
// 	  request.onload = function() {
// 	    // Asynchronously decode the audio file data in request.response
// 	    loader.context.decodeAudioData(
// 	      request.response,
// 	      function(buffer) {
// 	        if (!buffer) {
// 	          alert('error decoding file data: ' + url);
// 	          return;
// 	        }
// 	        loader.bufferList[index] = buffer;
// 	        if (++loader.loadCount == loader.urlList.length)
// 	          loader.onload(loader.bufferList, loader.playingLength, loader.startingTime, loader.thing);
// 	      },
// 	      function(error) {
// 	        console.error('decodeAudioData error', error);
// 	      }
// 	    );
// 	  }
//
// 	  request.onerror = function() {
// 	    alert('BufferLoader: XHR error');
// 	  }
//
// 	  request.send();
// 	}
//
// 	BufferLoader.prototype.load = function() {
// 	  for (var i = 0; i < this.urlList.length; ++i)
// 	  this.loadBuffer(this.urlList[i], i);
// 	}
//
// 	function loadScratch(url) {
// 	  var req = new XMLHttpRequest();
// 	  req.open("GET",url,true);
// 	  req.responseType = "arraybuffer";
// 	  req.onload = function() {
// 	      //decode the loaded data
// 	      context.decodeAudioData(req.response, function(buffer) {
// 	          scratch = buffer;
// 	      });
// 	  };
// 	  req.send();
// 	}
//
// 	function loadHit(url) {
// 	  var req = new XMLHttpRequest();
// 	  req.open("GET",url,true);
// 	  req.responseType = "arraybuffer";
// 	  req.onload = function() {
// 	      //decode the loaded data
// 	      context.decodeAudioData(req.response, function(buffer) {
// 	          hit = buffer;
// 	      });
// 	  };
// 	  req.send();
// 	}
//
// 	function play() {
// 	    //create a source node from the buffer
// 	    var src = context.createBufferSource();
// 	    src.buffer = buf;
// 	    //connect to the final output node (the speakers)
// 	    src.connect(context.destination);
// 	    //play immediately
// 	    src.noteOn(0);
// 	}
//
// 	window.AudioContext = window.AudioContext || window.webkitAudioContext;
// 	context = new AudioContext();
// 	loadScratch("url/i_wish.mp3");
// 	// loadHit("url/scratch.wav");
//
// 	function loadSounds(url,playingLength,startingTime,thing){
// 	  if(url == "https://p.scdn.co/mp3-preview/NULL"){
// 	    console.log("null song");
// 	  }
// 	  else{
// 	    var bufferLoader = new BufferLoader(
// 	      context,
// 	      [
// 	        url
// 	      ],
// 	      finishedLoading,playingLength,startingTime,thing
// 	      );
//
// 	    bufferLoader.load();
// 	  }
//
// 	}
//
// 	function finishedLoading(bufferList,playingLength,startingTime,thing) {
// 	  playHelper(bufferList[0],playingLength,startingTime,thing);
// 	};
//
//
// 	function createSource(buffer) {
// 	  var source = context.createBufferSource();
// 	  var gainNode = context.createGain ? context.createGain() : context.createGainNode();
// 	  source.buffer = buffer;
// 	  // Connect source to gain.
// 	  source.connect(gainNode);
// 	  // Connect gain to destination.
// 	  gainNode.connect(context.destination);
//
// 	  return {
// 	    source: source,
// 	    gainNode: gainNode
// 	  };
// 	}
//
// 	function playHelper(bufferNow,playingLength,startingTime,thing) {
//
// 	    var currTime = context.currentTime;
//
// 	    lastSource = source;
//
// 	    var playNow = createSource(bufferNow);
// 	    source = playNow.source;
// 	    source.loop = true;
// 	    var gainNode = playNow.gainNode;
// 	    var duration = playingLength/1000 + 2;
//
// 	    gainNode.gain.linearRampToValueAtTime(0, startingTime);
// 	    gainNode.gain.linearRampToValueAtTime(1, startingTime + 2);
//
// 	    if (!source.start){
// 	      source.start = source.noteOn;
// 	    }
//
// 	    source.start(context.currentTime + (startingTime - context.currentTime));
//
// 	    gainNode.gain.linearRampToValueAtTime(1, startingTime + duration-2);
// 	    gainNode.gain.linearRampToValueAtTime(0, startingTime + duration);
//
// 	}
//
// 	function openingAnimation(){
//
// 	  var rows = Math.floor(viewportHeight/50);
// 	  var columns = Math.floor(viewportWidth/50);
// 	  var columnRange = d3.range(0,columns*50,50);
// 	  var columnRangeOne = columnRange.slice(0,Math.floor(columns*.33));
// 	  var columnRangeTwo = columnRange.slice(Math.floor(columns*.66),columnRange.length-1);
// 	  var columnScale = d3.scale.quantize().domain([0,1]).range(columnRangeOne.concat(columnRangeTwo));
// 	  d3.select(".opening-one")
// 	    .text("How Music")
// 	    ;
//
// 	  if(!mobile){
// 	    setTimeout(function(){
// 	      d3.selectAll(".images-screen").selectAll(".img-screen")
// 	        .style("top",function(d,i){
// 	          var change = i*50;
// 	          return change+"px";
// 	        })
// 	        .style("left",function(d,i){
// 	          var change = columnScale(Math.random());
// 	          // var change = (Math.floor(Math.random()*rows))*50;
// 	          // var change = i*50;
// 	          return change+"px";
// 	        })
// 	        .transition()
// 	        .duration(1500)
// 	        .delay(function(d,i){
// 	          return i*350;
// 	        })
// 	        .ease("linear")
// 	        .style("opacity",.2)
// 	        .style("left",function(d,i){
// 	          var left = d3.select(this).style("left").replace("px","");
// 	          if(left<viewportWidth/2){
// 	            var change = +left+(25);
// 	            return change+"px";
// 	          }
// 	          return left+"px";
// 	        })
// 	        ;
// 	    }, 100);
//
// 	    setTimeout(function(){
// 	      d3.selectAll(".opening-two")
// 	        .transition()
// 	        .duration(500)
// 	        .ease("cubic")
// 	        .style("opacity",1)
// 	        ;
// 	      d3.select(".opening-one")
// 	        .transition()
// 	        .duration(500)
// 	        .ease("cubic")
// 	        .style("margin-top","0px")
// 	        .style("opacity",1)
// 	        ;
//
// 	      d3.selectAll(".description-section")
// 	        .transition()
// 	        .duration(500)
// 	        .delay(400)
// 	        .ease("cubic")
// 	        .style("opacity",1)
// 	        ;
//
// 	      d3.selectAll(".button-border")
// 	        .transition()
// 	        .duration(800)
// 	        .delay(1000)
// 	        .ease("exp")
// 	        .style("width","100%")
// 	        ;
//
// 	      d3.selectAll(".text-load")
// 	        .transition()
// 	        .duration(800)
// 	        .delay(1100)
// 	        .ease("exp")
// 	        .style("opacity",1)
// 	        ;
//
// 	    }, 1600);
// 	  }
// 	  else{
// 	    d3.selectAll(".opening-two")
// 	      .style("opacity",1)
// 	      ;
// 	    d3.select(".opening-one")
// 	      .text("How Music")
// 	      ;
//
// 	    d3.selectAll(".description-section")
// 	      .style("opacity",1)
// 	      ;
//
// 	    d3.selectAll(".button-border")
// 	      .style("width","100%")
// 	      ;
//
// 	    d3.selectAll(".text-load")
// 	      .style("opacity",1)
// 	      ;
//
// 	    d3.selectAll(".button-symbol")
// 	      .style("opacity",1)
// 	      ;
//
// 	  }
//
//
//
// 	}
// }
