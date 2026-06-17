# Testing guide

Run these on your own machine (Windows `cmd` / PowerShell). Steps 1–4 need no
Telegram bot; step 5 is the live end-to-end test.

## 0. Install

```
npm install
```

## 1. Parser (pure logic, no setup)

```
node parser.js
```

Expect `extractRollNumber(raw)` to print `240318` and the boundary checks
(`240001`, `240400` true; `240401`, `123456` false) to pass.

## 2. Generate a test QR image

```
npm install qrcode --save-dev
node generate-qr.js
```

Creates `test.png` from the real ID string.

## 3. QR decoder

```
node qr.js ./test.png
```

Should print the full decoded string ending in `.iitkidcard`.

## 4. Full pipeline (no Telegram)

```
node test-integration.js
```

Walks decode -> extract -> range check -> mark present -> stats. Ends with
"All pipeline steps passed."

## 5. Live Telegram test

1. Get a token from @BotFather (`/newbot`).
2. Copy `.env.example` to `.env` and put your token in it:
   ```
   copy .env.example .env
   ```
   Then edit `.env` so it reads `BOT_TOKEN=<your token>`.
3. Start the bot:
   ```
   npm start
   ```
   You should see "Bot is running in polling mode...".
4. In Telegram, open your bot and:
   - send `/start` -> welcome message
   - send `/report` -> `Total present: 0`
   - send `test.png` as a photo -> `240318 marked present.`
   - send the same photo again -> "already marked" with a timestamp
   - send `/report` -> total now 1, lists `240318`
   - send `/export` -> bot sends a CSV file

A screenshot of step 5 is good proof the system works end to end.

## Cleanup before submitting

Delete generated/local files so they aren't committed:

```
del test.png attendance.json
```

`node_modules`, `.env`, and `attendance.json` are already in `.gitignore`.
The test helpers (`generate-qr.js`, `test-integration.js`) are optional to keep.
