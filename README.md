# 台灣華語 · Taiwan Mandarin

A free web app for learning the Mandarin spoken in Taiwan: traditional characters, Taiwan vocabulary and pronunciation, zhuyin and pinyin, TOCFL levels. It installs on phones from the browser and works offline.

## What's inside

| File | What it is |
|---|---|
| `index.html` | The app: onboarding, placement test, lessons, Practice (review, flashcards, match), Saved words, Stories list, Daily Life role-plays, settings |
| `stories.html` | The story reader: graded stories with tap-to-translate and read-aloud |
| `lessons.html`, `saved.html` | Old addresses from version 1; they forward to the app |
| `shared/app.js` | Shared settings, Saved Words, theme, Taiwan voice, offline setup |
| `sw.js` | Makes the app work offline |
| `manifest.webmanifest` | App name, icon and colours for installing on a phone |
| `icons/` | App icons (the 石虎 leopard-cat mascot) |
| `vendor/hanzi-writer.min.js` | Hanzi Writer 3.7.3 (MIT licence) for stroke-order writing |

## Settings shared across the app

Everything is stored on the device (browser localStorage, keys starting with `tw.`):

- `tw.mode2`: reading aids (`py` pinyin, `zy` zhuyin, `all` both, `hz` characters only)
- `tw.theme`: `auto`, `light` or `dark`
- `tw.rate`: voice speed
- `tw.saved`: Saved Words, one list for lessons and stories
- `tw.level`, `tw.bg`, `tw.lessons`, `tw.partial`: level, background and lesson progress
- `tw.mem`, `tw.best`, `tw.fcfront`, `tw.sfx`: practice memory, match records, flashcard side, sound effects

## Updating the app

Replace the changed files on GitHub. If you add or rename a file, add it to the list at the top of `sw.js` and raise the version number (currently `tw-v2`) so phones pick up the new version.
