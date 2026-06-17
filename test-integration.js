// test-integration.js — test helper (not part of the submission requirement)
// Runs the whole pipeline locally without Telegram:
//   decodeQR -> extractRollNumber -> isRegistered -> markPresent -> getStats
//
// Usage (after `node generate-qr.js` has created test.png):
//   node test-integration.js

const { decodeQR } = require('./qr');
const { extractRollNumber, isRegistered } = require('./parser');
const { markPresent, getStats } = require('./attendance');

(async () => {
  try {
    console.log('1. Decoding QR from test.png...');
    const qrString = await decodeQR('./test.png');
    console.log('   Decoded:', qrString.substring(0, 20) + '...');

    console.log('2. Extracting roll number...');
    const rollNumber = extractRollNumber(qrString);
    console.log('   Roll number:', rollNumber);

    console.log('3. Checking if registered...');
    console.log('   Registered:', isRegistered(rollNumber));

    console.log('4. Marking present...');
    const result = markPresent(rollNumber);
    console.log('   Result:', result.success ? 'SUCCESS' : result.reason);

    console.log('5. Getting stats...');
    const stats = getStats();
    console.log('   Total present:', stats.total);
    console.log('   Roll numbers:', stats.rollNumbers);

    console.log('\nAll pipeline steps passed.');
  } catch (err) {
    console.error('Test failed:', err.message);
    process.exit(1);
  }
})();
