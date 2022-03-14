function finalproject(){
    var filePath="data.csv";
    question1(filePath);
    /*
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);

     */
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
        console.log(new_data)

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

        console.log( d3.max(new_data, function(d){ return d.Average_salary;}))
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