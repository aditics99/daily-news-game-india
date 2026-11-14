# Your Daily News Game · India

A quick daily news game that helps readers keep up with the details that matter. [Play the game](https://aditics99.github.io/daily-news-game-india/).

## Daily publishing

GitHub Actions is scheduled to run at **7:00 AM India time**. It searches recent English-language coverage from Indian publishers through the free GDELT DOC API, then ranks candidates by recency and available reporting detail. One GDELT query returns up to 250 recent English-language article leads from India. If that API is rate-limited or unavailable, the publisher falls back to GDELT’s public Article List RSS feed, then checks up to 60 publisher pages for story detail. The pipeline asks Gemini Flash-Lite to choose five important, well-supported India stories and draft each as a short, simple story with two fair blanks, a plain-language explanation, and three extra links for the ending card. It does not require a fixed mix of topics.

The DOC API call is retried after rate limits with a cooldown. Its RSS fallback contains a rolling set of recent story titles and URLs (GDELT describes it as a 15-minute feed); it is used only when DOC search fails. The publisher then checks up to 60 direct HTTPS publisher pages for usable article text. Pages that block access or provide too little detail are skipped, and paywalls are never bypassed. The AI receives only detailed publisher-page evidence and returns candidate IDs instead of URLs; the script attaches the matching publisher links and checks every ID against the collected candidates. The publishing gate requires eight supported candidates: five stories plus three distinct links for the ending card. The workflow does not use paid search grounding. Gemini text generation is still subject to model availability, account quota, and Google’s terms. Keep billing disabled and check usage if you want to avoid paid requests.

If the draft fails validation or fewer than eight leads have enough evidence, the workflow stops and leaves the current edition live. If it passes, the workflow commits it to the repository and publishes it on GitHub Pages. You can also start it from **Actions → Publish India daily news game → Run workflow**.

GDELT states that its data is available for unrestricted use, including commercial projects, with attribution. This project credits [The GDELT Project](https://www.gdeltproject.org/).

## What the checks cover

The script checks for five stories, two blanks in order per story, three distinct answer choices with one correct answer, varied answer positions, no answer repeated in the headline or unblanked copy, selected source IDs from the collected GDELT candidates, and three separate ending-card candidate links. It also blocks casualty counts used as blanks and flags the “X, not Y” sentence pattern. Story cards do not display topic labels, and the edition is not forced to meet a topic quota.

GDELT is used to find and date candidate links; the story facts come from accessible publisher pages. Some pages block access or provide too little context; those candidates are skipped. GDELT’s article list does not provide social-media engagement counts, so this is a recent news selection rather than a live social-trending chart. The AI is instructed to skip unsupported stories rather than fill gaps from memory. Headlines and copy should name the people, places, decisions, dates, and stakes supported by the reporting; explanations should clarify unfamiliar systems in plain language. The checks can catch structural and source-link problems; they cannot guarantee that every statement is true or that every story has enough context. The workflow fails closed when a check does not pass, but this is not a substitute for a human editor.

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
- scripts/publish_daily_edition.py — GDELT discovery, publisher-page enrichment, story generation, validation, and edition preparation.
- .github/workflows/morning-candidates.yml — scheduled and manual publishing workflow.
- editorial.html — earlier cartoon archive desk retained during the product pivot.

Daily completion and streak are saved in the current browser. Results can be shared and compared anonymously; there is no account-based leaderboard.
