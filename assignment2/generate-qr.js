// generate-qr.js — test helper (not part of the submission requirement)
// Generates test.png from the real IITK ID card string so you can test the
// decoder and the photo handler without needing a physical card.
//
// Usage:
//   npm install qrcode --save-dev
//   node generate-qr.js
//
// Then send test.png to your bot, or run: node qr.js ./test.png

const QRCode = require('qrcode');

const raw =
  '02.240318,1,MEYCIQDAte+CzaUO/q69liphct+MYL6qhHQYEUI1TxDrYOWTIwIhAPwpqP919eO7lV/nLtJSiorf8Q0QoP22JPewKMDVRaqE.iitkidcard';

QRCode.toFile('./test.png', raw, { width: 400 }, (err) => {
  if (err) {
    console.error('Error generating QR:', err);
    process.exit(1);
  }
  console.log('test.png generated');
});
