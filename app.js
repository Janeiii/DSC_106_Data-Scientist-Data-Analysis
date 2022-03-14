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
        return { Job_title : d['Job Title'],
            Average_salary : d['Avg Salary(K)'],
            Age: parseInt(d['Age'])

        };
    }
    d3.csv(filePath, rowConverter).then(function (data) {
      console.log(data)

    })


}