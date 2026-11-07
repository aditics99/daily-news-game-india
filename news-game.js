const edition = {
  date: "2026-11-07",
  stories: [
    {
      section: "Air & daily life",
      headline: "Pollution curbs tighten across Delhi-NCR",
      before: "The Commission for Air Quality Management has activated ",
      answer: "Stage III of GRAP",
      options: ["Stage III of GRAP", "Stage II of GRAP", "Stage IV of GRAP"],
      after: " across Delhi-NCR. Across Delhi and several NCR districts, schools through Class 5 must offer ",
      before2: "",
      answer2: "hybrid classes",
      options2: ["hybrid classes", "holiday classes", "night classes"],
      after2: ", so families can choose between online and in-person learning.",
      explanation: "GRAP is Delhi-NCR’s emergency rulebook for air pollution. Its restrictions increase as the air gets worse. Stage III also pauses most construction and demolition. CAQM activated it on November 6.",
      sources: [
        { label: "CAQM · orders and air quality", url: "https://caqm.nic.in/" },
        { label: "Akashvani · Stage III invoked", url: "https://newsonair.gov.in/caqm-in-ncr-and-adjoining-areas-invoked-stage-3-of-grap-with-immediate-effect/" },
        { label: "India Today · school classes", url: "https://www.indiatoday.in/education-today/news/story/delhi-ncr-schools-hybrid-classes-grap-stage-3-air-pollution-3033902-2026-11-06" }
      ]
    },
    {
      section: "Democracy",
      headline: "EC offers another chance to people missing from draft voter lists",
      before: "The Election Commission has asked officials in seven places to give eligible people left out of draft voter lists fresh ",
      answer: "enumeration forms",
      options: ["enumeration forms", "polling slips", "party forms"],
      after: " so they can update their details. People who have moved should attach ",
      before2: "",
      answer2: "address proof",
      options2: ["address proof", "a party letter", "a new voter card"],
      after2: " such as a recent utility bill or bank passbook when they submit the form.",
      explanation: "SIR means Special Intensive Revision: a check of voter lists. The fresh forms are for eligible people whose earlier form was not returned. This round covers Delhi, Maharashtra, Haryana, Andhra Pradesh, Jharkhand, Telangana and Nagaland. The draft list can still be corrected before it becomes final.",
      source: { label: "NDTV · fresh chance for voters", url: "https://www.ndtv.com/india-news/second-chance-for-voters-left-out-of-draft-sir-rolls-in-delhi-maharashtra-haryana-andhra-pradesh-jharkhand-telangana-and-nagaland-12293562?pfrom=top_widget_trending" }
    },
    {
      section: "Business & money",
      headline: "CBI opens a case into an alleged retail-loan fraud",
      before: "The CBI filed a case against Future Retail and its promoters after a complaint from the ",
      answer: "State Bank of India",
      options: ["State Bank of India", "Reserve Bank of India", "NABARD"],
      after: ". The agency alleges loan money was moved through connected companies instead of being used for its approved purposes. An FIR starts an ",
      before2: "; it is not a court finding of guilt.",
      answer2: "investigation",
      options2: ["investigation", "conviction", "sentencing"],
      after2: "",
      explanation: "Future Retail ran stores including Big Bazaar. The CBI says SBI complained that loan money may have been diverted through connected companies. An FIR starts an investigation; a court has not yet decided whether anyone is guilty.",
      source: { label: "Business Standard · CBI case", url: "https://www.business-standard.com/industry/news/cbi-books-kishore-biyani-future-retail-in-alleged-904-cr-bank-fraud-126110601341_1.html" }
    },
    {
      section: "Getting around",
      headline: "Delhi Metro changes its Sunday schedule for Diwali",
      before: "On Diwali, first trains on the Pink, Magenta and ",
      answer: "Grey",
      options: ["Grey", "Yellow", "Blue"],
      after: " lines start from their terminal stations an hour earlier than usual. Across all lines, including the Airport Express, the last train leaves a terminal at ",
      before2: ". The usual last departure is 11 pm.",
      answer2: "10 pm",
      options2: ["10 pm", "9 pm", "midnight"],
      after2: "",
      explanation: "A terminal is the end of a metro line. DMRC’s time is the last departure from a terminal, not necessarily the last train time at your station. The Pink, Magenta and Grey lines also start an hour earlier.",
      source: { label: "Delhi Metro · Diwali schedule", url: "https://delhimetrorail.com/pages/en/pressrelease_details/last-metro-train-service-to-commence-at-1000-pm-4" }
    },
    {
      section: "Science & technology",
      headline: "India sets a target to cut new junk in orbit",
      before: "Under its Debris Free Space Mission, India wants government agencies and private space companies to stop adding new orbital debris by ",
      answer: "2030",
      options: ["2030", "2035", "2040"],
      after: ". This means future missions should leave less broken equipment circling Earth. Old satellites and rocket pieces can threaten working spacecraft. The target covers ",
      before2: "",
      answer2: "government and private missions",
      options2: ["government and private missions", "only ISRO missions", "only foreign missions"],
      after2: ".",
      explanation: "Orbital debris is abandoned satellites and rocket pieces circling Earth. Think of a busy road: a broken object left in orbit can hit spacecraft that still work. India’s mission aims to prevent both government and private space activity from adding new debris by 2030.",
      source: { label: "NDTV · India’s Swachh Space plan", url: "https://www.ndtv.com/india-news/swachh-space-indias-plan-to-clean-up-its-orbital-trash-by-2030-12289848" }
    }
  ]
};


const app = document.querySelector("#app");
const savedKey = "explain-that-india-daily-v1";
const progressKey = "explain-that-india-streak-v1";
const today = edition.date;
const blankState = () => ({ index: 0, answers: [], secondAnswers: [], revealed: false, score: 0, finished: false });
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
  const answer = state.answers[state.index] || ""; const answer2 = state.secondAnswers[state.index] || "";
  const correct = answer === current.answer && answer2 === current.answer2;
  const progress = edition.stories.map((_, i) => `<span class="progress-dot ${i < state.index || done ? "is-done" : i === state.index ? "is-current" : ""}" aria-label="Story ${i + 1}${i < state.index || done ? ", complete" : i === state.index ? ", current" : ""}"></span>`).join("");
  const displayStory = `${escapeHTML(current.before)}${state.revealed ? `<span class="answer-reveal ${correct ? "is-correct" : "is-wrong"}">${escapeHTML(current.answer)}</span>` : `<span class="select-wrap">${selectHTML(current, answer, 1)}</span>`}${escapeHTML(current.after)}${escapeHTML(current.before2)}${state.revealed ? `<span class="answer-reveal ${correct ? "is-correct" : "is-wrong"}">${escapeHTML(current.answer2)}</span>` : `<span class="select-wrap">${selectHTML(current, answer2, 2)}</span>`}${escapeHTML(current.after2)}`;

  app.innerHTML = `
    <div class="page">
      <header class="masthead">
        <a class="brand" href="./">Your Daily News Game<span>· India</span></a>
        <div class="streak" aria-label="${streak} day streak"><span class="streak-fire">✳</span><strong>${streak}</strong><span>day streak</span></div>
      </header>
      <main class="content">
        <p class="kicker">${dateLabel()} <span>·</span> India edition</p>
        <h1>Daily news for the <mark>dopamine-fried</mark> brain.</h1>

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
            ` : `<button class="primary-button" type="button" data-check ${answer && answer2 ? "" : "disabled"}>Lock it in<span>→</span></button>`}
          `}
        </section>

      </main>
      <footer class="footer"><span>Your Daily News Game · India</span><button class="about-link" type="button" data-about>About</button></footer><dialog class="about-dialog" data-about-dialog aria-labelledby="about-title"><form method="dialog" class="about-dialog__form"><button class="about-close" aria-label="Close about">×</button></form><p class="about-kicker">WHY A NEWS GAME?</p><h2 id="about-title">A little effort helps it stick.</h2><p>Trying to remember a detail is called retrieval practice. The dropdowns give you choices, so this is guided recall. Then the explanation adds context.</p></dialog>
    </div>`;

  app.querySelector("[data-about]")?.addEventListener("click", () => app.querySelector("[data-about-dialog]")?.showModal()); app.onchange = (event) => { if (!event.target.matches("[data-answer]")) return;
    const answerKey = event.target.dataset.answer === "2" ? "secondAnswers" : "answers"; state[answerKey][state.index] = event.target.value;
    saveState();
    render();
    app.querySelector(`[data-answer="${event.target.dataset.answer}"]`)?.focus(); };
  app.querySelector("[data-check]")?.addEventListener("click", () => {
    if (!state.answers[state.index] || !state.secondAnswers[state.index]) return;
    state.revealed = true;
    if (state.answers[state.index] === current.answer && state.secondAnswers[state.index] === current.answer2) state.score++;
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
function selectHTML(story, value, number=1) { const options = number === 1 ? story.options : story.options2;
  return `<select class="blank-select" data-answer="${number}" aria-label="Choose the missing words"><option value="" ${value ? "" : "selected"} disabled>choose one</option>${options.map((option) => `<option value="${escapeHTML(option)}" ${value === option ? "selected" : ""}>${escapeHTML(option)}</option>`).join("")}</select>`;
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
