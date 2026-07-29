# BachhaFlix ❤️

A Netflix-inspired birthday website where every movie is a photo of your girlfriend.

---

## Adding Photos

Drop your photos into the `assets/photos/` folder:

```
assets/
  photos/
    img001.jpg
    img002.jpg
    ...
```

**That's it.** No JSON, no metadata, no CSV. The build automatically discovers them.

---

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173/BachhaFlix/

---

## Build for Production

```bash
npm run build
```

This generates the `dist/` folder with all assets included.

---

## Deploy to GitHub Pages

### One-time setup

1. Create a GitHub repository (e.g., `BachhaFlix`)
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial BachhaFlix commit"
   git remote add origin https://github.com/YOUR_USERNAME/BachhaFlix.git
   git push -u origin main
   ```
3. In your repo settings → Pages → set Source to **Deploy from a branch** → `gh-pages`

### Every time you want to deploy

```bash
npm run deploy
```

This runs the build and pushes `dist/` to the `gh-pages` branch automatically.

Your site will be live at:
```
https://YOUR_USERNAME.github.io/BachhaFlix/
```

---

## Configuring the GitHub Repo Name

If your repository is **not** named `BachhaFlix`, update `vite.config.js`:

```js
base: '/your-repo-name/',  // ← change this
```

---

## Personalising

### Timeline

Edit `src/data/timeline.js` to add real dates and memories.

### Daily Rituals

Edit `src/data/dailyRituals.js` to change the interactive ritual cards.

### Categories & Captions

Edit `src/data/categories.js` to add more caption pools.

---

## Tech Stack

- **Vite** — build tool
- **Vanilla JS (ES Modules)** — no framework
- **Plain CSS + CSS Variables** — no Tailwind
- **canvas-confetti** — birthday confetti
- **gh-pages** — GitHub Pages deployment

---

Made with ❤️
