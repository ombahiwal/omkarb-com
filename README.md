# Omkar Bahiwal — Portfolio

A Swiss-modernist portfolio built with Vite + React, tailored for Netlify deployments and populated with CV-driven content.

## 🚀 Quickstart

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and iterate.

## 🧱 Tech Stack

- Vite + React 18
- PropTypes for runtime prop contracts
- Custom CSS grid inspired by Extraset's Klarheit Grotesk specimen system
- Self-hosted ES Klarheit Grotesk and Grotesk Mono font files

## 📦 Deploying to Netlify

1. Push this repository to GitHub (or connect directly in Netlify).
2. In Netlify, set the build command to `npm run build` and publish directory to `dist` (already captured in `netlify.toml`).
3. Trigger deploy — Netlify will install dependencies, run the build, and host from `dist`.

## 🗂️ Structure

- `src/data/profile.js` — single source of truth for CV content.
- `src/components/` — layout primitives (hero, timeline, stacks, etc.).
- `public/documents/Omkar_Bahiwal_CV.pdf` — downloadable CV asset.

Feel free to extend sections or wire a CMS by swapping `profile.js` with an API call.

## Font License

The ES Klarheit files in `public/fonts/` are trial files licensed for personal use. The accompanying terms are stored at `public/fonts/LICENSE.txt`; replace them with appropriately licensed production webfonts before commercial use.

## 📣 Social Sharing

- `netlify/functions/share-card.js` renders a 1200×630 PNG on-demand via Resvg. The `<meta property="og:image">` tag points at this endpoint so social networks fetch fresh artwork whenever `omkarb.com` links are shared.
- Pass `?focus=1` (or any summary index) to emphasize a different summary line: `https://omkarb.com/.netlify/functions/share-card?focus=1`.
- Update `index.html` if you deploy under a different domain so the `og:url` and image URLs stay accurate.
