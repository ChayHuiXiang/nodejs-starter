const { read } = require("fs");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let resultsArray = [];

let gradeHDCount = 0;
let gradeDCount = 0;
let gradeCCount = 0;
let gradePCount = 0;
let gradeNCount = 0;

let gradeHDPercentage;
let gradeDPercentage;
let gradeCPercentage;
let gradePPercentage;
let gradeNPercentage;

let bestStudentObject = {marks: -1};

function calculateGradePercentage() {
  const totalStudentCount = resultsArray.length;
  gradeHDPercentage = Math.round((gradeHDCount / totalStudentCount)*10000)/100;
  gradeDPercentage = Math.round((gradeDCount / totalStudentCount)*10000)/100;
  gradeCPercentage = Math.round((gradeCCount / totalStudentCount)*10000)/100;
  gradePPercentage = Math.round((gradePCount / totalStudentCount)*10000)/100;
  gradeNPercentage = Math.round((gradeNCount / totalStudentCount)*10000)/100;
}

function studentEnquiry() {
    rl.question("Enquire about student marks:", (name)=>{
        if (name === 'stop'){
            rl.close();
            return;
        }
        resultsArray.forEach((student)=>{
            if (student.name === name){
                console.log(student);
            }
        })
        studentEnquiry();
    })
}

function readName() {
  rl.question("Key in student name:", (name) => {
    if (name === "end") {
      calculateGradePercentage();
      console.log(
        `HD: ${gradeHDCount} ${gradeHDPercentage}% \nD: ${gradeDCount} ${gradeDPercentage}% \nC: ${gradeCCount} ${gradeCPercentage}% \nP: ${gradePCount} ${gradePPercentage}% \nN: ${gradeNCount} ${gradeNPercentage}% \n\nBest Student: \nName: ${bestStudentObject.name} Marks: ${bestStudentObject.marks}`
      );
      studentEnquiry();
      return;
    }
    rl.question("Key in student marks:", (marks) => {
      let marksInt = parseInt(marks);
      let grade;
      if (marksInt === "end") {
        calculateGradePercentage();
        console.log(
          `HD: ${gradeHDCount} ${gradeHDPercentage}% \nD: ${gradeDCount} ${gradeDPercentage}% \nC: ${gradeCCount} ${gradeCPercentage}% \nP:${gradePCount} ${gradePPercentage}% \nN: ${gradeNCount} ${gradeNPercentage}% \n\nBest Student: \nName: ${bestStudentObject.name} Marks: ${bestStudentObject.marks}`
        );
        studentEnquiry();
        return;
      } else if (Number.isNaN(marksInt) || marksInt < 0 || marksInt > 100) {
        console.log("Invalid Input.");
        readName();
        return;
      } else if (marksInt <= 50) {
        grade = "N";
        gradeNCount++;
      } else if (marksInt <= 70) {
        grade = "P";
        gradePCount++;
      } else if (marksInt <= 80) {
        grade = "C";
        gradeCCount++;
      } else if (marksInt <= 90) {
        grade = "D";
        gradeDCount++;
      } else {
        grade = "HD";
        gradeHDCount++;
      }
      let studentObject = { name: name, marks: marksInt, grade: grade };
      if (studentObject.marks > bestStudentObject.marks) {
        bestStudentObject = studentObject;
      }
      resultsArray.push(studentObject);
      readName();
    });
  });
}

readName();


rl.on("close", () => {
  console.log("Bye!");
  process.exit(0);
});
