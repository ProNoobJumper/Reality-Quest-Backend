# RealityQuest – Gamified Habit & Challenge Tracker

This project is a Node.js + Express + MongoDB backend with a custom HTML/CSS/JS frontend served from the `public` folder.

The main landing page includes:
- An animated intro (smoke + typing)
- A clock hero animation
- Sign in / sign up flows
- A challenges dashboard and a separate leaderboard page

---

## 1. Prerequisites

Make sure you have:

- **Node.js** (v18+ recommended)
- **npm** (comes with Node)
- A running **MongoDB** instance (local or cloud, e.g. MongoDB Atlas)

You can verify Node and npm with:

```bash path=null start=null
node -v
npm -v
```

---

## 2. Install dependencies

From the project root (`backend development project` folder), install the server dependencies:\n
```bash path=null start=null
npm install
```

This uses the dependencies defined in `package.json` (Express, Mongoose, JWT, etc.).

---

## 3. Configure environment variables

Create a `.env` file in the project root (same folder as `package.json`) with at least:

```bash path=null start=null
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=some-long-random-secret
PORT=5000
```

- `MONGO_URI` – connection string to your MongoDB database.
- `JWT_SECRET` – any long random string used to sign JWTs.
- `PORT` – optional; defaults to `5000` if not set.

> If you already have a `.env` from earlier setup, you can keep using it.

---

## 4. (Optional) Seed initial data

If you want some starter challenges and test users, run the seed scripts (if present):

```bash path=null start=null
node seedChallenges.js
node checkUsers.js   # just to verify users/challenges
```

These scripts connect using `MONGO_URI`, so ensure your `.env` is configured first.

---

## 5. Start the development server

From the project root, run:

```bash path=null start=null
npm run dev
```

This runs `nodemon src/server.js`, which:
- Loads environment variables
- Connects to MongoDB
- Starts the Express app on `PORT` (default **5000**)

You should see a log like:

```bash path=null start=null
Server running on port 5000
```

Leave this terminal window open while you use the website.

---

## 6. Open the website in your browser

With the dev server running, open your browser and go to:

```text path=null start=null
http://localhost:5000/
```

You should see the **RealityQuest** landing page with:
- Intro smoke + typing overlay
- Animated clock hero section
- "Get started" button that scrolls to the main app section

Other pages:
- **Sign In**: `http://localhost:5000/signin.html`
- **Sign Up**: `http://localhost:5000/signup.html`
- **Leaderboard**: `http://localhost:5000/leaderboard.html`

---

## 7. Basic usage

1. On the landing page, click **Get started** and choose **Sign Up** to create an account.
2. After registering or signing in, you’ll be redirected back to `/`.
3. The **Challenges** card will appear, showing:
   - Create Challenge form
   - Category filter
   - Challenge list
4. Completing challenges awards XP and updates your streak.
5. Use the **Leaderboard** link on the challenges card (or go to `/leaderboard.html`) to view rankings by XP / streak.

---

## 8. Stopping the server

To stop the dev server, go to the terminal where `npm run dev` is running and press:

```text path=null start=null
Ctrl + C
```

You can restart it anytime with `npm run dev` again.

---

## 9. Project structure (high level)

- `src/`
  - `app.js` – Express app, routes, middleware, static `public` serving
  - `server.js` – entry point, connects DB and starts the server
  - `models/` – Mongoose models (`User`, `Challenge`, `Progress`)
  - `routes/` – API routes (auth, challenges, progress, leaderboard)
  - `controllers/` – controllers for each route group
- `public/`
  - `index.html` – main landing + app page
  - `signin.html`, `signup.html` – animated auth pages
  - `leaderboard.html` – dedicated leaderboard page
  - `style.css` – main site styling
  - `dog.css` – husky dog animation styles
  - `app.js` – frontend logic (auth, challenges, leaderboard, intro animations)
- `seedChallenges.js`, `checkUsers.js` – helper scripts for data seeding/inspection

This should be enough to run and view the website locally. If you want a section on deploying (e.g. Render, Railway, or Azure), we can extend this README further.
