# Whiskerfield

A static, cat-lovers social network built for GitHub Pages and Supabase.

## Architecture

- `src/App.tsx` composes the page only.
- `src/components/` contains independent interface sections.
- `src/hooks/use-whiskerfield.ts` owns session, feed, membership, and write actions.
- `src/lib/` holds narrow integrations and utilities.
- `src/styles/` splits base, layout, community, member, dialog, and responsive rules.
- `supabase/schema.sql` creates the Auth-backed social data model and its RLS policies.

## Local development

```sh
npm install
cp env.example .env.local
npm run dev
```

Run `npm run lint` and `npm run build` before publishing.

## Supabase setup

1. Apply [`supabase/schema.sql`](supabase/schema.sql) to the Whiskerfield Supabase project.
2. In Supabase Auth URL Configuration, set the Site URL to `https://whiskerfield.social` and add the GitHub Pages preview URL while testing.
3. Copy the project URL and **publishable** API key into GitHub repository secrets named `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.

The publishable key is intended for a browser app. Never add a Supabase secret or service-role key to GitHub Pages, a Vite `VITE_` variable, or source control.

## GitHub Pages

The workflow at [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) builds and deploys `dist/` from `main`.

Create a GitHub repository, enable **Settings → Pages → GitHub Actions** as its publishing source, add the two Supabase secrets above, then push `main`. GitHub Pages is public on GitHub Free, so use a public repository for the free-hosting route.

## whiskerfield.social

First add `whiskerfield.social` under **Settings → Pages → Custom domain** in the GitHub repository. Then, at the DNS provider, set the apex `@` A records to:

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

Also add `www` as a CNAME to `saappleg.github.io`. When GitHub shows the DNS check as valid, turn on **Enforce HTTPS**. GitHub recommends configuring the custom domain before changing DNS, and warns against wildcard DNS records.

## Google AdSense

The approved publisher loader is in [`index.html`](index.html), and every production build writes this record to `/ads.txt`:

```text
google.com, pub-2209406347192595, DIRECT, f08c47fec0942fa0
```

The page reserves a clearly labeled advertising area, but actual ad units should only be added after the site is approved and Google provides an ad-slot ID.
