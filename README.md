# Zees Tech Repairs

Static marketing pages for Zees Tech Repairs. The site can be built locally and deployed via Netlify.

## Prerequisites
- Node.js and npm installed.

## Install dependencies
This project has no runtime dependencies, but initializing npm will create a lockfile for reproducible builds:
```bash
npm install
```

## Build
Generate the production-ready site into `dist/`:
```bash
npm run build
```
The command cleans any previous `dist/` output, then copies the HTML and PNG assets into the folder. The `dist/` directory is gitignored and only produced during the build step.

## Deploying to Netlify
1. Push changes to GitHub.
2. In Netlify, choose **Add new site → Import an existing project** and select this repository.
3. Set **Build command** to `npm run build` and **Publish directory** to `dist`.
4. Deploy; Netlify will rebuild on each push to the tracked branch. Configure environment variables in **Site settings → Environment** if needed.
