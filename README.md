<h1 align="center">NumConv</h1>

<p align="center">
  Number system converter for decimal, binary, hexadecimal and octal — with step-by-step breakdowns, reference tables and a quiz.<br>By AkihiroLabs.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-1E3A8A" alt="version 1.0.0">
  <img src="https://img.shields.io/badge/vanilla-JavaScript-00A8CC" alt="Vanilla JS">
  <img src="https://img.shields.io/badge/no-dependencies-1E3A8A" alt="No dependencies">
</p>

---

## ✨ Features

- **Live converter** — type in decimal, binary, hex or octal — every other field updates instantly
- **Bit visualizer** — see each bit of the number
- **Step-by-step breakdown** — how the conversion is worked out
- **Reference table** — 0–255 in every base, with a filter
- **ASCII table** — click a character to load it into the converter
- **Quiz** — practice conversions with score and streak tracking
- **History** — your recent conversions
- **Quick tools** — copy one value or all, random number, examples and clear

## 🚀 Getting started

No build step is needed.

1. Download or clone this repository.
2. Open `index.html` in any modern browser.

Live: **https://akihirozayar.github.io/numconv/**

## 📁 Project structure

```
numconv/
├── index.html        # Page markup — links the CSS and JS
├── css/
│   └── style.css     # Styles
├── js/
│   ├── version.js    # APP_VERSION
│   └── app.js        # Converter, tables, quiz, history
├── CHANGELOG.md
└── README.md
```

## 🛠 Tech

- Vanilla JavaScript, HTML and CSS — no frameworks, no build tools
- Google Fonts (DM Sans, DM Mono, Space Grotesk)

## 🔖 Versioning

This project uses [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`).

- The version lives in **`js/version.js`** (`APP_VERSION`).
- To release: bump the version, add an entry to [`CHANGELOG.md`](CHANGELOG.md), then create a GitHub Release tagged `vX.Y.Z`.

Current version: **v1.0.0** — see the [changelog](CHANGELOG.md).

## 💬 Community

Updates and feedback on the **AkihiroLabs Discord server**.

---

<p align="center">
  Built with 🦝 by <b>AkihiroLabs</b>
</p>
