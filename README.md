# 台灣華語 · Taiwan Mandarin

A free web app for learning the Mandarin spoken in Taiwan: traditional characters, Taiwan vocabulary and pronunciation, zhuyin and pinyin, TOCFL levels. It installs on phones from the browser and works offline.

## What's inside

| File | What it is |
|---|---|
| `index.html` | Home screen: continue learning, sections, display settings, install tip |
| `lessons.html` | Onboarding, placement test, Lessons 1–2, writing practice |
| `stories.html` | Graded stories (Levels 1–5) with tap-to-translate and read-aloud |
| `saved.html` | Saved Words from lessons and stories, with flashcard review |
| `shared/app.js` | Shared settings, Saved Words, pinyin/zhuyin, Taiwan voice, offline setup |
| `shared/app.css` | Shared colours and styles |
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
- `tw.level`, `tw.bg`, `tw.lessons`: level, background and lesson progress

## Updating the app

Replace the changed files on GitHub. If you add or rename a file, add it to the list at the top of `sw.js` and change `tw-v1` to `tw-v2` so phones pick up the new version.
