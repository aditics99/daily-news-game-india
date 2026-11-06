# Your Daily News Game · India

Daily news for the dopamine-fried brain: a short, interactive way to understand and remember the stories behind the news. The visual direction takes cues from [Fermi](https://fermi.gg/)'s bold game card, clear progress, and shareable result, and [Preet Suthar](https://preetsuthar.me/)'s simple typography and restrained interface.

## Open the MVP

Play the live edition at [Your Daily News Game · India](https://aditics99.github.io/daily-news-game-india/).

Open `index.html` in a browser or publish the repository with GitHub Pages. There are no build steps, API keys, or server requirements for this static preview.

The homepage currently contains five manually selected India stories for the 6 November 2026 edition. Each has a source link, a short fill-in prompt, and a plain-language explanation. The static site does not automatically discover or refresh stories; update the edition in `news-game.js` before presenting it as a new day's edition.

## Files

- `index.html` is the public entry page.
- `news-game.css` contains the responsive, text-first design.
- `news-game.js` contains the daily story set, dropdown choices, explanations, and fill-in interaction.
- `editorial.html` is the earlier private cartoon archive desk, retained while the product direction changes.

The game reveals the short explanation and source after each answer. A completed day and daily streak are remembered in the current browser only; the final score can be shared with the browser's share menu or copied to send to friends. There is no account-based leaderboard.

## Editorial guardrails

- Do not turn deaths, injuries, or casualty counts into blanks, scores, or trivia.
- Avoid stories centered on disasters, mass-casualty events, or active violence.
- If a tragedy is essential context for another story, mention it briefly and sensitively; never ask readers to guess its human toll.
- Keep the game focused on understanding decisions, policies, institutions, and context—not memorizing distressing numbers.
