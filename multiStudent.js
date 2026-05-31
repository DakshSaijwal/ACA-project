// BONUS: Multi-student mode
// Reads a .json file via fs.readFileSync, prints report cards for all students
// + identifies the top performer.

const fs = require('fs');

// Same Student class as in reportCard.js
class Student {
  constructor(name, scores) {
    this.name = name;
    this.scores = scores;
  }

  get average() {
    let total = 0;
    for (let i = 0; i < this.scores.length; i++) {
      total += this.scores[i];
    }
    return total / this.scores.length;
  }

  get letterGrade() {
    const avg = this.average;
    if (avg >= 90) return 'A';
    else if (avg >= 80) return 'B';
    else if (avg >= 70) return 'C';
    else if (avg >= 60) return 'D';
    else return 'F';
  }

  summary() {
    let highest = this.scores[0];
    let lowest = this.scores[0];
    for (let i = 1; i < this.scores.length; i++) {
      if (this.scores[i] > highest) highest = this.scores[i];
      if (this.scores[i] < lowest) lowest = this.scores[i];
    }
    return { highest, lowest };
  }
}

function getRemark(grade) {
  switch (grade) {
    case 'A': return 'Outstanding';
    case 'B': return 'Good work';
    case 'C': return 'Satisfactory';
    case 'D': return 'Needs improvement';
    case 'F': return 'Failed — please seek help';
    default: return 'Unknown grade';
  }
}

// Get JSON file path from argv
const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node multiStudent.js students.json');
  process.exit(1);
}

// Read and parse the JSON file
const raw = fs.readFileSync(filePath, 'utf-8');
const studentsData = JSON.parse(raw);

const students = studentsData.map(d => new Student(d.name, d.scores));

// Print report card for each student
for (const student of students) {
  const avg = student.average;
  const grade = student.letterGrade;
  const { highest, lowest } = student.summary();
  const passFail = avg >= 60 ? 'PASS' : 'FAIL';
  const remark = getRemark(grade);
  const [score1, score2, ...remaining] = student.scores;

  console.log(`
=====================================
        STUDENT REPORT CARD
=====================================
Name    : ${student.name}
-------------------------------------
Scores
  Exam 1  : ${score1}
  Exam 2  : ${score2}${remaining.length > 0 ? `
  Others  : ${remaining.join(', ')}` : ''}
-------------------------------------
Average : ${avg.toFixed(1)}
Grade   : ${grade}
Status  : ${passFail}
Remark  : ${remark}
-------------------------------------
Highest Score : ${highest}
Lowest Score  : ${lowest}
=====================================`);
}

// Identify the top performer
let topStudent = students[0];
for (let i = 1; i < students.length; i++) {
  if (students[i].average > topStudent.average) {
    topStudent = students[i];
  }
}

console.log(`
*************************************
  TOP PERFORMER: ${topStudent.name}
  Average: ${topStudent.average.toFixed(1)} | Grade: ${topStudent.letterGrade}
*************************************
`);
