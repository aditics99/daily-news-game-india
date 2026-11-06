const edition = {
  date: "2026-11-06",
  stories: [
    {
      section: "Democracy",
      headline: "Election Commission starts voter-list updates in four states and two UTs",
      before: "The Election Commission has started updating voter lists in Arunachal Pradesh, Mizoram, Odisha, Sikkim and two Union Territories. Eligible voters can check their details and",
      after: " before the updated lists are finalized.",
      answer: "ask for corrections",
      options: ["ask for corrections", "cast their vote early", "choose a political party"],
      explanation: "For example, if your name or other details are wrong on the list, you can ask for them to be corrected. The two Union Territories are Chandigarh and Dadra and Nagar Haveli and Daman and Diu.",
      source: { label: "Akashvani · voter-list update", url: "https://newsonair.gov.in/ec-announces-special-summary-revision-of-electoral-rolls-in-four-states-and-two-uts/" }
    },
    {
      section: "India & its neighbours",
      headline: "India offers Nepal help after Bhotekoshi floods",
      before: "During talks in Kathmandu, India’s Foreign Secretary, ",
      after: ", said India was ready to help Nepal repair infrastructure damaged by the Bhotekoshi floods. The two sides also discussed electricity trade. Nepal PM Balen Shah is expected to visit India from November 22.",
      answer: "Vikram Misri",
      options: ["Vikram Misri", "Amrit Bahadur Rai", "Shisir Khanal"],
      explanation: "Vikram Misri is India’s Foreign Secretary, the senior civil servant handling foreign relations. In 2024, India and Nepal agreed to work towards Nepal exporting up to 10,000 MW of electricity to India over ten years. MW measures how much power can be supplied at a time; this is a long-term target, not electricity arriving all at once. Repairing a damaged road, for example, can help local people travel and move goods. In 2024, India and Nepal agreed to work towards Nepal exporting up to 10,000 MW of electricity to India over ten years. MW measures how much power can be supplied at a time; this is a long-term target, not electricity arriving all at once. Repairing a damaged road, for example, can help local people travel and move goods.",
      sources: [
        { label: "The Kathmandu Post · flood-repair offer", url: "https://kathmandupost.com/national/2026/11/04/vikram-misri-says-india-ready-to-help-nepal-s-flood-hit-infrastructure" },
        { label: "PIB · India–Nepal power agreement", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2099131&lang=2&reg=3" },
        { label: "The Indian Express · Balen Shah’s India visit", url: "https://indianexpress.com/article/india/nepal-pm-balendra-shah-india-november-22-visit-10952770/" }
      ]
    },
    {
      section: "Money & resources",
      headline: "India puts 20 mineral blocks up for auction",
      before: "India is looking for more minerals used in batteries, electronics and clean-energy equipment. On November 5, the Ministry of Mines opened the",
      after: ", an online auction offering 20 critical-mineral blocks across eight states. Chhattisgarh has five, including bauxite and the Gohirapali Glauconite Block; Rajasthan has three, including tungsten. A separate round offers 11 exploration licences.",
      answer: "Ninth Tranche",
      options: ["Ninth Tranche", "Eighth Tranche", "Third Tranche"],
      explanation: "A tranche is one round of auctions. Here, companies bid online for rights to explore or mine mapped areas where these minerals may be found. The 11 exploration licences are different: they let a company search, but not start mining. Think of it like checking what is underground before deciding whether a site is worth developing.",
      sources: [
        { label: "Ministry of Mines · Ninth Tranche announcement", url: "https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2333123&lang=2&reg=48" },
        { label: "The Hindu · 20-block auction", url: "https://www.thehindu.com/business/Economy/ninth-tranche-of-mineral-block-auctions-offers-20-blocks/article71671174.ece" },
        { label: "GSI · Gohirapali glauconite block", url: "https://mines.gov.in/webportal/content/gtwogthreereport" }
      ]
    },
    {
      section: "How Parliament works",
      headline: "BJP minister Hardeep Singh Puri elected unopposed from Madhya Pradesh",
      before: "Hardeep Singh Puri, a BJP leader and Union Petroleum Minister, was elected to the Rajya Sabha from Madhya Pradesh",
      after: " after two rival nominations were rejected, leaving him as the only candidate. State MLAs elect Rajya Sabha members; voters do not vote for them directly.",
      answer: "unopposed",
      options: ["unopposed", "in a public vote", "by the Lok Sabha"],
      explanation: "‘Unopposed’ means no vote was needed: rival nominations were rejected, leaving Puri as the only candidate. He is a BJP leader and India’s Petroleum Minister. He previously led the Housing and Urban Affairs Ministry. One nationwide initiative from that ministry, PM SVANidhi, gives street vendors small loans to buy stock for their stalls. It is not specific to Madhya Pradesh.",
      sources: [{ label: "The Indian Express · Rajya Sabha election", url: "https://indianexpress.com/article/india/hardeep-singh-puri-elected-unopposed-rajya-sabha-madhya-pradesh-10952368/" }, { label: "PIB · PM SVANidhi and street-vendor loans", url: "https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=2006580&lang=2&reg=48" }]
    },
    {
      section: "Everyday India",
      headline: "New Delhi station separates routes for reserved and general-ticket passengers",
      before: "During the Diwali and Chhath rush, New Delhi railway station is sending passengers with reserved tickets and general tickets through",
      after: ". The aim is to reduce crowding at busy entry points and on platforms.",
      answer: "different gates",
      options: ["different gates", "different trains", "separate ticket counters"],
      explanation: "Reserved tickets include Sleeper and AC classes; general tickets do not reserve a seat. Separate gates and one-way routes can reduce bottlenecks, like separate queues at a busy venue. Signs will help passengers find the right gate.",
      source: { label: "The Indian Express · New Delhi station arrangements", url: "https://indianexpress.com/article/india/new-delhi-railway-station-separate-entry-exit-gates-diwali-chhath-puja-10952299/" }
    },
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
        <a class="brand" href="./">Your Daily News Game<span>· India</span></a>
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
                ${(current.sources || [current.source]).map((source) => `<a class="source-link" href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.label)} ↗</a>`).join("")}
              </div>
              <button class="primary-button" type="button" data-next>${state.index === edition.stories.length - 1 ? "See my score" : "Next story"}<span>→</span></button>
            ` : `<button class="primary-button" type="button" data-check ${answer ? "" : "disabled"}>Lock it in<span>→</span></button>`}
          `}
        </section>
        <p class="social-nudge">A little news, a little game. <span>Send today’s edition to your group chat →</span></p>
      </main>
      <footer class="footer"><span>Your Daily News Game · India</span><span>Hand-picked for today</span></footer>
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
  const message = `I got ${state.score}/5 on Your Daily News Game · India today, and I’m on a ${getStreak()}-day streak. Can you beat me? ${location.href}`;
  const feedback = app.querySelector("[data-share-feedback]");
  try {
    if (navigator.share) {
      await navigator.share({ title: "Your Daily News Game · India", text: message });
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
