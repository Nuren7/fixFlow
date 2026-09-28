# FixFlow

FixFlow is a full-stack maintenance request platform for property owners and renters. Renters can create accounts, choose an existing owner, submit maintenance requests, and track their requests. Owners can sign in and see requests assigned to them.

## Live services

- Backend API: https://fixflow-tr8i.onrender.com
- Health check: https://fixflow-tr8i.onrender.com/api/health
- Frontend: deployed through Vercel from the `frontend` directory

## Features

- Owner and renter account creation
- Password login with JWT authentication
- Public owner directory for renter account setup
- Renter maintenance request form with priority
- Owner-linked maintenance requests
- Role-scoped request lists and dashboard metrics
- Request counts for open, overdue, in-progress, and completed work
- PostgreSQL persistence through Neon
- CORS configuration for the Vercel frontend

## Technology

- Frontend: React, TypeScript, Vite
- Backend: Java 17, Spring Boot 3.3.4, Spring Web, Spring Security, Spring Data JPA
- Authentication: JWT with BCrypt password hashing
- Database: PostgreSQL on Neon
- Migrations: Flyway
- Deployment: Vercel for the frontend and Render for the backend

## Project structure

```text
fixFlow/
├── backend/
│   ├── src/main/java/com/fixflow/
│   ├── src/main/resources/application.yml
│   ├── src/main/resources/db/migration/
│   └── pom.xml
├── frontend/
│   ├── src/main.tsx
│   ├── src/api.ts
│   ├── src/styles.css
│   └── package.json
├── .github/workflows/
│   ├── backend-ci.yml
│   └── frontend-ci.yml
├── Dockerfile
└── README.md
```

## Run locally

### Backend

Requirements: Java 17 and Maven.

```powershell
cd backend
mvn spring-boot:run
```

The backend runs on `http://localhost:8080` by default.

### Frontend

Requirements: Node.js and npm.

```powershell
cd frontend
npm install
npm run dev
```

The Vite development server runs on `http://localhost:5173`.

Create `frontend/.env.local` when the backend is not running on the default URL:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Environment variables

### Backend

Set these in Render or in the backend runtime environment:

```env
DATABASE_URL=jdbc:postgresql://your-neon-host/neondb?sslmode=require
DB_USERNAME=your-neon-username
DB_PASSWORD=your-neon-password
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRATION_MS=3600000
PORT=8080
FLYWAY_ENABLED=false
```

`DATABASE_URL` is used by the backend only. The frontend must never connect directly to Neon.

### Frontend

Set this in Vercel for Production, Preview, and Development:

```env
VITE_API_BASE_URL=https://fixflow-tr8i.onrender.com/api
```
## User flow

1. Create a Property owner account.
2. Sign out and create a Renter / customer account.
3. Select the owner from the owner list.
4. Sign in as the renter.
5. Submit a maintenance request.
6. The dashboard refreshes the request numbers and list.
7. Sign in as the selected owner to see that owner's requests.

Owners use the backend role `MANAGER`. Renters use the backend role `CUSTOMER`.

## API overview

Public endpoints:

- `GET /api/health`
- `GET /api/owners`
- `POST /api/auth/register`
- `POST /api/auth/login`

Authenticated endpoints:

- `GET /api/dashboard/metrics`
- `GET /api/requests`
- `POST /api/requests`
- `GET /api/requests/{id}`
- `PATCH /api/requests/{id}/status`

Authenticated requests use this header:

```text
Authorization: Bearer <jwt-token>
```

A request can be created with this JSON shape:

```json
{
  "title": "Leaking kitchen tap",
  "description": "Water is dripping beneath the sink.",
  "priority": "MEDIUM",
  "ownerId": 1
}
```

The authenticated renter is used as the request customer. Property and unit IDs are optional in the current frontend flow.

## Deployment

### Render backend

Use the repository root as the Render Docker build context. The root `Dockerfile` builds the Maven backend and starts the Spring Boot jar on port `8080`.

Configure the backend environment variables listed above. Keep database credentials and `JWT_SECRET` on Render only.

### Vercel frontend

Import the same repository and set:

- Root Directory: `frontend`
- Framework: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

Add `VITE_API_BASE_URL` with the Render API URL, then redeploy.

## GitHub Actions CI/CD

The repository includes two GitHub Actions workflows in `.github/workflows/`:

- `backend-ci.yml` runs the backend Maven test suite with Java 17.
- `frontend-ci.yml` installs the locked npm dependencies and runs the Vite production build.