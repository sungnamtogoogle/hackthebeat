# Deployment Result

## Live website

- Production URL: https://sungnam-alumni.vercel.app
- Latest deployment URL: https://sungnam-alumni-84mdtjvcy-hackthebeat.vercel.app
- Vercel project: `hackthebeat/sungnam-alumni`
- Vercel project ID: `prj_S1VNLphl4rXvxKftcRvOHBG1xBYB`
- GitHub repository for automatic deploy setup: https://github.com/sungnamtogoogle/hackthebeat

## Current deployment mode

The current production deployment was created from the local workspace with Vercel CLI.

It is deployed and usable now. GitHub automatic deployment should be connected to:

```text
https://github.com/sungnamtogoogle/hackthebeat
```

```bash
npx vercel git connect https://github.com/sungnamtogoogle/hackthebeat
```

After that, pushes to the connected production branch can trigger Vercel deployments.

## Database

- Provider: Supabase
- Database: Supabase managed Postgres
- Supabase org ID: `uxujrqcdptkhmxgoqrcl`
- Supabase project name: `hackthebeat`
- Supabase project ref: `izckwooyugfzfrcngpdi`
- Supabase project URL: https://supabase.com/dashboard/project/izckwooyugfzfrcngpdi
- App table: `public.party_registrations`

The schema was applied with:

```bash
npx supabase link --project-ref izckwooyugfzfrcngpdi
npx supabase db push
```

## Verification

Health check:

```bash
curl https://sungnam-alumni.vercel.app/api/health
```

Verified response:

```json
{
  "ok": true,
  "database": "postgres",
  "registrationCount": 1,
  "checkedAt": "2026-08-29T07:20:53.286Z"
}
```

Browser form submission was also verified. After submitting a test registration, the remote database count was:

```json
{
  "registrations": 1
}
```

## Query the database

From this repository:

```bash
npx supabase db query --linked 'select count(*)::int as registrations from public.party_registrations;'
```

View records in Supabase Dashboard:

1. Open https://supabase.com/dashboard/project/izckwooyugfzfrcngpdi
2. Go to Table Editor.
3. Open `party_registrations`.

## Vercel environment variables

These are saved in Vercel for Production and Preview:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

The service role key is stored as a Vercel Secret and should not be committed to Git.
