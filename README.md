# Algorithm Learning Tracker

A simple deployable React web application for tracking a 3-month algorithm practice plan across C#, JavaScript, and Python.

The app is designed as a personal learning command center. It tracks daily 1-hour practice sessions, topics covered, problems solved, mistakes, repeat dates, review queue, topic notes, and progress by language.

## Features

- Dashboard summary cards
- 3-month learning plan
- Daily practice log
- Manual problem bank
- Review queue for repeat and solved-with-help problems
- Filters by language, topic, difficulty, status, and date range
- Progress charts
- Topic notes section
- Settings page
- Import/export JSON backup
- Local browser storage with `localStorage`
- Mobile responsive UI

## Tech Stack

- React
- Vite
- Tailwind CSS
- CSS
- lucide-react icons
- Browser localStorage

## Project Structure

The app is organized by responsibility so it can move to a backend-backed Next.js/Node.js architecture later without every screen needing to change.

```txt
src/
  app/                 App shell and current view selection
  components/          Shared layout and reusable UI controls
  data/                Static options, seed data, and learning plan content
  features/            Product screens grouped by feature
  services/            Persistence adapters, currently localStorage
  state/               Central tracker reducer, actions, and provider
  utils/               Date, filter, and stats helpers
```

State now flows through `TrackerProvider`, `trackerReducer`, and `trackerActions`. Feature screens dispatch actions instead of writing directly to storage. The current `services/trackerStorage.js` adapter is the main file to replace when the project moves from browser storage to a backend API.

Tailwind CSS is configured through `vite.config.js` with `@tailwindcss/vite`, and `src/styles.css` imports Tailwind before the app's component layer. Existing custom classes still work, while new and refactored screens can use Tailwind responsive utilities directly.

## How to Run Locally

```bash
npm install
npm run dev
```

If you want the frontend to call a different backend URL, create `.env` from `.env.example`:

```bash
copy .env.example .env
```

Default frontend API URL:

```txt
VITE_API_BASE_URL=http://localhost:4000/api
```

Then open the local URL shown in the terminal, usually:

```bash
http://localhost:5173
```

## Run Frontend and Backend Together

Terminal 1:

```bash
cd server
npm.cmd run start:dev
```

Terminal 2:

```bash
npm run dev
```

Open:

```bash
http://localhost:5173
```

Register/login from the frontend, then add practice logs or problems. Records will be written to the backend SQLite database at `server/data/tracker.sqlite`.

## Backend Server

A NestJS backend has been scaffolded in `server/` for dynamic data and Google authentication.

```bash
cd server
npm install
copy .env.example .env
npm run start:dev
```

The API runs on `http://localhost:4000` by default and uses SQLite at `server/data/tracker.sqlite` for local development.

### View the SQLite Database in VS Code

The local database file is:

```txt
server/data/tracker.sqlite
```

In VS Code, install the recommended workspace extensions when prompted, or manually install:

- SQLite Viewer
- SQLTools
- SQLTools SQLite Driver

Then open `server/data/tracker.sqlite` from the Explorer. You can inspect tables such as `users`, `daily_logs`, `problems`, and `topic_notes` as records are created through the API.

Current backend modules:

- `auth`: Google OAuth, JWT issuing, and current-user endpoint
- `auth`: email/password register/login while Google OAuth credentials are pending
- `users`: user entity, service, and repository
- `tracker`: daily logs, problems, and topic notes APIs
- `database`: TypeORM setup

Protected tracker routes expect:

```txt
Authorization: Bearer <access-token>
```

Google auth starts at:

```txt
GET http://localhost:4000/api/auth/google
```

Email/password auth:

```txt
POST http://localhost:4000/api/auth/register
POST http://localhost:4000/api/auth/login
```

Example register body:

```json
{
  "email": "you@example.com",
  "displayName": "Your Name",
  "password": "password123"
}
```

Example login body:

```json
{
  "email": "you@example.com",
  "password": "password123"
}
```

Swagger API docs are available after starting the server:

```txt
http://localhost:4000/api/docs
```

Use the **Authorize** button in Swagger with a bearer token when testing protected tracker endpoints.

## How to Build

```bash
npm run build
```

The production build will be created in the `dist` folder.

## How to Preview the Production Build

```bash
npm run preview
```

## How to Deploy to Vercel

1. Push this project to GitHub.
2. Go to Vercel.
3. Import the GitHub repository.
4. Use the default Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Deploy.

## How to Deploy to Netlify

1. Push this project to GitHub.
2. Go to Netlify.
3. Add a new site from Git.
4. Use:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy.

## How localStorage Works

The app stores all tracker data in the browser under this key:

```txt
algorithm-learning-tracker-v1
```

This means:

- No backend is required.
- Data stays in the current browser/device.
- Clearing browser data may delete your tracker data.
- Use **Settings → Export JSON** to back up your progress.
- Use **Settings → Import JSON** to restore a backup.

## Data Model Overview

The app uses a structure similar to what a future .NET API can expose:

```js
{
  planStartDate: "2026-05-25",
  targetDailyMinutes: 60,
  learningPlan: [],
  dailyLogs: [],
  problems: [],
  notes: {}
}
```

### Daily Log

```js
{
  id,
  date,
  language,
  topic,
  problemName,
  platform,
  difficulty,
  status,
  timeSpent,
  mistakeMade,
  patternLearned,
  repeatDate,
  notes
}
```

### Problem

```js
{
  id,
  name,
  topic,
  language,
  difficulty,
  link,
  status,
  lastAttemptedDate,
  repeatDate,
  notes
}
```

## Future .NET Backend Integration Idea

Later, you can replace localStorage with API calls to an ASP.NET Core backend.

Suggested endpoints:

```txt
GET    /api/tracker/summary
GET    /api/learning-plan
GET    /api/daily-logs
POST   /api/daily-logs
PUT    /api/daily-logs/{id}
DELETE /api/daily-logs/{id}
GET    /api/problems
POST   /api/problems
PUT    /api/problems/{id}
DELETE /api/problems/{id}
GET    /api/review-queue
GET    /api/notes
PUT    /api/notes/{topic}
POST   /api/import
GET    /api/export
```

Suggested backend entities:

- LearningPlan
- LearningPlanWeek
- DailyPracticeLog
- AlgorithmProblem
- TopicNote
- ReviewSchedule

You can keep the React models mostly the same and swap `saveData()` / `getInitialData()` with an API service layer.
