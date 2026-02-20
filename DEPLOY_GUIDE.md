# 🚀 Budget Pro — Deploy to Friends & Family in 30 Minutes

## What You Have

A complete PWA (Progressive Web App) that:
- Works offline after first load
- Can be "installed" on iPhone home screens (looks like a real app)
- Has a proper app icon, splash screen, and standalone mode
- Auto-updates when you push changes

---

## Step-by-Step: Deploy to Vercel (Free)

### 1. Push to GitHub (~5 min)

```bash
# Navigate to the project
cd budget-app

# Initialize git
git init
git add .
git commit -m "Initial commit — Budget Pro MVP"

# Create repo on GitHub (via github.com/new) then:
git remote add origin https://github.com/YOUR_USERNAME/budget-pro.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel (~3 min)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New → Project"**
3. Import your `budget-pro` repo
4. Vercel auto-detects Vite — just click **"Deploy"**
5. Wait ~30 seconds. Done! You get a URL like `budget-pro-abc123.vercel.app`

**Optional:** Go to Settings → Domains and add a custom domain, or rename to something like `budget-pro.vercel.app`

### 3. Share with Friends & Family (~2 min)

Send them this message:

> 🎉 Hey! I built a budget app and I'd love your feedback.
>
> 👉 Open this link on your iPhone: https://your-app.vercel.app
>
> To install it as an app:
> 1. Tap the Share button (□↑) in Safari
> 2. Scroll down and tap "Add to Home Screen"
> 3. Tap "Add"
>
> It'll look and work like a real app! Let me know what you think 🙏

---

## How iPhone PWA Works

When your friends "Add to Home Screen" from Safari:

✅ Full-screen app (no browser bar)
✅ Custom app icon on home screen  
✅ Dark status bar matching the app theme
✅ Works offline after first load
✅ Feels native — most people can't tell the difference

### Important iOS Notes:
- Must use **Safari** (not Chrome) to add to home screen
- PWA runs in its own standalone window
- Data persists in local storage between sessions
- No push notifications (iOS PWA limitation)

---

## Making Updates

Just push to GitHub — Vercel auto-deploys:

```bash
git add .
git commit -m "Update: added new feature"
git push
```

Your friends will get the update next time they open the app (service worker handles this automatically).

---

## Project Structure

```
budget-app/
├── public/
│   ├── favicon.svg          # Browser tab icon
│   ├── apple-touch-icon.png # iOS home screen icon (180x180)
│   ├── pwa-192x192.png      # Android PWA icon
│   └── pwa-512x512.png      # Large PWA icon + maskable
├── src/
│   ├── App.jsx              # Main app component (all the magic)
│   └── main.jsx             # Entry point
├── index.html               # HTML with iOS PWA meta tags
├── vite.config.js           # Vite + PWA plugin config
└── package.json
```

---

## Collecting Feedback

Consider adding a simple feedback mechanism:
- A "Send Feedback" button in Settings that opens `mailto:you@email.com`
- Or use a free Tally/Typeform embedded link
- Track what features people ask for — that's your V2 roadmap

---

## Next Steps After Friends & Family

When you're ready to go bigger:

| Path | Time | Cost | Best For |
|------|------|------|----------|
| Keep as PWA | 0 | $0 | Web-first, easy sharing |
| Capacitor → TestFlight | 1–2 weeks | $99/yr | Native feel, App Store later |
| Expo / React Native rewrite | 4–8 weeks | $99/yr | Full native, long-term |

---

## Quick Commands Reference

```bash
# Run locally for development
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```
