const edition = {"stories":[{"headline":"Satara’s 21 bank directors face a vote for the bank’s top post","copy":"On November 18, the 21 directors of Satara District Central Cooperative Bank will choose its next {{1}}. District cooperative banks lend to local credit societies, which then give loans to farmers. BJP has 9 board seats, NCP 8 and Shiv Sena 4; the three parties are part of Maharashtra’s {{2}} government.","answer":"chairperson","options":["chief minister","chairperson","district collector"],"answer2":"Mahayuti","options2":["Maha Vikas Aghadi","Mahayuti","United Progressive Alliance"],"explanation":"A district central cooperative bank (DCCB) is part of the rural credit chain: it lends to local cooperative societies, which provide loans to farmers. The bank’s elected board chooses its leader. In Satara, the 21-member board has 9 BJP, 8 NCP and 4 Shiv Sena directors, so the vote will test how those partners share control of a local lender.","sources":[{"label":"Times of India · Satara bank election","url":"https://timesofindia.indiatimes.com/city/kolhapur/bjp-shiv-sena-and-ncp-locked-in-tug-of-war-for-satara-dcc-bank-chiefs-post/articleshow/135811926.cms"},{"label":"NABARD · cooperative banking in rural India","url":"https://www.nabard.org/auth/writereaddata/tender/pub_080923101856763.pdf"}]},{"headline":"Naidu offers Araku coffee to UAE minister before Visakhapatnam summit","copy":"Andhra Pradesh Chief Minister N. Chandrababu Naidu offered Araku coffee to UAE minister Abdulla bin Touq Al Marri. Naidu said he wanted the minister to remember Andhra Pradesh whenever he had a cup. He also invited him to consider {{1}} in the state and proposed a {{2}} using Andhra-grown cocoa.","answer":"investment","options":["tourism","investment","diplomacy"],"answer2":"chocolate factory","options2":["coffee roasting unit","dairy plant","chocolate factory"],"explanation":"Naidu used two local products to make an investment pitch: Araku coffee and cocoa grown in Andhra Pradesh. A chocolate factory would turn locally grown cocoa into a product that can be sold, instead of shipping out only the raw crop.","sources":[{"label":"Times of India · Naidu’s Araku coffee and cocoa pitch","url":"https://timesofindia.indiatimes.com/city/vijayawada/naidu-turns-araku-coffee-ap-cocoa-into-investment-pitch/articleshow/135811953.cms"}]},{"headline":"Bengaluru adds six stations to Namma Metro’s Pink Line","copy":"The first 7.5-kilometre stretch of Bengaluru’s Pink Line opened on November 14, with six stations between {{1}} and Tavarekere. At Jayadeva Hospital station, passengers can change to the {{2}} Line.","answer":"Kalena Agrahara","options":["Whitefield","Hebbal","Kalena Agrahara"],"answer2":"Yellow","options2":["Yellow","Green","Purple"],"explanation":"This is the first operating section of the Pink Line, part of Bengaluru’s Namma Metro. At Jayadeva Hospital, riders can transfer to the Yellow Line—for example, someone arriving on the Pink Line can continue their trip without leaving the metro network.","sources":[{"label":"JICA · Bengaluru Metro Pink Line opening","url":"https://www.jica.go.jp/english/overseas/india/information/press/2026/1587234_70871.html"},{"label":"The Week · Pink Line service details","url":"https://www.theweek.in/wire-updates/national/2026/11/13/pink-line-services-between-kalena-agrahara-and-s-g-palya-to-begin-nov-14.html"}]},{"headline":"Mattigatti farmer wins national award for reviving two millets","copy":"Eshwaragouda Patil, a farmer from Mattigatti in Karnataka, received a national award for reviving {{1}} (Baragu) and {{2}} (Korale). Farmers now grow the two crops across hundreds of hectares in Kundgol and Shiggaon.","answer":"Proso millet","options":["Proso millet","Pearl millet","Finger millet"],"answer2":"Brown Top millet","options2":["Foxtail millet","Barnyard millet","Brown Top millet"],"explanation":"Patil helped bring two traditional millet crops back into local fields. The report says they are now grown across hundreds of hectares in Kundgol and Shiggaon, giving farmers more crops suited to their region.","sources":[{"label":"Times of India · Eshwaragouda Patil wins seed conservation award","url":"https://timesofindia.indiatimes.com/city/hubballi/bibi-fathima-shg-eshwaragouda-patil-win-national-plant-genome-saviour-awards/articleshow/135811726.cms"}]},{"headline":"ED gets seven days to question Mahadev betting app promoter","copy":"The Enforcement Directorate arrested Saurabh Chandrakar in Raipur after he was extradited from {{1}}. A court allowed the agency to question him until {{2}} in its money-laundering investigation into the Mahadev Online Book betting platform.","answer":"Oman","options":["Nepal","Oman","Singapore"],"answer2":"November 19","options2":["November 16","November 19","November 24"],"explanation":"The ED is investigating whether money from the betting operation was moved or disguised as legitimate funds. The court order gives investigators time to question Chandrakar; the allegations still have to be tested in court.","sources":[{"label":"ThePrint · ED arrest in Mahadev betting app case","url":"https://theprint.in/india/mahadev-betting-app-case-ed-arrests-main-accused-saurabh-chandrakar/3098252/"}]}],"moreToday":[{"text":"Jalgaon DCC Bank election nominations draw a fresh dispute between alliance partners.","url":"https://timesofindia.indiatimes.com/city/nashik/shiv-sena-aspirants-re-entry-heats-up-jalgaon-dcc-bank-election/articleshow/135811917.cms"},{"text":"Telangana Congress leader Goud discusses equal-opportunity promises at the Bharat Summit.","url":"https://www.siasat.com/congress-will-bring-equal-opportunities-goud-at-bharat-summit-3576906/"},{"text":"Hyderabad police issue traffic restrictions ahead of Rahul Gandhi’s bike rally.","url":"https://www.siasat.com/rahul-gandhi-to-lead-rally-in-hyderabad-traffic-advisory-issued-3576754/"}],"date":"2026-11-14"};



const app = document.querySelector("#app");
const savedKey = "explain-that-india-daily-v1";
const progressKey = "explain-that-india-streak-v1";
const today = edition.date;
const blankState = () => ({ index: 0, answers: [], secondAnswers: [], revealed: false, revealedCorrect: false, score: 0, finished: false });
let state = blankState();
function editionProblems() {
  const problems = [];
  edition.stories.forEach((story, index) => {
    const markers = Array.from(story.copy.matchAll(/\{\{([12])\}\}/g), (match) => match[1]);
    if (markers.join(",") !== "1,2") problems.push("Story " + (index + 1) + " must have exactly {{1}} and {{2}} blanks, in order.");
    for (const [number, answer, options] of [[1, story.answer, story.options], [2, story.answer2, story.options2]]) {
      if (options.length !== 3 || new Set(options).size !== 3 || options.filter((option) => option === answer).length !== 1) {
        problems.push("Story " + (index + 1) + " blank " + number + " needs three unique choices and one correct answer.");
      }
    }
  });
  return problems;
}

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
function stripSourceCitations(value) { return String(value).replace(/\s*\(\s*\[[^\]]+\]\(https?:\/\/[^)]+\)\s*\)/g, "").replace(/\s*\(https?:\/\/[^)]+\)/g, "").trim(); } function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
function dateLabel() {
  return new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "long" }).format(new Date(`${today}T12:00:00+05:30`));
}
function render() {
  const problems = editionProblems();
  if (problems.length) {
    console.error("Daily story content check failed:", problems);
    app.innerHTML = '<main class="content"><h1>Today’s stories are being checked.</h1><p>Please check back shortly.</p></main>';
    return;
  }
  const streak = getStreak();
  const current = edition.stories[Math.min(state.index, edition.stories.length - 1)];
  const done = state.finished;
  const answer = state.answers[state.index] || ""; const answer2 = state.secondAnswers[state.index] || "";
  const correct = state.revealed ? state.revealedCorrect === true : answer === current.answer && answer2 === current.answer2;
  const progress = edition.stories.map((_, i) => `<span class="progress-dot ${i < state.index || done ? "is-done" : i === state.index ? "is-current" : ""}" aria-label="Story ${i + 1}${i < state.index || done ? ", complete" : i === state.index ? ", current" : ""}"></span>`).join("");
  const displayStory = escapeHTML(current.copy.replace(/\s*\(\[[^\]]+\]\(https?:\/\/[^)]+\)\)/g, "")).replace(/\{\{([12])\}\}/g, (_match, number) => {
    const blankNumber = Number(number);
    const value = blankNumber === 1 ? answer : answer2;
    return state.revealed
      ? '<span class="answer-reveal ' + (correct ? 'is-correct' : 'is-wrong') + '">' + escapeHTML(blankNumber === 1 ? current.answer : current.answer2) + '</span>'
      : '<span class="select-wrap">' + selectHTML(current, value, blankNumber) + '</span>';
  });

  app.innerHTML = `
    <div class="page">
      <header class="masthead">
        
        <div class="streak" aria-label="${streak} day streak"><span class="streak-fire">✳</span><strong>${streak}</strong><span>day streak</span></div>
      </header>
      <main class="content">
        
        <h1>Daily news for the <mark>dopamine-fried</mark> brain.</h1>

        <section class="game-card" aria-label="Today's India news game">
          ${done ? renderFinish(streak) : `
            <div class="card-top"><span class="round-label">TODAY’S NEWS</span><span class="round-count">${String(state.index + 1).padStart(2, "0")} <i>/</i> 05</span></div>
            <div class="progress-row" aria-label="Story ${state.index + 1} of 5">${progress}</div>
            <h2 class="story-heading">${escapeHTML(current.headline)}</h2>
            <p class="story-copy">${displayStory}</p>
            ${state.revealed ? `
              <div class="feedback ${correct ? "is-right" : "is-not-right"}" aria-live="polite">
                <p class="feedback-title">${correct ? "You got it." : "Here’s the missing piece."}</p>
                <p>${escapeHTML(current.explanation.replace(/\s*\(\[[^\]]+\]\(https?:\/\/[^)]+\)\)/g, ""))}</p>
                <div class="source-list"><p class="source-list-title">Sources</p>${(current.sources || [current.source]).map((source) => `<a class="source-link" href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.label)} ↗</a>`).join("")}</div>
              </div>
              <button class="primary-button" type="button" data-next>${state.index === edition.stories.length - 1 ? "See my score" : "Next story"}<span>→</span></button>
            ` : `<button class="primary-button" type="button" data-check ${answer && answer2 ? "" : "disabled"}>Lock it in<span>→</span></button>`}
          `}
        </section>

      </main>
      <footer class="footer"><span>Your Daily News Game · India</span><button class="about-link" type="button" data-about>About</button></footer><dialog class="about-dialog" data-about-dialog aria-labelledby="about-title"><form method="dialog" class="about-dialog__form"><button class="about-close" aria-label="Close about">×</button></form><p class="about-kicker">WHY A NEWS GAME?</p><h2 id="about-title">A little effort helps it stick.</h2><p>Trying to remember a detail is called retrieval practice. The dropdowns give you choices, so this is guided recall. Then the explanation adds context.</p><p>News leads are discovered with <a href="https://www.gdeltproject.org/" target="_blank" rel="noopener noreferrer">The GDELT Project</a>. Story links go to the original publishers.</p></dialog>
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
    <section class="score-comparison" data-score-comparison aria-live="polite"><h3>How did you compare?</h3><p>Loading today’s scores…</p></section><div class="finish-recap"><h3>More interesting things today</h3><ul>${(edition.moreToday || []).map((item) => '<li><a href="' + escapeHTML(item.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHTML(item.text.replace(/\s*\(\[[^\]]+\]\(https?:\/\/[^)]+\)\)/g, "")) + '</a></li>').join("")}</ul></div>
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
