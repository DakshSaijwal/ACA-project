// qr.js — QR Decoder
// Responsibility: turn an image file into the raw string encoded in its QR code.
// Knows nothing about roll numbers, attendance, or Telegram. Pixels in, string out.

const { Jimp } = require('jimp');
const jsQR = require('jsqr');

/**
 * Decode the QR code in an image file.
 * @param {string} imagePath - path to a local image file
 * @returns {Promise<string>} the raw string encoded in the QR code
 * @throws {Error} 'No QR code found' if the image has no readable QR code
 */
async function decodeQR(imagePath) {
  const image = await Jimp.read(imagePath);
  const { data, width, height } = image.bitmap;

  // jsQR wants a Uint8ClampedArray of RGBA pixels. Jimp's bitmap.data is a
  // Buffer in exactly that RGBA layout, so we wrap it without copying.
  const result = jsQR(new Uint8ClampedArray(data), width, height);

  if (result === null) {
    throw new Error('No QR code found');
  }

  return result.data;
}

module.exports = { decodeQR };

// Standalone test: `node qr.js ./test.jpg`
// Only runs when this file is executed directly, not when required by bot.js.
if (require.main === module) {
  const testPath = process.argv[2] || './test.jpg';
  decodeQR(testPath)
    .then((data) => console.log('Decoded:', data))
    .catch((err) => console.error('Error:', err.message));
}
