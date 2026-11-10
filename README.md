# Your Daily News Game · India

A daily game that helps people understand India’s news by recalling the details that matter. [Play the game](https://aditics99.github.io/daily-news-game-india/).

## What the daily automation does

At **7:00 AM India time**, GitHub Actions gathers recent English-language India headlines across politics and public life, business, everyday services, science and environment, sport, and culture. An AI editor researches the leads on the live web, chooses five significant stories across at least four topics, writes each as a short story with two fill-in blanks, adds simple explanations and source links, and prepares three extra links for the ending card.

Before publishing, the workflow checks that there are five stories, two blanks in the right order, three distinct choices per blank, answers are not repeated in the headline or remaining story, correct dropdown positions are varied, and each story has two source links from separate domains returned by web search. It also checks that casualty figures are not used as numerical blanks. If an edition is incomplete or fails a check, the workflow stops and leaves the last published edition in place.

A successful edition is committed to the repository and published to GitHub Pages automatically. You can also start the same workflow by opening **Actions → Publish India daily news game → Run workflow**.

## One-time setup

The story research and writing uses the OpenAI API. Create an API key, then add it to this repository as an Actions secret named **OPENAI_API_KEY** under **Settings → Secrets and variables → Actions**. Keep the key in GitHub’s secret field; never add it to a project file. API usage may incur charges, and any manual reruns make additional API requests.

After the secret is saved, run the workflow once from the Actions page to publish the first automated edition. Future editions are scheduled for 7:00 AM India time.

## Editorial rules built into the workflow

- Include concrete names, places, dates, decisions, and numbers when they matter. Explain what happened and why it matters.
- Keep the writing natural, specific, conversational, and easy to understand. Explain unfamiliar terms in plain language; add a real-life example when it clarifies the idea.
- Give enough background for a reader to understand the stakes without needing to search for basic context. Include what happens next or what response is underway when relevant.
- Use two meaningful blanks per story. Don’t ask for arbitrary numbers or a word that is revealed by the headline, another sentence, or the other blank.
- Give three plausible choices with one correct answer, and vary the correct position.
- After the guess, add an explanation that gives useful context. Link the reporting that supports the story.
- Read each completed story for sentence order, grammar, punctuation, and natural flow. Avoid fragments around blanks and the “X, not Y” sentence pattern.
- Cover significant disasters when they are in the news. Include verified location and magnitude when relevant, and describe rescue, relief, or recovery efforts underway. Never make death, injury, or casualty counts into blanks or scores, and avoid graphic details.

These checks catch structural and source-link problems; they cannot guarantee that every generated statement is correct. The workflow is designed to fail closed when its checks do not pass.

## Project files

- index.html — public entry page.
- news-game.js — daily stories, choices, explanations, sources, and game behavior.
- news-game.css — responsive game layout.
- scripts/publish_daily_edition.py — headline discovery, web research, story generation, checks, and edition preparation.
- .github/workflows/morning-candidates.yml — scheduled and manual publishing workflow.
- editorial.html — earlier private cartoon archive desk retained during the product pivot.

The game saves daily completion and streak in the current browser. Results can be shared and compared anonymously; there is no account-based leaderboard.
