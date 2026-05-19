# 28 Lời Chúc Yêu Thương

Static interactive website for students. It contains 28 wishes and unlocks the surprise video after all wishes are opened.

## Run locally

Open `index.html` directly in a browser, or use a small local server:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload all files in this folder to the repository root.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, select **GitHub Actions**.
5. Push to the `main` branch.
6. Wait for the **Deploy to GitHub Pages** action to finish.

The deployment workflow is stored at `.github/workflows/pages.yml`.

## Customize

- Edit `wishes.json` to update the 28 wishes.
- Replace `assets/surprise-video.mp4` to update the final video.
- Edit `styles.css` to change colors, spacing, and layout.
