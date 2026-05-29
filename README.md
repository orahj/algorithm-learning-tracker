# Algorithm Learning Tracker

A full-stack algorithm practice tracker for following a 3-month learning plan across C#, JavaScript, and Python.

The app is designed as a personal learning command center. It tracks daily practice sessions, topics covered, problems solved, mistakes, repeat dates, review queue, topic notes, and progress by language.

This repository contains:

- A React/Vite frontend at the project root
- A NestJS API server in `server/`
- SQLite local development storage through TypeORM
- Email/password authentication with JWT
- Google OAuth scaffolding for later third-party login
- Stripe-ready subscription scaffolding
- AI coach endpoint scaffolding powered by OpenAI when configured
- Swagger API documentation for backend endpoints

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
- Email/password authentication
- Backend-backed tracker data
- Mobile responsive UI

## Tech Stack

Frontend:

- React
- Vite
- Tailwind CSS
- CSS
- lucide-react icons
- React Context + `useReducer`

Backend:

- NestJS
- TypeORM
- SQLite
- Passport/JWT
- Google OAuth strategy
- Swagger/OpenAPI
- Stripe SDK
- OpenAI SDK

## Project Structure

Frontend:

```txt
src/
  app/                 App shell and current view selection
  components/          Shared layout and reusable UI controls
  data/                Static options, seed data, and learning plan content
  features/            Product screens grouped by feature
  services/            API clients and persistence helpers
  state/               Auth/tracker providers, reducer, and actions
  utils/               Date, filter, and stats helpers
```

Backend:

```txt
server/
  src/
    common/            Shared decorators and guards
    database/          TypeORM database setup
    modules/
      auth/            Email/password auth, Google OAuth, JWT
      billing/         Stripe checkout and webhook scaffolding
      coach/           AI coach prompt templates and endpoints
      tracker/         Daily logs, problems, notes APIs
      users/           User entity, service, repository
```

Frontend state flows through `AuthProvider`, `TrackerProvider`, `trackerReducer`, and `trackerActions`. Feature screens dispatch actions through the provider, and the provider calls the NestJS API through `src/services`.

Tailwind CSS is configured through `vite.config.js` with `@tailwindcss/vite`, and `src/styles.css` imports Tailwind before the app's component layer.

## Run Frontend and Backend Together

Terminal 1, start the API:

```bash
cd server
npm install
copy .env.example .env
npm.cmd run start:dev
```

Terminal 2, start the frontend:

```bash
npm install
copy .env.example .env
npm.cmd run dev
```

Open the frontend:

```txt
http://localhost:5173
```

Open Swagger API docs:

```txt
http://localhost:4000/api/docs
```

Register/login from the frontend, then add practice logs or problems. Records will be written to the backend SQLite database at `server/data/tracker.sqlite`.

## Environment Variables

Frontend `.env`:

```txt
VITE_API_BASE_URL=http://localhost:4000/api
```

Backend `server/.env`:

```txt
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:5173
DATABASE_PATH=./data/tracker.sqlite
JWT_SECRET=replace-this-with-a-long-random-secret
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_AI_COACH=
STRIPE_PRICE_PRO_INTERVIEW=
```

Google auth is scaffolded but requires real Google OAuth credentials before it can complete the login flow. Email/password auth works without Google setup.

## Backend Server

The NestJS backend lives in `server/`. It owns authentication and tracker data persistence.

Current backend modules:

- `auth`: email/password register/login, Google OAuth, JWT issuing, and current-user endpoint
- `billing`: Stripe checkout-session creation and webhook handling
- `coach`: AI explanations with plan-based usage limits
- `users`: user entity, service, and repository
- `tracker`: daily logs, problems, and topic notes APIs
- `database`: TypeORM setup

Protected tracker routes expect:

```txt
Authorization: Bearer <access-token>
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

Google auth starts at:

```txt
GET http://localhost:4000/api/auth/google
```

Swagger API docs are available after starting the server:

```txt
http://localhost:4000/api/docs
```

Use the **Authorize** button in Swagger with a bearer token when testing protected tracker endpoints.

## Current API Endpoints

```txt
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/google
GET    /api/auth/google/callback
GET    /api/auth/me

POST   /api/billing/checkout-session
POST   /api/billing/webhook

POST   /api/coach/explain

GET    /api/tracker
GET    /api/tracker/daily-logs
POST   /api/tracker/daily-logs
PATCH  /api/tracker/daily-logs/:id
DELETE /api/tracker/daily-logs/:id
GET    /api/tracker/problems
POST   /api/tracker/problems
PATCH  /api/tracker/problems/:id
DELETE /api/tracker/problems/:id
GET    /api/tracker/notes
PATCH  /api/tracker/notes/:topic
```

## View the SQLite Database in VS Code

The local database file is:

```txt
server/data/tracker.sqlite
```

In VS Code, install the recommended workspace extensions when prompted, or manually install:

- SQLite Viewer
- SQLTools
- SQLTools SQLite Driver

Then open `server/data/tracker.sqlite` from the Explorer. You can inspect tables such as `users`, `daily_logs`, `problems`, and `topic_notes` as records are created through the API.

## Build

Frontend:

```bash
npm.cmd run build
```

Backend:

```bash
cd server
npm.cmd run build
```

## Preview the Frontend Production Build

```bash
npm.cmd run preview
```

## Deployment Notes

The recommended cheap one-platform deployment target is Railway.

Use one Railway project with three services:

```txt
frontend   React/Vite app
api        NestJS server from server/
postgres   Railway Postgres
```

See the full Railway guide:

```txt
docs/railway-deployment.md
```

## Local Storage Note

The frontend still keeps a small local fallback under this key:

```txt
algorithm-learning-tracker-v1
```

Authenticated tracker data is stored through the NestJS API in SQLite. The local fallback can still support development or future offline behavior.
