# Vercel + Supabase Postgres Deployment

Deployment branch: `deploy/vercel-supabase-postgres`

This repository is prepared as a minimal Next.js service backed by one Supabase Postgres database.

## 1. Create Supabase project

1. Create one Supabase project.
2. Copy the project URL and service role key.
3. Keep the service role key server-only. Never expose it with a `NEXT_PUBLIC_` prefix.

Runtime values:

```bash
SUPABASE_URL="https://<project-ref>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"
```

## 2. Apply schema

Use either linked-project mode:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npm run db:push
```

Or direct database URL mode if you have a Postgres connection string:

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
SUPABASE_URL="https://<project-ref>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"
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
