// attendance.js — Attendance store
// Responsibility: persist who has been marked present, to attendance.json.
// Knows nothing about QR codes or Telegram. Roll numbers in, records out.

const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, 'attendance.json');

// Load the store once, when this module is first required. If the file doesn't
// exist yet (or is unreadable/corrupt), start with an empty object.
let store = {};
try {
  store = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
} catch (err) {
  store = {};
}

function save() {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

/**
 * Mark a roll number present.
 * @param {string} rollNumber
 * @returns {{success: true} | {success: false, reason: string, timestamp: string}}
 */
function markPresent(rollNumber) {
  if (Object.prototype.hasOwnProperty.call(store, rollNumber)) {
    return {
      success: false,
      reason: 'already_marked',
      timestamp: store[rollNumber],
    };
  }

  store[rollNumber] = new Date().toISOString();
  save();
  return { success: true };
}

/**
 * Current attendance statistics.
 * @returns {{total: number, rollNumbers: string[]}} rollNumbers sorted ascending
 */
function getStats() {
  const rollNumbers = Object.keys(store).sort();
  return {
    total: rollNumbers.length,
    rollNumbers,
  };
}

/**
 * Every record as [rollNumber, timestamp] pairs, sorted by roll number.
 * Used by the CSV export. Returned sorted so the CSV is deterministic.
 * @returns {Array<[string, string]>}
 */
function getRecords() {
  return Object.keys(store)
    .sort()
    .map((roll) => [roll, store[roll]]);
}

module.exports = { markPresent, getStats, getRecords };
