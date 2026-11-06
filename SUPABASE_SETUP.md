# Supabase setup for the private editorial desk

The Supabase project is `explain-that`. The editorial desk uses email sign-in and an editor allowlist. The public page reads approved cartoons only.

## Sign in as the editor

1. Open the separate [editorial desk](https://aditics99.github.io/daily-news-game-india/editorial.html).
2. Enter your email address and use the secure link Supabase sends you.
3. Add your account to `public.editorial_admins` using the SQL statement shown by the desk.
4. Refresh the desk to review and publish cartoons.

## Database migration

The archive fields used by the editorial form require the migration in [`supabase/archive_migration.sql`](supabase/archive_migration.sql). In Supabase **SQL Editor**, run it once. For a new Supabase project, run [`supabase/schema.sql`](supabase/schema.sql) first, then the archive migration.

## Add a weekly cartoon

For each candidate, include the cartoon date, artist, publication or collection, original source link, rights evidence, an original short explainer, and links backing its factual claims. The explainer should open with a hook, explain the real event behind the cartoon and why it matters, describe the artist’s point in simple language, and separate opinion from confirmed fact.

Candidates remain private until reviewed. The public page shows image files only when public-domain status or permission for this site's use is verified. A link and artist credit do not grant permission to republish artwork. Use POLITICO only as a weekly-format reference; do not copy its cartoons or explainer text. Justine Soulié remains the visual reference.

## Rights handling

If image rights are unclear, do not display or hotlink the image. Contact the artist or rights holder for permission, or select a work with a license that clearly permits this use. Record the permission or license in the candidate before publication.

## Project details

- Hosted site: `https://aditics99.github.io/daily-news-game-india/`
- Editorial desk: `https://aditics99.github.io/daily-news-game-india/editorial.html`
- Supabase project: `https://huyogawqcaheatwvfrgc.supabase.co`
