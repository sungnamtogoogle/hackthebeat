# Vercel + Supabase Postgres Deployment

Deployment branch: `deploy/vercel-supabase-postgres`

This repository is prepared as a minimal Next.js service backed by one Supabase Postgres database.

## 1. Create Supabase project

1. Create one Supabase project.
2. Copy the pooled Postgres connection string.
3. Keep only one runtime database URL for the app: `DATABASE_URL`.

Recommended Vercel runtime value:

```bash
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?sslmode=require"
```

## 2. Apply schema

Use either linked-project mode:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npm run db:push
```

Or direct database URL mode:

```bash
export DATABASE_URL="postgresql://..."
npm run db:push:url
```

The migration creates `public.party_registrations`.

## 3. Configure Vercel

1. Import this Git repository into Vercel.
2. Set the Vercel production branch or target branch to `deploy/vercel-supabase-postgres`.
3. Add environment variables for Production and Preview:

```bash
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="https://<your-vercel-domain>"
```

4. Deploy from the branch.

Vercel build settings are already committed:

```text
Framework: Next.js
Install Command: npm install
Build Command: npm run build
Node.js: >=20.11.0
Region: sin1
```

## 4. Verify

After deployment:

```bash
curl https://<your-vercel-domain>/api/health
```

Expected response:

```json
{
  "ok": true,
  "database": "postgres",
  "checkedAt": "..."
}
```

Then submit the form on `/` and confirm the count increases.

