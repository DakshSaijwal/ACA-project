// bot.js — Telegram bot (the I/O layer)
// Responsibility: talk to Telegram, download photos, and compose the other
// modules. All real logic lives in qr.js / parser.js / attendance.js. This
// file only orchestrates and replies.

require('dotenv').config();

const fs = require('fs');
const os = require('os');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

const { decodeQR } = require('./qr');
const { extractRollNumber, isRegistered } = require('./parser');
const { markPresent, getStats, getRecords } = require('./attendance');

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('BOT_TOKEN is missing. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// ── /start ──────────────────────────────────────────────────────────────────
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    'QR Attendance Bot is running.\n\n' +
      'Send a photo of an IITK ID card to mark attendance.\n' +
      '/report — current attendance stats\n' +
      '/export — download attendance as CSV'
  );
});

// ── Photo handler ─────────────────────────────────────────────────────────────
// Take the highest-res photo, download it, run it through the pipeline:
//   decodeQR -> extractRollNumber -> isRegistered -> markPresent
// Every failure mode gets its own distinct reply.
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  let downloadedPath = null;

  try {
    // msg.photo is an array of sizes; the last one is the highest resolution.
    const fileId = msg.photo[msg.photo.length - 1].file_id;

    // Telegram gives us a file_id, not the image. Download it to a temp file.
    downloadedPath = await bot.downloadFile(fileId, os.tmpdir());

    const qrString = await decodeQR(downloadedPath);

    const rollNumber = extractRollNumber(qrString);
    if (rollNumber === null) {
      // We decoded a QR, but found no 6-digit value in the registered range.
      await bot.sendMessage(
        chatId,
        'Could not find a registered roll number in that QR code.'
      );
      return;
    }

    // extractRollNumber already range-checked, but we re-assert the contract
    // explicitly so the "out of range" path is visible and testable.
    if (!isRegistered(rollNumber)) {
      await bot.sendMessage(
        chatId,
        `Roll number ${rollNumber} is not in the registered range (240001–240400).`
      );
      return;
    }

    const result = markPresent(rollNumber);
    if (result.success) {
      await bot.sendMessage(chatId, `✅ ${rollNumber} marked present.`);
    } else if (result.reason === 'already_marked') {
      await bot.sendMessage(
        chatId,
        `⚠️ ${rollNumber} was already marked present at ${result.timestamp}.`
      );
    } else {
      await bot.sendMessage(chatId, `Could not mark ${rollNumber} present.`);
    }
  } catch (err) {
    if (err.message === 'No QR code found') {
      await bot.sendMessage(chatId, 'No QR code found in that image. Try a clearer photo.');
    } else {
      console.error('Photo handler error:', err);
      await bot.sendMessage(chatId, 'Something went wrong processing that image.');
    }
  } finally {
    // Clean up the temp image regardless of outcome.
    if (downloadedPath) {
      fs.unlink(downloadedPath, () => {});
    }
  }
});

// ── /report ─────────────────────────────────────────────────────────────────
bot.onText(/\/report/, (msg) => {
  const { total, rollNumbers } = getStats();
  const list = total > 0 ? rollNumbers.join('\n') : '(none yet)';
  bot.sendMessage(msg.chat.id, `Attendance report\nTotal present: ${total}\n\n${list}`);
});

// ── /export (bonus) ───────────────────────────────────────────────────────────
// Build a CSV by hand (no library), write to a temp file, send as a document.
bot.onText(/\/export/, async (msg) => {
  const chatId = msg.chat.id;
  let csvPath = null;

  try {
    const records = getRecords(); // [[roll, timestamp], ...]
    const rows = [['RollNumber', 'Timestamp'], ...records];
    const csv = rows.map((r) => r.join(',')).join('\n');

    csvPath = path.join(os.tmpdir(), `attendance_${Date.now()}.csv`);
    fs.writeFileSync(csvPath, csv);

    await bot.sendDocument(chatId, csvPath);
  } catch (err) {
    console.error('Export error:', err);
    await bot.sendMessage(chatId, 'Could not generate the CSV export.');
  } finally {
    if (csvPath) {
      fs.unlink(csvPath, () => {});
    }
  }
});

console.log('Bot is running in polling mode...');
