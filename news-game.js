const edition = {
  date: "2026-11-09",
  stories: [
    { section: "Air & daily life", headline: "Delhi’s air slips back into the ‘very poor’ range", before: "On Monday morning, Delhi’s average AQI was 376, while some monitors crossed 400. Diwali firework smoke mixed with the city’s usual traffic and construction pollution. The air can stay trapped near the ground in ", answer: "stagnant weather", options: ["dry weather", "stagnant weather", "windy weather"], after: ". Another seasonal source is smoke from crop-residue fires in ", before2: "; that pollution can travel into the region. ", answer2: "Punjab and Haryana", options2: ["Gujarat and Maharashtra", "Uttar Pradesh and Bihar", "Punjab and Haryana"], after2: ".", explanation: "At 7 am, Delhi’s citywide reading was in the ‘very poor’ range, though several local monitors were in the more serious ‘severe’ range. Fireworks add to traffic, construction dust and smoke from farm fires; still air lets pollution build up. AQI is a daily scale for how polluted the air is, not a measure of how much pollution one person has breathed.", sources: [{ label: "Hindustan Times · Monday morning AQI", url: "https://www.hindustantimes.com/india-news/ht-morning-news-brief-november-9-delhi-aqi-diwali-nvidia-ceo-jensen-huang-affair-trump-us-iran-war-vinod-kapri-youth-olympics-101794193526397-amp.html" }, { label: "Associated Press · pollution sources", url: "https://apnews.com/article/india-new-delhi-pollution-diwali-air-quality-f3ba17c93d6fb0898392dce06ca4d776" }] },
    { section: "How Parliament works", headline: "Parliament’s monsoon session is still formally open", before: "Both Houses stopped meeting on August 13, but the session has not been formally ", answer: "prorogued", options: ["recounted", "prorogued", "dissolved"], after: ". That formal step ends a session. Keeping it open means MPs could return with shorter notice than for a ", before2: ". No return date has been announced.", answer2: "fresh session", options2: ["budget speech", "confidence vote", "fresh session"], after2: ".", explanation: "The session has remained open for 88 days, a record. Adjournment stops scheduled sittings; prorogation formally ends the session. If the government calls a special sitting within this session, the reported notice period is two days, compared with 14 days for a fresh session. Talk of a vote on women’s reservation is speculation; no reconvening has been announced.", source: { label: "India Today · why the session remains open", url: "https://www.indiatoday.in/india/story/parliament-monsoon-session-unprorogued-record-88-days-special-sitting-ptag-3035068-2026-11-09" } },
    { section: "Health & money", headline: "Price cuts begin for 137 cancer medicines", before: "The National Pharmaceutical Pricing Authority (NPPA) has capped the ", answer: "trade margin", options: ["GST rate", "trade margin", "import duty"], after: " on 137 cancer medicines. This is the amount added along the supply chain before a medicine reaches a patient. The new prices took effect today; patients can check updated prices on the ", before2: ".", answer2: "Pharma Sahi Daam app", options2: ["Pharma Sahi Daam app", "Aarogya Setu app", "CoWIN app"], after2: ".", explanation: "The cap is 30% of the maximum retail price for these medicines. The government says reductions vary by product and can reach 70%; it is not a flat 70% cut on every medicine. NPPA’s revised price lists are also available online, and pharmacies and hospitals must charge the new prices.", sources: [{ label: "Ministry of Chemicals & Fertilizers · order", url: "https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2324743&lang=1&reg=3" }, { label: "PIB · price changes taking effect today", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2333949&lang=1&reg=1" }] },
    { section: "Sport", headline: "Anuj Shrivatri becomes India’s 100th chess grandmaster", before: "Anuj Shrivatri, 22, is the first grandmaster from ", answer: "Madhya Pradesh", options: ["Maharashtra", "Rajasthan", "Madhya Pradesh"], after: ". He earned the title by winning a championship held in the ", before2: ".", answer2: "Philippines", options2: ["Thailand", "Philippines", "Indonesia"], after2: ".", explanation: "Shrivatri is from Katni. Grandmaster is chess’s highest title. This tournament used a special, approved format that awarded the title directly to its winner, instead of the usual route of earning norms and reaching a rating threshold.", sources: [{ label: "The Times of India · Shrivatri’s title", url: "https://timesofindia.indiatimes.com/sports/chess/anuj-shrivatri-becomes-indias-100th-chess-grandmaster/articleshow/135668616.cms" }, { label: "The Indian Express · his path to the title", url: "https://indianexpress.com/article/sports/chess/anuj-shrivatri-software-engineer-100th-grandmaster-10955915/lite/" }] },
    { section: "Fuel & transport", headline: "India’s ethanol-in-petrol dispute spreads to a second state", before: "Karnataka says its testing found some petrol samples above the permitted ethanol blend. Oil companies dispute the state’s testing and want ", answer: "joint, transparent checks", options: ["checks by each company alone", "a pause in all petrol sales", "joint, transparent checks"], after: ". Now ", before2: " has begun its own sample checks in four districts after receiving complaints. The claims are still disputed.", answer2: "Kerala", options2: ["Goa", "Kerala", "Tamil Nadu"], after2: ".", explanation: "Karnataka says tests from 67 locations found excessive blending; the oil companies say the results cannot be verified under the prescribed testing method. Kerala has ordered checks in four districts. This is an unresolved dispute: the state’s allegations are not a final independent finding about every fuel pump.", sources: [{ label: "The Economic Times · companies seek joint testing", url: "https://economictimes.indiatimes.com/news/politics-and-nation/karnataka-to-release-report-on-alleged-excess-ethanol-in-petrol-on-monday-omcs-seek-joint-testing/articleshow/135669272.cms" }, { label: "The Indian Express · Kerala begins sample checks", url: "https://indianexpress.com/article/india/karnataka-excess-ethanol-claims-kerala-inspections-sample-testing-petrol-10956218/" }] }
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
    if (state.finished) loadScoreComparison();
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
    <section class="score-comparison" data-score-comparison aria-live="polite"><h3>How did you compare?</h3><p>Loading today’s scores…</p></section><div class="finish-recap"><h3>More interesting things today</h3><ul><li><a href="https://indianexpress.com/article/explained/explained-economics/10-years-demonetisation-india-cash-currency-gdp-digital-payments-10956081/" target="_blank" rel="noopener noreferrer">A decade after demonetisation, cash in circulation has more than doubled as digital payments have grown.</a></li><li><a href="https://www.business-standard.com/cricket/news/new-zealand-vs-india-3rd-odi-playing-11-live-toss-time-ist-streaming-126110900175_1.html" target="_blank" rel="noopener noreferrer">India can seal its ODI series against New Zealand in Tuesday’s third match in Hamilton.</a></li><li><a href="https://indianexpress.com/article/india/karnataka-excess-ethanol-claims-kerala-inspections-sample-testing-petrol-10956218/" target="_blank" rel="noopener noreferrer">Kerala has started testing petrol samples in four districts after Karnataka’s claims.</a></li></ul></div>
    <div class="finish-actions"><button class="share-button" type="button" data-share>Share your score <span>↗</span></button><button class="replay-button" type="button" data-replay>Play again</button></div>
    <p class="share-feedback" data-share-feedback aria-live="polite"></p>
    <p class="streak-note">Your streak is saved on this device. Come back tomorrow to keep it going.</p>
  </div>`;
}
async function postScoreRPC(functionName, payload) {
  const config = window.EXPLAIN_THAT_SUPABASE;
  const response = await fetch(config.url + "/rest/v1/rpc/" + functionName, {
    method: "POST",
    headers: { apikey: config.publishableKey, "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Score service returned " + response.status);
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
function getPlayerId() {
  const key = "daily-news-game-player-v1";
  let id = localStorage.getItem(key);
  if (!id) {
    id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      const value = Math.floor(Math.random() * 16);
      return (char === "x" ? value : (value & 3) | 8).toString(16);
    });
    localStorage.setItem(key, id);
  }
  return id;
}
async function loadScoreComparison() {
  const panel = app.querySelector("[data-score-comparison]");
  if (!panel) return;
  const config = window.EXPLAIN_THAT_SUPABASE;
  if (!config?.url || !config?.publishableKey) {
    panel.innerHTML = "<h3>How did you compare?</h3><p>Score comparison will appear here when it’s connected.</p>";
    return;
  }
  try {
    await postScoreRPC("submit_daily_game_score", { p_edition_date: today, p_player_id: getPlayerId(), p_score: state.score });
    const rows = await postScoreRPC("get_daily_game_score_distribution", { p_edition_date: today });
    const distribution = Array.isArray(rows) ? rows : [];
    const counts = Array.from({ length: 6 }, (_, score) => Number(distribution.find((row) => Number(row.score) === score)?.player_count || 0));
    const total = counts.reduce((sum, count) => sum + count, 0);
    const lower = counts.slice(0, state.score).reduce((sum, count) => sum + count, 0);
    const tied = counts[state.score] || 0;
    const percentile = total ? Math.round(((lower + tied / 2) / total) * 100) : 0;
    const maxCount = Math.max(...counts, 1);
    const bars = counts.map((count, score) => '<div class="score-bin ' + (score === state.score ? 'is-yours' : '') + '" aria-label="' + count + ' players scored ' + score + ' out of 5"><span class="score-bin-count">' + count + '</span><span class="score-bin-bar" style="height:' + Math.max(count ? 12 : 3, (count / maxCount) * 100) + '%"></span><span class="score-bin-label">' + score + '</span></div>').join('');
    const resultMessage = total === 1
      ? '<p class="score-comparison-result">You’re the first to finish today. Your score is on the board; check back to see how the group did.</p>'
      : '<p class="score-comparison-result">You scored higher than <strong>' + percentile + '%</strong> of players today.</p>';
    panel.innerHTML = '<h3>How did you compare?</h3>' + resultMessage + '<div class="score-distribution" role="img" aria-label="Score distribution across ' + total + ' players">' + bars + '</div><p class="score-comparison-note">' + total + ' ' + (total === 1 ? 'player has' : 'players have') + ' finished today. Your score is shared anonymously.</p>';
  } catch {
    panel.innerHTML = "<h3>How did you compare?</h3><p>Today’s group scores aren’t available yet. Your score is still saved on this device.</p>";
  }
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
