function finalproject(){
    var filePath="data.csv";
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);

}

var question1=function(filePath){


    var rowConverter = function (d) {
        return { Job_title : d['job_title_sim'],
            Average_salary : parseFloat(d['Avg Salary(K)']),
            Age: parseInt(d['Age'])

        };
    }
    d3.csv(filePath, rowConverter).then(function (data) {

        let new_data = data.filter(d => (d.Age <= 100 && d.Age >= 18 && d.Job_title === "data scientist"));

        var svgheight = 600;
        var svgwidth = 600;
        var padding = 50;

        var svg = d3.select("#q1_plot").append("svg")
            .attr("height", svgheight)
            .attr("width", svgwidth);

        var xScale = d3.scaleLinear()
            .domain([15,
                d3.max(new_data, function(d){ return d.Age + 20;})])
            .range([0, svgwidth-padding]);

        var yScale = d3.scaleLinear()
            .domain([d3.min(new_data, function(d){ return d.Average_salary;}),
                d3.max(new_data, function(d){ return d.Average_salary;})])
            .range([svgheight-padding, padding]);


        svg.selectAll("circle")
            .data(new_data).enter().append("circle")
            .attr("cx", function (d){
                return xScale(d.Age) + 65;
            })
            .attr("cy", function (d){
                return yScale(d.Average_salary);
            })
            .attr("r", 3)
            .attr("opacity", 0.5)
            .style("fill", "#69b3a2")

        /*
        svg.selectAll("text")
            .data(new_data).enter().append("text")
            .attr("x", function(d){
                return xScale(d.Age) + 65;
            })
            .attr("y", function(d){
                return yScale(d.Average_salary);
            })
            .text(function(d){ return "Age: "+  d.Age + " " + "Salary: " + d.Average_salary;})
            .attr("font-size", 8);

         */
        var xAxis = d3.axisBottom().scale(xScale);
        var yAxis = d3.axisLeft().scale(yScale);

        svg.append("g").call(xAxis)
            .attr("class", "xAxis")
            .attr("transform", "translate(50,555)")


        svg.append("g").call(yAxis)
            .attr("class", "yAxis")
            .attr("transform", "translate(50,5)")

    });


}

var question2=function(filePath){

    var rowConverter = function (d) {
        return { Job_title : d['job_title_sim'],
            Average_salary : parseFloat(d['Avg Salary(K)']),
            Rating: parseFloat(d['Rating'])

        };
    }
    d3.csv(filePath, rowConverter).then(function (data) {
        console.log(data)

        const unique = (value, index, self) => {
            return self.indexOf(value) === index
        }

        var myGroups = d3.map(data, function(d){return d.Job_title;}).filter(unique).sort((a, b) => d3.descending(a.Job_title, b.Job_title))
        console.log(data.filter(d => d.Job_title === "data scientist"))
        var table = [];
        for (let i = 0; i < myGroups.length; i++) {
            if (myGroups[i] !== "na")
                table.push({Job_title: myGroups[i], Avg_Rating: d3.rollup(data.filter(d => d.Job_title === myGroups[i]), v => d3.mean(v, d => d.Rating))})
        }
        console.log(table)

        var svgheight = 600;
        var svgwidth = 600;
        var padding = 100;

        var svg = d3.select("#q2_plot").append("svg")
            .attr("height", svgheight)
            .attr("width", svgwidth);

        var xScale = d3.scaleBand()
            .range([ padding, svgwidth - padding])
            .domain(table.map(d => d.Job_title))
            .padding(0.4);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(table, function(d){return d.Avg_Rating;})])
            .range([svgheight-padding, 0])
            .range([svgheight-padding, padding])

        var rects = svg.selectAll("rect")
            .data(table).enter().append("rect")
            .attr("x", function (d, i) {
                return xScale(d.Job_title);
            })
            .attr("y", function (d) {
                return yScale(d.Avg_Rating) - 50;
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function (d) {
                return svgheight - padding - yScale(d.Avg_Rating);
            })
            .attr("fill", "#69b3a2")

        var xAxis = d3.axisBottom().scale(xScale);
        var yAxis = d3.axisLeft().scale(yScale);

        svg.append("g").call(xAxis)
            .attr("class","xAxis")
            .attr("transform", "translate(-0, 450)")
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-30)")
            .style("text-anchor", "end");

        svg.append("g").call(yAxis)
            .attr("class","yAxis")
            .attr("transform", "translate(100, -50)")

    });


}

var question3=function(filePath){

    var rowConverter = function (d) {
        return { job_title_sim : d['job_title_sim'],
            Size : d['Size'],
            Avg_Salary: parseFloat(d['Avg Salary(K)'])

        };
    }

    d3.csv(filePath, rowConverter).then(function (data) {

        // set the dimensions and margins of the graph
        var margin = {top: 80, right: 25, bottom: 30, left: 90},
            width = 1500 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#q3_plot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
        const unique = (value, index, self) => {
            return self.indexOf(value) === index
        }

        var myGroups = d3.map(data, function(d){return d.job_title_sim;}).filter(unique).sort((a, b) => d3.descending(a.job_title_sim, b.job_title_sim))
        var myVars = d3.map(data, function(d){return d.Size;}).filter(unique).sort((a, b) => d3.descending(a.Size, b.Size))

        // var = ['1 - 50', '51 - 200', '201 - 500', '501 - 1000', '1001 - 5000', '5001 - 10000', '10000+', 'unknown']

        // Build X scales and axis:
        var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(myGroups)
            .padding(0.05);

        svg.append("g")
            .style("font-size", 15)
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()


        // Build Y scales and axis:
        var y = d3.scaleBand()
            .range([ height, 0 ])
            .domain(myVars)
            .padding(0.05);
        svg.append("g")
            .style("font-size", 15)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()

        // Build color scale
        var myColor = d3.scaleSequential()
            .interpolator(d3.interpolateInferno)
            .domain([d3.min(data, function(d) { return d.Avg_Salary }), d3.max(data, function(d) { return d.Avg_Salary })])

        var Tooltip=d3.select('#q3_plot').append('div').style('opacity',1).attr("style", "position: absolute");

        // add the squares
        svg.selectAll()
            .data(data, function(d) {return d.job_title_sim+':'+d.Size;})
            .enter()
            .append("rect")
            .attr("x", function(d) { return x(d.job_title_sim) })
            .attr("y", function(d) { return y(d.Size) })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", function(d) { return myColor(d.Avg_Salary)} )
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover",(e,d)=>{
                Tooltip.transition().duration(100).style("opacity",1);
                Tooltip.html('Average Salary: '+d.Avg_Salary.toFixed(2)).style("left",e.pageX +"px").style("top",e.pageY+"px");
            })
            .on("mousemove",(e,d)=>{
                Tooltip.transition().duration(100).style("opacity", 1);
                Tooltip.html('Average Salary: '+d.Avg_Salary.toFixed(2)).style("left",e.pageX+"px").style("top",e.pageY+"px");
            })
            .on("mouseout",(e,d)=>{
                Tooltip.transition().duration(1000).style("opacity",0);
            });


    })



}


var question4=function(filePath){
    var rowConverter = function (d) {
        return { job_title_sim : d['job_title_sim'],
            Degree: d['Degree']

        };
    }

    d3.csv(filePath, rowConverter).then(function (data) {
        var q1 = {};

        for (let i = 0; i < data.length; i++) {
            if (Object.keys(q1).includes(data[i].job_title_sim) == false){
                q1[data[i].job_title_sim] = [0, 0, 0];
                if (data[i].Degree == 'P'){
                    q1[data[i].job_title_sim][0] += 1;
                }
                else if (data[i].Degree == 'M'){
                    q1[data[i].job_title_sim][1] += 1;
                }
                else {
                    q1[data[i].job_title_sim][2] += 1;
                }
            }
            else{
                if (data[i].Degree == 'P'){
                    q1[data[i].job_title_sim][0] += 1;
                }
                else if (data[i].Degree == 'M'){
                    q1[data[i].job_title_sim][1] += 1;
                }
                else {
                    q1[data[i].job_title_sim][2] += 1;
                }
            }

        };

        q1keys = Object.keys(q1);

        counts = [];
        for (let y = 0; y < q1keys.length; y++) {
            counts.push({job_title_sim: q1keys[y], P: q1[q1keys[y]][0], M: q1[q1keys[y]][1], na: q1[q1keys[y]][2]});
        };

        var stack = d3.stack().keys(["P", "M", "na"]);
        var series = stack(counts);

        var svgheight = 500;
        var svgwidth = 1400;
        var padding = 30;


        var colors = function(i){
            colorarray = ["rosybrown", "silver", "gold"];
            return colorarray[i];
        }

        var svg = d3.select("#q4_plot").append("svg")
            .attr("height", svgheight)
            .attr("width", svgwidth);

        var xScale = d3.scaleBand()
            .domain(d3.range(counts.length))
            .range([padding, svgwidth-padding])
            .paddingInner(0.05);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(counts, function(d){
                return d.P + d.M + d.na;
            })])
            .range([padding, svgheight-padding]);

        var xLabel = d3.scaleBand()
            .domain(q1keys)
            .range([padding, svgwidth-padding]);

        var groups = svg.selectAll(".gbars")
            .data(series).enter().append("g")
            .attr("class", "gbars")
            .attr("fill", function(d, i){
                return colors(i);
            })

        var rects = groups.selectAll("rect")
            .data(function(d){
                return d;
            }).enter().append("rect")
            .attr("x", function(d,i){
                return xScale(i);
            })
            .attr("y", function(d){
                return yScale(d[0]);
            })
            .attr("width", function(d){
                return xScale.bandwidth();
            })
            .attr("height", function(d){
                return yScale(d[1]) - yScale(d[0]);
            });

        var xAxis = d3.axisTop(xLabel);
        var yAxis = d3.axisLeft(yScale);
        svg.append("g")
            .call(xAxis)
            .attr("class", "xAxis")
            .attr("transform", "translate(0, 30)");

        svg.append("g")
            .call(yAxis)
            .attr("class", "yAxis")
            .attr("transform", "translate(30, 0)");


    })


}


var question5=function(filePath){

    var rowConverter = function (d) {
        return {
            Avg_Salary: parseFloat(d['Avg Salary(K)'])

        };
    }

    d3.csv(filePath, rowConverter).then(function (data) {

        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 30, left: 40},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;


        // append the svg object to the body of the page
        var svg = d3.select("#q5_plot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        salary = []
        for (var i = 0; i < data.length; i++) {

            salary.push(data[i].Avg_Salary);

        }




        var data_sorted = salary.sort(d3.ascending)
        var q1 = d3.quantile(data_sorted, .25)
        var median = d3.quantile(data_sorted, .5)
        var q3 = d3.quantile(data_sorted, .75)
        var interQuantileRange = q3 - q1
        var min = q1 - 1.5 * interQuantileRange
        var max = q1 + 1.5 * interQuantileRange

        // Show the Y scale
        var y = d3.scaleLinear()
            .domain([0,  d3.max(data, function(d) { return d.Avg_Salary })])
            .range([height, 0]);
        svg.call(d3.axisLeft(y))

        // a few features for the box
        var center = 200
        var width = 100

        // Show the main vertical line
        svg
            .append("line")
            .attr("x1", center)
            .attr("x2", center)
            .attr("y1", y(min) )
            .attr("y2", y(max) )
            .attr("stroke", "black")


        // Show the box
        svg
            .append("rect")
            .attr("x", center - width/2)
            .attr("y", y(q3) )
            .attr("height", (y(q1)-y(q3)) )
            .attr("width", width )
            .attr("stroke", "black")
            .style("fill", "#69b3a2")

        // show median, min and max horizontal lines
        svg
            .selectAll("toto")
            .data([min, median, max])
            .enter()
            .append("line")
            .attr("x1", center-width/2)
            .attr("x2", center+width/2)
            .attr("y1", function(d){ return(y(d))} )
            .attr("y2", function(d){ return(y(d))} )
            .attr("stroke", "black")


    })




}