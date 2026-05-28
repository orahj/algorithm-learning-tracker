# Railway Deployment Guide

This project can be deployed on Railway as three services inside one Railway project:

```txt
algorithm-learning-tracker
  frontend   React/Vite static app
  api        NestJS API
  postgres   Railway Postgres database
```

## 1. Create the Railway Project

1. Go to Railway.
2. Create a new project from the GitHub repository.
3. Add a Postgres database service.
4. Add two app services from the same repository:
   - `frontend`
   - `api`

## 2. API Service Settings

Set the API service root directory to:

```txt
server
```

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm run start:prod
```

Environment variables:

```txt
NODE_ENV=production
PORT=4000
CLIENT_URL=https://your-frontend-domain.up.railway.app
DATABASE_URL=${{ Postgres.DATABASE_URL }}
DATABASE_SSL=false
DATABASE_SYNCHRONIZE=true
JWT_SECRET=use-a-long-random-production-secret
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://your-api-domain.up.railway.app/api/auth/google/callback
```

Notes:

- `DATABASE_SYNCHRONIZE=true` is acceptable for an early MVP. For production with real users, switch to migrations and set it to `false`.
- Railway injects a `PORT` variable automatically. If Railway supplies one, it will override the value above.
- `DATABASE_SSL=false` is typically fine when the API and Postgres run inside Railway. Use `true` only if your Postgres URL requires SSL.

## 3. Frontend Service Settings

Set the frontend service root directory to the repository root:

```txt
/
```

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm run start -- --port $PORT
```

Environment variables:

```txt
VITE_API_BASE_URL=https://your-api-domain.up.railway.app/api
```

Important:

- Vite reads `VITE_API_BASE_URL` at build time, so set it before deploying the frontend.
- After the API service gets its public Railway domain, update this value and redeploy the frontend.

## 4. Deployment Order

Recommended order:

1. Deploy Postgres.
2. Deploy API.
3. Copy the API public domain.
4. Set `VITE_API_BASE_URL` on the frontend service.
5. Deploy frontend.
6. Copy the frontend public domain.
7. Set `CLIENT_URL` on the API service.
8. Redeploy API.

## 5. Smoke Test

After deployment:

```txt
https://your-api-domain.up.railway.app/api/docs
```

Then test:

1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. Authorize Swagger with the returned bearer token.
4. `POST /api/tracker/daily-logs`

Finally, open the frontend domain and register/login from the UI.
