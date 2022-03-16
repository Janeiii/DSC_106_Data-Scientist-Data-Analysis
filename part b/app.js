function assignment3(){
    var filePath1="MJ.csv";
    var filePath2="Non-table dataset.json"
    question1(filePath1);
    question2(filePath2);
}


var question1=function(filePath){
    var rowConverter = function(d){
        return {
            G: parseFloat(d.G),
            Date: d.Date,
            Tm: d.Tm,
            Opp: d.Opp,
            Result: d.Result,
            PTS: parseFloat(d.PTS),
            Player: d.Player
        }
    }
    const mj = d3.csv(filePath, rowConverter);
    mj.then(function(data){
        var opps = {};

        for (let i = 0; i < data.length; i++) {
            if (Object.keys(opps).includes(data[i].Opp) == false) {
                opps[data[i].Opp] = data[i].PTS;
            }
            else {
                opps[data[i].Opp] += data[i].PTS;
            }
        }

        oppkeys = Object.keys(opps);
        counts = []
        for (let j = 0; j < oppkeys.length; j++) {
            counts.push({Opp: oppkeys[j], PTS: opps[oppkeys[j]]})
        }

        var height = 600;
        var width = 600;
        var padding = 60;

        var xScale = d3.scaleLinear()
                        .domain([0,
                                d3.max(counts, function(d){return d.PTS;})
                                ])
                        .range([0, width-padding]);

        var yScale = d3.scaleBand()
                       .domain(d3.range(oppkeys.length))
                        .range([height-padding, 0]); 

        var yLabel = d3.scaleBand()
                       .domain(oppkeys)
                        .range([height-padding, 0]); 

        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yLabel);

        var svg = d3.select("#q1_plot").append("svg")
                            .attr("width", width)
                            .attr("height", height);
                                

        var svg_bars1 = svg.selectAll(".bar")
                .data(counts).enter().append("rect")
                .attr("class", "2011")
                .attr("x", function(d){
                    return padding;
                })
                .attr("y", function(d, i){
                    return yScale(i);
                })
                .attr("width", function(d){
                    return xScale(d.PTS);
                })
                .attr("height", function(d){
                    return ((height-padding)/counts.length)-2;
                })
                .style("fill", "blue");

        svg.append("g")
            .call(xAxis)
            .attr("class", "xAxis")
            .attr("transform", "translate(60, 540)");

        svg.append("g")
            .call(yAxis)
            .attr("class", "yAxis")
            .attr("transform", "translate(60, 0)");
    });

}

var question2=function(filePath){
    //console.log(filePath);
    /*var js = d3.json(filePath);
    js.then(function(data){
        console.log(data);
    }*/
    d3.json(filePath).then(function(data){ 
        console.log(data)
    });
}

