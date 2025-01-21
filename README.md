# AutoPDF

## Tech Stack

Bun monorepo

- **Backend**: ElysiaJS
- **Frontend**: React + Vite + TanStack Router
- **Authentication**: Better Auth
- **Database**: Drizzle + SQLite

## Setup

From the project root, run:
```bash
bun install
```
### Client Setup

```bash
cd packages/client
cp .env.example .env
```

Configure client environment:

```bash
VITE_API_URL=http://localhost:3000
```

### Server Setup

```bash
cd packages/server
cp .env.example .env
```

Configure server environment:

```bash
DB_FILE_NAME=
BETTER_AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_REDIRECT_URI=
```

For OAuth setup, please refer to [Better-Auth documentation](https://www.better-auth.com)


### Initialize database:

```bash
cd packages/server
bun run db:push
```

### Dev
From the project root, run:
```bash
bun run dev
```

### Build
From the project root, run:
```bash
bun run build
```

### Production
From the project root, run:
```bash
bun run start
```
