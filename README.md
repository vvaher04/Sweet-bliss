# 🎂 Crumble & Co. — Artisan Cake Shop

A fully static, responsive e-commerce site for artisan cakes. No backend, no database, no login required.

## Features

- 🎂 8 artisan cake listings loaded from `products.json`
- 🛒 Add to cart with quantity controls
- 📦 Delivery details form with validation
- 💵 Cash on Delivery only (no payment gateway needed)
- 📱 Fully responsive (mobile, tablet, desktop)
- ✅ Order confirmation screen with a unique reference number

## Project Structure

```
cakeshop/
├── index.html       ← Main page
├── style.css        ← All styles
├── app.js           ← Cart & order logic
├── products.json    ← Product data (edit to add/remove cakes)
└── README.md
```

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g., `cakeshop`)
2. Upload all 4 files (`index.html`, `style.css`, `app.js`, `products.json`) to the repo
3. Go to **Settings → Pages**
4. Under **Source**, select `Deploy from a branch` → `main` → `/ (root)`
5. Click **Save**
6. Your site will be live at `https://<your-username>.github.io/<repo-name>/`

> ⚠️ Make sure all 4 files are in the **root** of the repository (not in a subfolder) for the paths to work correctly.

## Customising Products

Edit `products.json` to change cakes. Each object supports:

```json
{
  "id": 9,
  "name": "Your Cake Name",
  "description": "Short description.",
  "price": 35.00,
  "image": "https://your-image-url.jpg",
  "tag": "New"   ← optional badge (leave "" to hide)
}
```

## Tech Stack

- Plain HTML5, CSS3, Vanilla JavaScript (ES6+)
- Google Fonts (Playfair Display + DM Sans)
- Unsplash images (no API key needed)
- Zero dependencies — works offline after first load
