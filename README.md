# JS-A2 — QR Code Attendance Bot

A Telegram bot that reads IITK ID card QR codes from photos and maintains an attendance register. Built for the JS-A2 assignment.

---

## How It Works

A volunteer sends a photo of an IITK ID card to the bot. The bot decodes the QR code, extracts the roll number, checks that it falls in the registered range (240001–240400), and marks it present in a local JSON store. Duplicate scans are detected and reported. A `/report` command shows live statistics and `/export` sends a CSV of all records.

---

## Project Structure

```
assignment2/
├── bot.js           # Telegram I/O layer — orchestrates everything
├── qr.js            # Decodes a QR code from an image file (Jimp + jsQR)
├── parser.js        # Extracts a registered roll number from a QR string
├── attendance.js    # Reads/writes attendance.json (the persistent store)
├── package.json
├── .env.example     # Copy this to .env and fill in your bot token
├── .gitignore
├── generate-qr.js   # Test helper — generates test.png from the real ID string
└── test-integration.js  # Test helper — runs the full pipeline without Telegram
```

Each module has a single responsibility. `bot.js` is the only file that knows about Telegram. The others are pure logic that can be unit-tested independently.

---

## Prerequisites

- **Node.js v18 or higher** — check with `node --version`
- A **Telegram account**
- A **Telegram bot token** — get one from @BotFather (see step 1 below)

---

## Setup

### Step 1 — Create a Telegram bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Choose a name (e.g. `IITK Attendance`) and a username ending in `bot` (e.g. `myattendance_bot`)
4. BotFather replies with a token that looks like `123456789:ABCDefGhijKlmNoPQRstUVwXyz`
5. Copy that token — you will need it in step 3

### Step 2 — Install dependencies

In the project folder, run:

```bash
npm install
```

> **Note:** `node-telegram-bot-api` is pinned to version `0.66.0` in `package.json`. Do **not** upgrade it. Version 1.x is a breaking TypeScript rewrite with an incompatible API — `bot.on()`, `bot.downloadFile()`, and CommonJS `require()` all break on the newer version.

### Step 3 — Configure the bot token

Copy the example env file:

```bash
# Windows
copy .env.example .env

# Mac / Linux
cp .env.example .env
```

Open `.env` in any text editor and replace `your_token_here` with the token from BotFather:

```
BOT_TOKEN=123456789:ABCDefGhijKlmNoPQRstUVwXyz
```

Save the file. Do not add quotes around the token.

### Step 4 — Start the bot

```bash
npm start
```

You should see:

```
Bot is running in polling mode...
```

Leave this terminal window open. The bot stops when you close it or press Ctrl+C.

---

## Testing

### Quick module tests (no Telegram needed)

Test the parser logic:

```bash
node parser.js
```

Expected output — all assertions passing:

```
extractRollNumber(raw): 240318
extractRollNumber("no numbers here"): null
extractRollNumber("roll 999999"): null
isRegistered("240318"): true
isRegistered("240001"): true
isRegistered("240400"): true
isRegistered("240401"): false
isRegistered("123456"): false
```

### Full pipeline test (no Telegram needed)

First generate a test QR image from the real ID card string:

```bash
npm install qrcode --save-dev
node generate-qr.js
```

This creates `test.png`. Then run the full pipeline against it:

```bash
node test-integration.js
```

Expected output:

```
1. Decoding QR from test.png...
   Decoded: 02.240318,1,MEYCIQDA...
2. Extracting roll number...
   Roll number: 240318
3. Checking if registered...
   Registered: true
4. Marking present...
   Result: SUCCESS
5. Getting stats...
   Total present: 1
   Roll numbers: [ '240318' ]

All pipeline steps passed.
```

Also test the QR decoder directly:

```bash
node qr.js ./test.png
```

### Live Telegram test

With the bot running (`npm start`), open your bot in Telegram and work through this sequence:

| Action | Expected bot reply |
|---|---|
| `/start` | Welcome message with command list |
| `/report` | `Total present: 0` |
| Send `test.png` as a **photo** | `✅ 240318 marked present.` |
| Send the same photo again | `⚠️ 240318 was already marked present at <timestamp>` |
| `/report` | Total 1, lists `240318` |
| `/export` | Bot sends a `.csv` file |

> **Important:** Send the image as a **photo** (tap the paperclip / image icon), not as a file. Telegram compresses photos differently from documents and the bot's `photo` handler only fires on photo messages.

---

## The IITK QR Code Format

The QR code on an IITK ID card encodes a string with this structure:

```
02.240318,1,MEYCIQDAte+CzaUO/q69liphct+MYL6qhHQYEUI1TxDrYOWTIwIhAPwpqP919eO7lV/nLtJSiorf8Q0QoP22JPewKMDVRaqE.iitkidcard
```

| Field | Value | Meaning |
|---|---|---|
| `[0]` | `02.240318` | Prefix `02.` followed by the **roll number** |
| `[1]` | `1` | Version / flag |
| `[2]` | `MEYC...RaqE.iitkidcard` | Base64-encoded ECDSA signature + `.iitkidcard` suffix |

The signature field in `[2]` contains stray digit sequences that look like roll numbers. This is why `parser.js` collects **all** 6-digit sequences and picks the first one that falls in the registered range (240001–240400), rather than grabbing the first 6-digit match blindly. The range check is the filter.

---

## Attendance Data

Attendance is stored in `attendance.json` in the project folder, created automatically on the first mark. It is a plain JSON object mapping roll numbers to ISO timestamps:

```json
{
  "240318": "2026-06-17T12:34:56.789Z"
}
```

This file is git-ignored and excluded from the submission. Delete it between test runs if you want to start fresh.

---

## Common Problems

**`BOT_TOKEN is missing` on startup**
You haven't created `.env`, or the file is in the wrong folder. The `.env` file must be in the same directory as `bot.js`. Make sure it contains `BOT_TOKEN=<your token>` with no extra spaces or quotes.

**Bot starts but doesn't respond in Telegram**
Only one process can poll a bot at a time. If you ran `npm start` in two terminals, or if a previous run is still active, the second one won't receive messages. Kill all instances (Ctrl+C in every terminal) and restart once.

**`Cannot find module 'node-telegram-bot-api'`**
Run `npm install` first.

**`Error: No QR code found`**
The image is blurry, too dark, or the QR is partially cropped. Use a well-lit, straight-on photo. The test image from `node generate-qr.js` always works.

**`npm install` fails on Windows with permission errors**
Run the terminal as Administrator, or use a path without spaces.

**Bot marks someone present but the CSV is empty**
Run `/export` after at least one successful mark. If `attendance.json` was deleted between test runs, the store is empty.

**Multi-line `node -e` commands don't work on Windows cmd.exe**
Use `.js` files instead — all test commands in this project are single-line `node file.js` calls that work on any platform.

---

## Cleanup Before Submitting

Delete local test artifacts — they are git-ignored but still worth removing manually:

```bash
# Windows
del test.png attendance.json

# Mac / Linux
rm test.png attendance.json
```

Do not commit `node_modules/`, `.env`, or `attendance.json`. The `.gitignore` already excludes all three.

---

## Files to Submit

| Include | Exclude |
|---|---|
| `bot.js` | `node_modules/` |
| `qr.js` | `.env` |
| `parser.js` | `attendance.json` |
| `attendance.js` | `test.png` |
| `package.json` | |
| `.env.example` | |
| `.gitignore` | |
| `README.md` | |
| `generate-qr.js` | |
| `test-integration.js` | |
