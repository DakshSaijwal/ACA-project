# Student Report Card System

A Node.js CLI program that generates student report cards with grades, averages, and performance summaries.

## Files

- **reportCard.js** - Main CLI program for single student reports
- **multiStudent.js** - Bonus feature: process multiple students from JSON
- **students.json** - Sample student data for bonus mode

## How to Run

### Single Student Mode
```bash
node reportCard.js "StudentName" 85 90 78
```

**Requirements:** Student name + at least 3 exam scores

### Multi-Student Mode (Bonus)
```bash
node multiStudent.js students.json
```

## Features

- ✅ Student class with average calculation, letter grades, high/low scores
- ✅ CLI argument parsing with validation
- ✅ Formatted report card output
- ✅ PASS/FAIL status and remarks
- ✅ Bonus: Multi-student JSON processing and top performer identification

## Grade Scale

- A: 90-100 → "Outstanding"
- B: 80-89 → "Good work"
- C: 70-79 → "Satisfactory"
- D: 60-69 → "Needs improvement"
- F: <60 → "Failed — please seek help"

## Examples

```bash
# Passing student
node reportCard.js "Alice Johnson" 92 95 88 91

# Failing student
node reportCard.js "Bob Smith" 45 52 38

# Multiple students
node multiStudent.js students.json
```
