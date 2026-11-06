const edition = {
  date: "2026-11-06",
  stories: [
    {
      section: "Democracy",
      headline: "Voter rolls are being revised in six more states and Union Territories",
      before: "The Election Commission has started a voter-list revision in six more states and Union Territories. Eligible voters can add or correct their details before the",
      after: " are published.",
      answer: "updated voter lists",
      options: ["updated voter lists", "election results", "new constituency maps"],
      explanation: "The revision covers Arunachal Pradesh, Chandigarh, Dadra and Nagar Haveli and Daman and Diu, Mizoram, Odisha and Sikkim. It gives people a chance to check that their voter details are correct.",
      source: { label: "All India Radio · voter roll revision", url: "https://newsonair.gov.in/ec-announces-special-summary-revision-of-electoral-rolls-in-four-states-and-two-uts/" }
    },
    {
      section: "India & its neighbours",
      headline: "India offers help to Nepal after floods",
      before: "During talks in Kathmandu, India said it was ready to help Nepal repair infrastructure damaged by",
      after: ". The two sides also discussed energy ties.",
      answer: "floods",
      options: ["floods", "a power shortage", "an earthquake"],
      explanation: "The offer came as India and Nepal discussed cooperation ahead of Nepal’s prime minister’s expected visit to India. Roads and other infrastructure matter for trade and daily travel between the neighbours.",
      source: { label: "The Economic Times · India–Nepal talks", url: "https://economictimes.indiatimes.com/news/india/india-ready-to-help-nepal-rebuild-flood-hit-infra-deepen-energy-ties/articleshow/135584667.cms?from=mdr" }
    },
    {
      section: "Money & resources",
      headline: "India opens a new round of critical-mineral auctions",
      before: "The Ministry of Mines has put 20 critical-mineral blocks up for auction. A block is a mapped area where surveys suggest a mineral deposit may be present. The same announcement also opened bidding for 11 exploration licences. Unlike a mining licence, an exploration licence lets a company",
      after: ".",
      answer: "look for mineral deposits before mining begins",
      options: ["look for mineral deposits before mining begins", "start selling finished batteries", "set prices for imported minerals"],
      explanation: "A mineral block is a defined area offered to companies under set rules. Depending on the auction, a company can get permission to explore the area or to mine it. These minerals are called critical because several industries rely on them, including clean energy, electronics and electric vehicles.",
      source: { label: "Ministry of Mines · 20 block and 11 exploration-licence auctions", url: "https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2333123&lang=2&reg=48" }
    },
    {
      section: "How Parliament works",
      headline: "Hardeep Singh Puri elected unopposed to a Rajya Sabha seat",
      before: "Hardeep Singh Puri was elected unopposed to a Rajya Sabha seat from Madhya Pradesh. For this kind of state seat, the voters are",
      after: ".",
      answer: "elected members of the state Assembly",
      options: ["elected members of the state Assembly", "all residents in a direct public vote", "members of the Lok Sabha"],
      explanation: "Rajya Sabha members representing a state are elected by that state’s elected MLAs. Puri was the only candidate left after the other nominations were rejected.",
      source: { label: "The Indian Express · Rajya Sabha election", url: "https://indianexpress.com/article/india/hardeep-singh-puri-elected-unopposed-rajya-sabha-madhya-pradesh-10952368/" }
    },
    {
      section: "Everyday India",
      headline: "New Delhi railway station plans separate routes for passengers",
      before: "New Delhi railway station is setting up separate entry and exit routes for reserved and unreserved passengers to help manage",
      after: ".",
      answer: "festival crowds",
      options: ["festival crowds", "a new metro line", "freight trains"],
      explanation: "The change is intended to make passenger movement easier during the busy Diwali and Chhath travel period. Separate routes can help reduce bottlenecks at the station.",
      source: { label: "The Indian Express · New Delhi station arrangements", url: "https://indianexpress.com/article/india/new-delhi-railway-station-separate-entry-exit-gates-diwali-chhath-puja-10952299/" }
    }
  ]
};

const app = document.querySelector("#app");
const savedKey = "explain-that-india-daily-v1";
const progressKey = "explain-that-india-streak-v1";
const today = edition.date;
const blankState = () => ({ index: 0, answers: [], revealed: false, score: 0, finished: false });
let state = loadState();

function istDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(savedKey) || "null");
    return saved?.date === today ? { ...blankState(), ...saved.state } : blankState();
  } catch { return blankState(); }
}
function saveState() {
  try { localStorage.setItem(savedKey, JSON.stringify({ date: today, state })); } catch { /* progress is optional */ }
}
function getDates() {
  try { return JSON.parse(localStorage.getItem(progressKey) || "[]"); } catch { return []; }
}
function getStreak(dates = getDates()) {
  const sorted = [...new Set(dates)].sort();
  if (!sorted.length) return 0;
  const last = sorted[sorted.length - 1];
  const diff = (new Date(`${today}T00:00:00Z`) - new Date(`${last}T00:00:00Z`)) / 86400000;
  if (diff > 1 || diff < 0) return 0;
  let streak = 0;
  let cursor = diff === 0 ? today : last;
  const set = new Set(sorted);
  while (set.has(cursor)) {
    streak++;
    const prev = new Date(`${cursor}T00:00:00Z`);
    prev.setUTCDate(prev.getUTCDate() - 1);
    cursor = prev.toISOString().slice(0, 10);
  }
  return streak;
}
function markComplete() {
  const dates = new Set(getDates());
  dates.add(today);
  try { localStorage.setItem(progressKey, JSON.stringify([...dates].sort())); } catch { /* progress is optional */ }
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
function dateLabel() {
  return new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "long" }).format(new Date(`${today}T12:00:00+05:30`));
}
function render() {
  const streak = getStreak();
  const current = edition.stories[Math.min(state.index, edition.stories.length - 1)];
  const done = state.finished;
  const answer = state.answers[state.index] || "";
  const correct = answer === current.answer;
  const progress = edition.stories.map((_, i) => `<span class="progress-dot ${i < state.index || done ? "is-done" : i === state.index ? "is-current" : ""}" aria-label="Story ${i + 1}${i < state.index || done ? ", complete" : i === state.index ? ", current" : ""}"></span>`).join("");
  const displayStory = `${escapeHTML(current.before)}${state.revealed ? `<span class="answer-reveal ${correct ? "is-correct" : "is-wrong"}">${escapeHTML(current.answer)}</span>` : `<span class="select-wrap">${selectHTML(current, answer)}</span>`}${escapeHTML(current.after)}`;

  app.innerHTML = `
    <div class="page">
      <header class="masthead">
        <a class="brand" href="./">Explain That<span>· Your daily news game</span></a>
        <div class="streak" aria-label="${streak} day streak"><span class="streak-fire">✳</span><strong>${streak}</strong><span>day streak</span></div>
      </header>
      <main class="content">
        <p class="kicker">${dateLabel()} <span>·</span> India edition</p>
        <h1>Daily news for the <mark>dopamine-fried</mark> brain.</h1>
        <p class="intro">Five quick guesses. The bits worth remembering.</p>
        <section class="game-card" aria-label="Today's India news game">
          ${done ? renderFinish(streak) : `
            <div class="card-top"><span class="round-label">TODAY’S NEWS</span><span class="round-count">${String(state.index + 1).padStart(2, "0")} <i>/</i> 05</span></div>
            <div class="progress-row" aria-label="Story ${state.index + 1} of 5">${progress}</div>
            <p class="category">${escapeHTML(current.section)}</p>
            <h2 class="story-heading">${escapeHTML(current.headline)}</h2>
            <p class="story-copy">${displayStory}</p>
            ${state.revealed ? `
              <div class="feedback ${correct ? "is-right" : "is-not-right"}" aria-live="polite">
                <p class="feedback-title">${correct ? "You got it." : "Here’s the missing piece."}</p>
                <p>${escapeHTML(current.explanation)}</p>
                <a class="source-link" href="${escapeHTML(current.source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(current.source.label)} ↗</a>
              </div>
              <button class="primary-button" type="button" data-next>${state.index === edition.stories.length - 1 ? "See my score" : "Next story"}<span>→</span></button>
            ` : `<button class="primary-button" type="button" data-check ${answer ? "" : "disabled"}>Lock it in<span>→</span></button>`}
          `}
        </section>
        <p class="social-nudge">A little news, a little game. <span>Send today’s edition to your group chat →</span></p>
      </main>
      <footer class="footer"><span>Explain That · Your daily news game</span><span>Hand-picked for today</span></footer>
    </div>`;

  app.querySelector("[data-answer]")?.addEventListener("change", (event) => {
    state.answers[state.index] = event.target.value;
    saveState();
    render();
    app.querySelector("[data-answer]")?.focus();
  });
  app.querySelector("[data-check]")?.addEventListener("click", () => {
    if (!state.answers[state.index]) return;
    state.revealed = true;
    if (state.answers[state.index] === current.answer) state.score++;
    saveState();
    render();
  });
  app.querySelector("[data-next]")?.addEventListener("click", () => {
    if (state.index === edition.stories.length - 1) {
      state.finished = true;
      markComplete();
    } else {
      state.index++;
      state.revealed = false;
    }
    saveState();
    render();
  });
  app.querySelector("[data-share]")?.addEventListener("click", shareResult);
  app.querySelector("[data-replay]")?.addEventListener("click", () => {
    state = blankState();
    saveState();
    render();
  });
}
function selectHTML(story, value) {
  return `<select class="blank-select" data-answer aria-label="Choose the missing words"><option value="" ${value ? "" : "selected"} disabled>choose one</option>${story.options.map((option) => `<option value="${escapeHTML(option)}" ${value === option ? "selected" : ""}>${escapeHTML(option)}</option>`).join("")}</select>`;
}
function renderFinish(streak) {
  return `<div class="finish-card">
    <p class="finish-kicker">YOU MADE IT THROUGH TODAY’S INDIA EDITION</p>
    <h2>${state.score}<span> / 5</span></h2>
    <p class="finish-copy">stories in your head now.<br><strong>That’s a ${streak}-day streak.</strong></p>
    <div class="finish-actions"><button class="share-button" type="button" data-share>Share your score <span>↗</span></button><button class="replay-button" type="button" data-replay>Play again</button></div>
    <p class="share-feedback" data-share-feedback aria-live="polite"></p>
    <p class="streak-note">Your streak is saved on this device. Come back tomorrow to keep it going.</p>
  </div>`;
}
async function shareResult() {
  const message = `I got ${state.score}/5 on Explain That · India today, and I’m on a ${getStreak()}-day streak. Can you beat me? ${location.href}`;
  const feedback = app.querySelector("[data-share-feedback]");
  try {
    if (navigator.share) {
      await navigator.share({ title: "Explain That · Your daily news game", text: message });
      feedback.textContent = "Your score is ready to share.";
    } else {
      await navigator.clipboard.writeText(message);
      feedback.textContent = "Copied. Send it to your group chat.";
    }
  } catch (error) {
    if (error?.name === "AbortError") return;
    try {
      await navigator.clipboard.writeText(message);
      feedback.textContent = "Copied. Send it to your group chat.";
    } catch {
      feedback.textContent = "Sharing isn’t available here. Try again in your browser.";
    }
  }
}

render();
