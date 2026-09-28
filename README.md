# 台灣華語 · Taiwan Mandarin

A free web app for learning the Mandarin spoken in Taiwan: traditional characters, Taiwan vocabulary and pronunciation, zhuyin and pinyin, TOCFL levels. It installs on phones from the browser and works offline.

## What's inside

| File | What it is |
|---|---|
| `index.html` | The whole app: onboarding, placement test, lessons, Practice (review, flashcards, match, Saved words), Stories with read-aloud, Daily Life role-plays, Me (progress, goal), settings, backup and restore |
| `stories.html`, `lessons.html`, `saved.html` | Old addresses from earlier versions; they forward into the app (`stories.html#friend` opens that story) |
| `shared/app.js` | Theme (Auto, Light, Dark) and offline setup |
| `sw.js` | Makes the app work offline |
| `manifest.webmanifest` | App name, icon and colours for installing on a phone |
| `icons/` | App icons (the 石虎 leopard-cat mascot) |
| `vendor/hanzi-writer.min.js` | Hanzi Writer 3.7.3 (MIT licence) for stroke-order writing |

## Where progress is kept

Everything is stored in the browser on each device (keys starting with `tw.`). Use Settings › Backup and restore to save a backup file or move progress to another phone. The theme choice is kept under `tw.theme`.

## Updating the app

Replace the changed files on GitHub. If you add or rename a file, add it to the list at the top of `sw.js` and raise the version number (currently `tw-v5`) so phones pick up the new version.
