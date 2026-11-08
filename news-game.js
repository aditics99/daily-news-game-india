const edition = {
  date: "2026-11-08",
  stories: [
    { section: "Air & daily life", headline: "Pollution curbs tighten across Delhi-NCR", before: "The Commission for Air Quality Management has activated ", answer: "Stage III of GRAP", options: ["Stage II of GRAP", "Stage III of GRAP", "Stage IV of GRAP"], after: " across Delhi-NCR. Across Delhi and several NCR districts, schools through Class 5 must offer ", before2: "", answer2: "hybrid classes", options2: ["holiday classes", "night classes", "hybrid classes"], after2: ", so families can choose between online and in-person learning.", explanation: "GRAP is Delhi-NCR’s emergency rulebook for air pollution. Its restrictions increase as the air gets worse. Stage III also pauses most construction and demolition. CAQM activated it on November 6.", sources: [{ label: "CAQM · orders and air quality", url: "https://caqm.nic.in/" }, { label: "Akashvani · Stage III invoked", url: "https://newsonair.gov.in/caqm-in-ncr-and-adjoining-areas-invoked-stage-3-of-grap-with-immediate-effect/" }, { label: "India Today · school classes", url: "https://www.indiatoday.in/education-today/news/story/delhi-ncr-schools-hybrid-classes-grap-stage-3-air-pollution-3033902-2026-11-06" }] },
    { section: "Democracy", headline: "EC offers another chance to people missing from draft voter lists", before: "The Election Commission has asked officials in seven places to give eligible people left out of draft voter lists fresh ", answer: "enumeration forms", options: ["polling slips", "enumeration forms", "party forms"], after: " so they can update their details. People who have moved should attach ", before2: "", answer2: "address proof", options2: ["a party letter", "a new voter card", "address proof"], after2: " such as a recent utility bill or bank passbook when they submit the form.", explanation: "SIR means Special Intensive Revision: a check of voter lists. The fresh forms are for eligible people whose earlier form was not returned. This round covers Delhi, Maharashtra, Haryana, Andhra Pradesh, Jharkhand, Telangana and Nagaland. The draft list can still be corrected before it becomes final.", source: { label: "NDTV · fresh chance for voters", url: "https://www.ndtv.com/india-news/second-chance-for-voters-left-out-of-draft-sir-rolls-in-delhi-maharashtra-haryana-andhra-pradesh-jharkhand-telangana-and-nagaland-12293562?pfrom=top_widget_trending" } },
    { section: "Business & money", headline: "CBI opens a case into an alleged retail-loan fraud", before: "The CBI opened a case after a complaint by the ", answer: "State Bank of India", options: ["Reserve Bank of India", "State Bank of India", "NABARD"], after: ". It alleges that loan money was routed through ", before2: "", answer2: "connected companies", options2: ["connected companies", "retail stores", "government departments"], after2: ". Investigators say they are still tracing what the money was ultimately used for.", explanation: "Future Retail ran stores including Big Bazaar. The CBI alleges that loan money was diverted through connected companies. The reports do not yet say what it ultimately paid for; the CBI says tracing the money’s end use is still part of its investigation. An FIR opens a case, but it is not a court finding of guilt.", source: { label: "Business Standard · CBI case", url: "https://www.business-standard.com/industry/news/cbi-books-kishore-biyani-future-retail-in-alleged-904-cr-bank-fraud-126110601341_1.html" } },
    { section: "Getting around", headline: "Delhi Metro changes its Sunday schedule for Diwali", before: "On Diwali, first trains on the Pink, Magenta and ", answer: "Grey", options: ["Yellow", "Grey", "Blue"], after: " lines leave their terminal stations at 6 am. On a regular Sunday, the first train on these lines starts at ", before2: "", answer2: "7 am", options2: ["8 am", "6 am", "7 am"], after2: ".", explanation: "DMRC brought the first trains on these three lines forward by an hour for Diwali: 6 am instead of 7 am. A terminal is the end of a line. Across all lines, the last train left its terminal at 10 pm that day, instead of the usual 11 pm; that doesn’t mean every station had a train until 10 pm.", source: { label: "Delhi Metro · Diwali schedule", url: "https://delhimetrorail.com/pages/en/pressrelease_details/last-metro-train-service-to-commence-at-1000-pm-4" } },
    { section: "Science & technology", headline: "India sets a target to cut new junk in orbit", before: "Under its Debris Free Space Mission, India wants government agencies and private space companies to stop adding new orbital debris by ", answer: "2030", options: ["2035", "2040", "2030"], after: ". This means future missions should leave less broken equipment circling Earth. Old satellites and rocket pieces can threaten working spacecraft. The target covers ", before2: "", answer2: "government and private missions", options2: ["only ISRO missions", "government and private missions", "only foreign missions"], after2: ".", explanation: "Orbital debris is abandoned satellites and rocket pieces circling Earth. Think of a busy road: a broken object left in orbit can hit spacecraft that still work. India’s mission aims to prevent both government and private space activity from adding new debris by 2030.", source: { label: "NDTV · India’s Swachh Space plan", url: "https://www.ndtv.com/india-news/swachh-space-indias-plan-to-clean-up-its-orbital-trash-by-2030-12289848" } }
  ]
};


const app = document.querySelector("#app");
const savedKey = "explain-that-india-daily-v1";
const progressKey = "explain-that-india-streak-v1";
const today = edition.date;
const blankState = () => ({ index: 0, answers: [], secondAnswers: [], revealed: false, revealedCorrect: false, score: 0, finished: false });
let state = blankState();

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
  const correct = state.revealed ? state.revealedCorrect === true : answer === current.answer && answer2 === current.answer2;
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
                <div class="source-list"><p class="source-list-title">Sources</p>${(current.sources || [current.source]).map((source) => `<a class="source-link" href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.label)} ↗</a>`).join("")}</div>
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
    const selectedAnswers = [...app.querySelectorAll("[data-answer]")].sort((a, b) => Number(a.dataset.answer) - Number(b.dataset.answer)).map((select) => select.value); if (!selectedAnswers[0] || !selectedAnswers[1]) return; state.answers[state.index] = selectedAnswers[0]; state.secondAnswers[state.index] = selectedAnswers[1];
    state.revealedCorrect = selectedAnswers[0] === current.answer && selectedAnswers[1] === current.answer2; state.revealed = true;
    if (state.revealedCorrect) state.score++;
    saveState();
    render();
  });
  app.querySelector("[data-next]")?.addEventListener("click", () => {
    if (state.index === edition.stories.length - 1) {
      state.finished = true;
      markComplete();
    } else {
      state.index++;
      state.revealed = false; state.revealedCorrect = false;
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
    <p class="finish-copy">stories in your head now.<br><strong>That’s a ${streak}-day streak.</strong></p><div class="finish-recap"><p class="finish-summary">Delhi-NCR tightened pollution curbs, and the Election Commission reopened voter-list forms. A CBI case is tracing Future Retail loans; Delhi Metro adjusted Diwali hours, and India set a 2030 target to limit new space debris.</p><h3>More interesting things today</h3><ul><li><a href="https://indianexpress.com/article/india/pm-modi-chhattisgarh-bastar-diwali-celebration-security-forces-10955301/" target="_blank" rel="noopener noreferrer">PM Modi is celebrating Diwali with security forces in Bastar.</a></li><li><a href="https://timesofindia.indiatimes.com/sports/more-sports/others/taniya-scripts-history-indias-first-ever-beach-wrestling-medallist-at-youth-olympics-with-silver-in-dakar/amp_articleshow/135649880.cms" target="_blank" rel="noopener noreferrer">Wrestler Taniya won India’s first Youth Olympics beach-wrestling medal: silver in the 75 kg event.</a></li><li><a href="https://indianexpress.com/article/india/il-76-heavy-lift-aircraft-lands-nyoma-airbase-10954937/lite/" target="_blank" rel="noopener noreferrer">An Indian Air Force transport plane landed at Nyoma, Ladakh, at 13,629 feet—its highest landing yet.</a></li></ul></div>
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
