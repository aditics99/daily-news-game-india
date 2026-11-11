# Your Daily News Game · India

A quick daily news game that helps readers keep up with the details that matter. [Play the game](https://aditics99.github.io/daily-news-game-india/).

## Daily publishing

GitHub Actions is scheduled to run at **7:00 AM India time**. It gathers recent English-language India news from public Google News RSS feeds across politics and public life, business, everyday services, science and environment, sport, and culture. It ranks the leads for recency and topic coverage, then asks Gemini Flash-Lite to choose five stories and draft each as a short, simple story with two blanks, a plain-language explanation, and three extra links for the ending card.

The AI returns the numbered RSS candidates it used, rather than writing URLs. The publishing script attaches the original candidate links and checks that every selected ID maps to a feed item. The workflow does not use paid search grounding. Gemini text generation is still subject to the current model availability, account quota, and Google’s terms. Keep billing disabled and check usage if you want to avoid paid requests.

If the draft fails validation or there are too few recent leads, the workflow stops and leaves the current edition live. If it passes, the workflow commits it to the repository and publishes it on GitHub Pages. You can also start it from **Actions → Publish India daily news game → Run workflow**.

## What the checks cover

The script checks for five stories across at least four topics, two blanks in order per story, three distinct answer choices with one correct answer, varied answer positions, no answer repeated in the headline or unblanked copy, selected source IDs from the collected RSS candidates, and three separate ending-card candidate links. It also blocks casualty counts used as blanks and flags the “X, not Y” sentence pattern.

The draft is based on RSS headlines and snippets, which can be brief. The AI is instructed to skip stories without enough detail and avoid adding unsupported facts. The checks can catch structural and source-link problems; they cannot guarantee that every statement is true or that every story has enough context. The workflow fails closed when a check does not pass, but this is not a substitute for a human editor.

## One-time setup

The workflow reads the API key from the GitHub Actions repository secret named **GEMINI_API_KEY**. The key must never be placed in a project file or shared in chat. If setting up a new key, create it in [Google AI Studio](https://aistudio.google.com/apikey), then add it under **GitHub → Settings → Secrets and variables → Actions → New repository secret**. Keep billing disabled if you want to avoid paid API usage; free-tier availability and limits can change.

## Editorial rules

- Include specific people, places, dates, decisions, and amounts when they matter. Explain what happened and why it matters.
- Write naturally and simply. Explain unfamiliar terms in plain language and use a real-life example when it helps.
- Give readers enough context to understand the story. Include what happens next or what response is underway when relevant.
- Use two meaningful blanks. Avoid arbitrary number questions and answers revealed in the headline, another sentence, or the other blank.
- Use three plausible choices, one correct answer, and vary the correct choice’s position.
- Attribute allegations and changing estimates. Cover significant disasters sensitively, including verified location or magnitude and relief or recovery work when relevant. Never make death, injury, or casualty counts into blanks or scores; avoid graphic details.
- Check sentence order, grammar, punctuation, and natural flow. Avoid fragments around blanks and the “X, not Y” sentence pattern.

## Project files

- index.html — public entry page.
- news-game.js — current edition, choices, explanations, sources, and game behavior.
- news-game.css — responsive game layout.
- scripts/publish_daily_edition.py — RSS collection, candidate ranking, story generation, validation, and edition preparation.
- .github/workflows/morning-candidates.yml — scheduled and manual publishing workflow.
- editorial.html — earlier cartoon archive desk retained during the product pivot.

Daily completion and streak are saved in the current browser. Results can be shared and compared anonymously; there is no account-based leaderboard.
