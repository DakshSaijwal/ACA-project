// Student Report Card System
// Grade Scale:
// A: 90-100
// B: 80-89
// C: 70-79
// D: 60-69
// F: below 60

class Student {
  constructor(name, scores) {
    this.name = name;
    this.scores = scores;
  }

  // P1b: Return the mean of all scores using a loop
  get average() {
    let total = 0;
    for (let i = 0; i < this.scores.length; i++) {
      total += this.scores[i];
    }
    return total / this.scores.length;
  }

  // P1c: Return A/B/C/D/F based on average
  get letterGrade() {
    const avg = this.average;
    if (avg >= 90) return 'A';
    else if (avg >= 80) return 'B';
    else if (avg >= 70) return 'C';
    else if (avg >= 60) return 'D';
    else return 'F';
  }

  // P1d: Return { highest, lowest } — find them with a loop (no Math.max/min)
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

// P3b: Switch-based getRemark function
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

// P2a: Parse argv — name from argv[2], scores from argv[3+]
const args = process.argv;
const name = args[2];
const scores = args.slice(3).map(Number);

// P2b: Validate — less than 3 scores → error + exit
if (!name || scores.length < 3) {
  console.error('Usage: node reportCard.js "StudentName" score1 score2 score3 [...]');
  console.error('Error: Please provide a student name and at least 3 exam scores.');
  process.exit(1);
}

// Create student instance
const student = new Student(name, scores);

const avg = student.average;
const grade = student.letterGrade;
const { highest, lowest } = student.summary();
const passFail = avg >= 60 ? 'PASS' : 'FAIL';
const remark = getRemark(grade);

// P3c: Destructure into score1, score2, ...remaining
const [score1, score2, ...remaining] = student.scores;

// P3a: Formatted report card — template literals only, no string concatenation with +
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
=====================================
`);
