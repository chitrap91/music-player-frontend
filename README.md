# Music Streaming Frontend

Frontend app for the music streaming project, built with React + Vite.

## Live Demo

- Netlify: [https://ornate-twilight-62d8ce.netlify.app/](https://ornate-twilight-62d8ce.netlify.app/)

## Repositories

- Frontend GitHub: [https://github.com/chitrap91/music-player-frontend](https://github.com/chitrap91/music-player-frontend)
- Backend GitHub: [https://github.com/chitrap91/music-player-backend](https://github.com/chitrap91/music-player-backend)

## What This Frontend Supports

- User registration and login
- Home page with song browsing and search
- Playlist management (create playlist, add/remove songs)
- Like and comment actions on tracks
- User profile view

## Tech Stack

- React 19
- Vite
- React Router
- Axios
- Formik
- Tailwind CSS

## Important Architecture Notes

- This frontend talks to the backend API using `VITE_MUSIC_BACKEND_BASE_URL`.
- Sample audio files and related media are served from AWS S3 (through track URLs returned by backend APIs).
- User profile and app data (users, playlists, likes, comments, recently played) are stored in MongoDB via the backend service.

## Environment Variables

Create a `.env` file in `front-end/`:

```env
VITE_MUSIC_BACKEND_BASE_URL=http://localhost:3000
```

For Netlify, set the same key in Site Configuration -> Environment Variables and redeploy.

## Run Locally

```bash
npm install
npm run dev
```

App runs at: `http://localhost:5173`

## Build for Production

```bash
npm run build
npm run preview
```

