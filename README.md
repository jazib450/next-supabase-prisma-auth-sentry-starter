# Starter Project (Next.js + Supabase + Prisma + Sentry)

A production-ready boilerplate to quickly start building full-stack apps.  
It includes authentication, database with RLS, error monitoring, UI components, and deployment setup.

## 🚀 Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** + [shadcn/ui](https://ui.shadcn.com/) components
- **Supabase**
  - Postgres (with Prisma ORM)
  - Auth (Google, magic links, etc.)
  - Row Level Security (RLS) policies for multi-user data
- **Prisma** (schema + migrations)
- **Sentry** for error monitoring & tracing
- **Vercel** for deployment

## 🛠 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/jazib450/next-supabase-prisma-auth-sentry-starter.git my-app
cd my-app
pnpm install
```

### 2. Environment Variables
Copy .env.example → .env.local and fill in values.

For production/staging, create new production/staging environment variables and add them through Vercel (or whatever else you are using).

### 3. Useful Commands

Install dependencies:

```bash
pnpm install
````

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Build for prod:
```bash
pnpm build
```

Run prod:
```bash
pnpm start
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### 4. Database Migration

Push schema to your Supabase Postgres:

```bash
pnpm prisma migrate dev --name init
```

To deploy migrations in staging/prod:

```bash
pnpm prisma migrate deploy
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Important Note on Database & Migrations

This project uses Supabase (Postgres) + Prisma.  
⚠️ Important: Supabase provides multiple connection strings. Which one to use depends on context:

- **Local development:** use the **Direct connection** URL. Fastest for DX.
- **Vercel runtime:** use the **Transaction pooler** URL. Scales for serverless apps.
- **GitHub Actions (migrations):** use the **Session pooler** URL. Transaction pooler breaks Prisma migrations; Session pooler works and is IPv4-compatible.

### Running migrations
- **Local dev:**  
  ```bash
  pnpm prisma migrate dev
  ```
- **Staging / Prod CI:**  
  Migrations are deployed via GitHub Actions. To enable this:
    1.	There is a workflow file at .github/workflows/migrate-staging.yml (and migrate-prod.yml for production).
    2.	The workflow runs ```pnpm prisma migrate deploy``` against the appropriate database.
    3.	Make sure to store your database connection strings (session pooler) as GitHub repo secrets (```DIRECT_URL_STAGING```, ```DIRECT_URL_PROD```).

  This ensures schema changes are always applied safely before your Next.js app goes live.