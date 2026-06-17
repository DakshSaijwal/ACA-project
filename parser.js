// parser.js — Roll number parser
// Responsibility: pull a registered roll number out of a raw QR string.
// Pure logic. No file I/O, no network, no Telegram. Easy to unit-test.

// ── RAW IITK ID CARD QR STRING (mandatory documentation) ────────────────────
// This is the actual string decoded from a real IITK ID card QR code:
//
//   02.240318,1,MEYCIQDAte+CzaUO/q69liphct+MYL6qhHQYEUI1TxDrYOWTIwIhAPwpqP919eO7lV/nLtJSiorf8Q0QoP22JPewKMDVRaqE.iitkidcard
//
// Structure (fields separated by commas):
//   [0] "02.240318"  ->  prefix "02." followed by the ROLL NUMBER (240318)
//   [1] "1"          ->  a version/flag field
//   [2] "MEYC...RaqE.iitkidcard"  ->  a base64-encoded ECDSA signature, then a ".iitkidcard" suffix
//
// IMPORTANT: the roll number is the 6-digit chunk after "02." at the start.
// The signature blob in field [2] also contains stray digits, so we cannot
// blindly grab the first 6-digit run — we must collect ALL 6-digit sequences
// and pick the one that falls inside the registered range. That range check
// is what rejects accidental matches from the signature.
// ────────────────────────────────────────────────────────────────────────────

const MIN_ROLL = 240001;
const MAX_ROLL = 240400;

/**
 * Extract the first registered roll number from a raw QR string.
 * @param {string} qrString
 * @returns {string|null} the roll number as a string, or null if none is valid
 */
function extractRollNumber(qrString) {
  // Match every run of exactly 6 digits. Word boundaries (\b) stop us from
  // slicing a 6-digit window out of a longer digit run.
  const candidates = qrString.match(/\b\d{6}\b/g);

  if (!candidates) {
    return null;
  }

  // Return the first candidate that is a registered roll number.
  const match = candidates.find((c) => isRegistered(c));
  return match || null;
}

/**
 * Is this roll number in the registered range (240001–240400 inclusive)?
 * @param {string|number} rollNumber
 * @returns {boolean}
 */
function isRegistered(rollNumber) {
  const n = Number(rollNumber);
  return n >= MIN_ROLL && n <= MAX_ROLL;
}

module.exports = { extractRollNumber, isRegistered };

// Standalone test: `node parser.js`
if (require.main === module) {
  const raw =
    '02.240318,1,MEYCIQDAte+CzaUO/q69liphct+MYL6qhHQYEUI1TxDrYOWTIwIhAPwpqP919eO7lV/nLtJSiorf8Q0QoP22JPewKMDVRaqE.iitkidcard';

  console.log('extractRollNumber(raw):', extractRollNumber(raw)); // 240318
  console.log('extractRollNumber("no numbers here"):', extractRollNumber('no numbers here')); // null
  console.log('extractRollNumber("roll 999999"):', extractRollNumber('roll 999999')); // null (out of range)
  console.log('isRegistered("240318"):', isRegistered('240318')); // true
  console.log('isRegistered("240001"):', isRegistered('240001')); // true (boundary)
  console.log('isRegistered("240400"):', isRegistered('240400')); // true (boundary)
  console.log('isRegistered("240401"):', isRegistered('240401')); // false
  console.log('isRegistered("123456"):', isRegistered('123456')); // false
}
