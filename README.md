# Explain That

A weekly, image-led selection of Indian political cartoons. Each cartoon opens a short explainer written in our own words: a hook, the real political event behind the image, and a simple account of what the cartoonist is arguing. Factual claims link to sources below the explanation.

## Run locally

Open `index.html` in a modern browser, or serve this folder with any static web server. Open `editorial.html` separately for the private editorial desk. See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for the editor sign-in and database setup.

## Weekly issue rules

The public page shows approved cartoons dated in the current Monday-to-Sunday week. Cartoons appear as images only when display rights are verified. Candidate work stays private until reviewed and approved. Do not reuse artwork or explanatory copy from POLITICO’s gallery; it is a format reference only. The visual direction remains Justine Soulié’s portfolio, with Explain That’s existing gold frame and closable explainer.

Write each explainer from the historical and political facts, in simple language. Start with a hook, name the real event and why it matters, explain the cartoonist’s point, and distinguish that opinion from confirmed facts. Add reliable sources for factual claims. Credit the artist and publication. Do not use an image merely because it is publicly viewable or credited.

## Hosting

GitHub Pages publishes the public site and separate auth-gated editorial desk. The Supabase publishable key in browser code is intended for public use; row-level security protects editorial data.
