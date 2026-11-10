# Your Daily News Game · India

A short daily game that helps readers understand the news by actively recalling the details that matter. Play the live site at [Your Daily News Game · India](https://aditics99.github.io/daily-news-game-india/).

## How the daily edition is made

A GitHub Actions workflow runs every morning at **7:00 AM India time**. It gathers English-language India news headlines from Google News RSS feeds, ranks and deduplicates the leads, and posts a review shortlist of up to 25 candidates as a GitHub issue. The workflow can also be started manually from the repository’s **Actions → Morning India news candidates** page.

This is a discovery aid, not an automatic publisher. An editor still needs to verify the reporting, select the day’s strongest stories, write the game copy and explanations, and update news-game.js. The public site is a static GitHub Pages app; candidate collection does not change the live edition.

## Editorial rules

Use these checks for every story and every daily update:

- **Be specific.** Include the relevant people, places, dates, decisions, organizations, and numbers. Say what happened and why it matters; don’t leave the reader with a vague headline or unexplained allegation.
- **Write simply and naturally.** Use short, conversational sentences. Explain unfamiliar terms in plain language, with a quick real-life example when it helps. Attribute allegations and estimates to the source making them.
- **Give enough context.** A reader should understand the event and its stakes without having to Google basic background. Include the practical consequence, what happens next, or a response underway when relevant.
- **Make two useful blanks per story.** Test a meaningful fact or connection, not an arbitrary number or obvious word. Each answer must make sense in its sentence.
- **Don’t give away an answer elsewhere.** Check the headline, both blanks, the remaining story text, and the explanation together. If another sentence repeats or strongly signals the answer, rewrite the blank or the story.
- **Keep the choices fair.** Provide three distinct, plausible choices with one correct answer. Vary where the correct option appears; never make the first choice correct every time.
- **Explain after the guess.** Give a short, clear explanation that adds context instead of merely repeating the answer. Put source links next to the claims they support.
- **Read the completed story aloud.** Fill in both correct answers and check grammar, sentence order, punctuation, and transitions. No sentence should end abruptly before a blank or leave a dangling phrase after it.
- **Cover disasters sensitively when they are significant news.** An earthquake story can include its verified magnitude and location, plus relief or rescue work underway. Do not use deaths, injuries, casualty counts, or graphic details as blanks, scores, or trivia. Attribute changing figures and include useful response context without sensationalizing suffering.

## How to update the game

Edit the stories in news-game.js, then commit the change to main; GitHub Pages publishes the updated site. Keep each story’s prose in one complete copy string with {{1}} and {{2}} markers so blanks stay in the right sentence order. Each blank needs three unique choices and exactly one correct option. The app checks this structure and withholds an edition if it is malformed.

The game remembers a completed day and streak in the current browser. Results can be shared, but there is no account-based leaderboard.

## Project files

- index.html — public entry page.
- news-game.js — stories, choices, explanations, sources, and structural checks.
- news-game.css — responsive game layout and styling.
- .github/workflows/morning-candidates.yml — scheduled candidate shortlist workflow.
- scripts/collect_candidates.py — English India headline discovery, deduplication, and ranking.
- editorial.html — earlier private cartoon archive desk, retained during the product pivot.
