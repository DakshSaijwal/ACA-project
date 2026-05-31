# GitHub Submission Guide

Follow these steps to submit your assignment to GitHub:

## Step 1: Create GitHub Repository

1. Go to **github.com** and sign in
2. Click the **"+"** icon (top right) → **New repository**
3. **Repository name:** `ACA-project`
4. Add description: "Student Report Card System - Node.js CLI"
5. Choose **Public** or **Private** (check your course requirements)
6. **DO NOT** initialize with README (you'll push your own)
7. Click **Create repository**

---

## Step 2: Set Up Local Project (on your computer)

### Open Terminal/Command Prompt

```bash
# Create the project folder structure
mkdir ACA-project
cd ACA-project

# Create the assignment1 subfolder
mkdir assignment1
cd assignment1
```

### Copy Your Files

Move these files into the `assignment1` folder:
- `reportCard.js`
- `multiStudent.js` (bonus)
- `students.json` (bonus)
- `.gitignore` (copy from outputs)
- `README.md` (copy from outputs)

Your folder structure should look like:
```
ACA-project/
└── assignment1/
    ├── reportCard.js
    ├── multiStudent.js
    ├── students.json
    ├── .gitignore
    └── README.md
```

---

## Step 3: Initialize Git & Connect to GitHub

### In the ACA-project folder (parent), run:

```bash
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Student Report Card System"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ACA-project.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 4: Verify on GitHub

1. Go to **github.com/YOUR_USERNAME/ACA-project**
2. You should see:
   - ✅ `assignment1/` folder
   - ✅ `reportCard.js`
   - ✅ `multiStudent.js`
   - ✅ `students.json`
   - ✅ `.gitignore`
   - ✅ `README.md`

---

## Troubleshooting

### If you get "fatal: not a git repository"
Make sure you're in the `ACA-project` folder (not `assignment1`)

### If git push fails
Check that:
1. You replaced `YOUR_USERNAME` with your actual GitHub username
2. You have internet connection
3. Your GitHub credentials are set up

### To check git status anytime
```bash
git status
```

### To see what files will be ignored
```bash
cat .gitignore
```

---

## What .gitignore Does

The `.gitignore` file tells Git to **NOT upload** these items:
- `node_modules/` ← This would be huge!
- `.env` ← Keeps secrets safe
- Log files
- System files (`.DS_Store`)

**node_modules should NEVER be pushed to GitHub.**

---

## Testing Before Submission

Before pushing, test your code works:

```bash
# From assignment1 folder
node reportCard.js "Test Student" 85 90 78
node multiStudent.js students.json
```

Both should run without errors ✓

---

## Final Checklist

- [ ] GitHub repo created with name `ACA-project`
- [ ] Folder structure: `ACA-project/assignment1/`
- [ ] All files copied to `assignment1/` folder
- [ ] `.gitignore` file created
- [ ] `git init` and `git push` completed
- [ ] Code tested and works
- [ ] Repository visible on GitHub

**You're done! 🎉**

---

## Quick Reference (Copy-Paste)

```bash
# Setup
mkdir ACA-project
cd ACA-project
mkdir assignment1
# (Copy files into assignment1/)

# Push to GitHub
git init
git add .
git commit -m "Initial commit: Student Report Card System"
git remote add origin https://github.com/YOUR_USERNAME/ACA-project.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username!**
