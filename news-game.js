const edition = {"stories":[{"headline":"Kannauj Police Arrest Father and Daughter of Congress Leader in Connection with Advocate's Murder","copy":"Police in Kannauj district arrested the father and daughter of a Congress district general secretary following the murder of advocate and Bharatiya Janata Party functionary Anuj Chaturvedi in the Chhibramau Kotwali area. Authorities booked the accused girl under Section 3(5) of the Bharatiya Nyaya Sanhita after CCTV footage from {{1}} established her presence at the crime scene. During a subsequent raid on a shop belonging to the prime accused Amol Dixit, police recovered weapons including a {{2}} country-made pistol to investigate whether they were used in the attack.","answer":"nearby cameras","options":["nearby cameras","toll plaza records","highway checkpoints"],"answer2":"315-bore","options2":["9mm caliber","315-bore","7.62mm service"],"explanation":"The arrests in Kannauj district follow the murder of BJP functionary Anuj Chaturvedi, drawing high-profile political attention as investigators examine recovered firearms and shared criminal intent under the Bharatiya Nyaya Sanhita.","sources":[{"label":"timesofindia.indiatimes.com","url":"https://timesofindia.indiatimes.com/city/kanpur/bjp-functionary-murder-accused-cong-netas-dad-daughter-held/articleshow/135841839.cms"}]},{"headline":"Haryana Human Rights Commission Calls for Safety Audit After Panchkula School Assault","copy":"Following the alleged assault on a young student inside a government school classroom in Panchkula, the Haryana Human Rights Commission has ordered a comprehensive safety audit across all schools in the state. The commission highlighted systemic shortcomings involving classroom supervision, emergency medical response, and {{1}} monitoring. In its order, the panel demanded detailed compliance reports from multiple state authorities, including the Panchkula police commissioner, deputy commissioner, and {{2}}.","answer":"CCTV","options":["biometric","fire alarm","CCTV"],"answer2":"civil surgeon, Panchkula","options2":["civil surgeon, Panchkula","district sports officer","municipal commissioner"],"explanation":"The Haryana Human Rights Commission stepped in to address systemic safety gaps in schools following a shocking assault on a student, demanding concrete corrective action and supervision reforms from multiple state departments.","sources":[{"label":"timesofindia.indiatimes.com","url":"https://timesofindia.indiatimes.com/city/chandigarh/panchkula-school-horror-human-rights-panel-calls-for-safety-audit/articleshow/135841821.cms"}]},{"headline":"Harshal Patel Moves in All-Cash Trade Ahead of IPL 2027","copy":"Experienced right-arm fast bowler Harshal Patel is set to transfer from Sunrisers Hyderabad to the {{1}} ahead of the 2027 Indian Premier League season in an all-cash deal valued at four crore rupees. The 35-year-old pacer, who was born in Sanand, will return to represent his home state after previously playing for Haryana and other franchises. At his new franchise, he joins a pace attack that features international spearheads such as {{2}} and Mohammed Siraj.","answer":"Gujarat Titans","options":["Mumbai Indians","Gujarat Titans","Royal Challengers"],"answer2":"Kagiso Rabada","options2":["Trent Boult","Mitchell Starc","Kagiso Rabada"],"explanation":"Harshal Patel's trade to the Gujarat Titans highlights early squad adjustments and high-value player movements among Indian Premier League franchises ahead of the upcoming retention deadline.","sources":[{"label":"pragativadi.com","url":"https://pragativadi.com/harshal-patel-set-to-join-gujarat-titans-in-%E2%82%B94-crore-all-cash-trade-from-sunrisers-hyderabad-ahead-of-ipl-2027/"}]},{"headline":"Telangana High Court Directs State Government to Expedite Jogulamba Gadwal Court Complex Construction","copy":"The Telangana High Court division bench comprising Acting Chief Justice P. Sam Koshy and Justice Suddala Chalapathi Rao has directed the state government to immediately commence and complete the construction of the Integrated District Court Complex at Jogulamba Gadwal. The court acted on a public interest litigation regarding delays despite the government having sanctioned and handed over ten acres of land at Survey No. 368 in {{1}} for the project. Pending completion, the bench instructed authorities to provide basic amenities such as separate washrooms for {{2}} at the existing premises.","answer":"Pudur","options":["Pudur","Kavali","Atmakur"],"answer2":"women advocates","options2":["visiting litigants","women advocates","junior magistrates"],"explanation":"The Telangana High Court intervened to resolve long-standing delays in building the Jogulamba Gadwal court complex, ensuring that basic infrastructure is provided for legal professionals and litigants in the interim.","sources":[{"label":"deccanchronicle.com","url":"https://www.deccanchronicle.com/southern-states/telangana/telangana-hc-pulls-up-govt-over-gadwal-court-delay-2004522"}]},{"headline":"SEBI Chairman Tuhin Kanta Pandey Announces Upcoming Artificial Intelligence Guidelines for Capital Markets","copy":"Markets regulator Securities and Exchange Board of India will soon issue detailed guidelines governing the responsible use of artificial intelligence in capital markets to balance innovation with investor protection. SEBI chairman Tuhin Kanta Pandey stated that the regulatory framework will establish guardrails for disclosures, accountability of regulated entities, and a {{1}} approach to ensure critical decisions retain human oversight. Pandey announced the upcoming norms while speaking at the inauguration of SEBI's pavilion at the 45th {{2}} in New Delhi.","answer":"human-in-the-loop","options":["peer-review-mandate","automated-stop-loss","human-in-the-loop"],"answer2":"India International Trade Fair","options2":["India International Trade Fair","Global FinTech Fest","Mumbai Tech Summit"],"explanation":"SEBI is formalizing artificial intelligence guidelines for the financial sector to protect investors from cyber threats and market manipulation while accommodating new technological tools in securities trading.","sources":[{"label":"thehindubusinessline.com","url":"https://www.thehindubusinessline.com/markets/sebi-to-issue-ai-norms-for-capital-markets-safeguard-investor-interests-pandey/article71704258.ece"}]}],"moreToday":[{"text":"Congress leaders in Uttar Pradesh accused the BJP of targeting marginalized communities through electoral roll revisions, claiming millions of eligible voters were omitted.","url":"https://timesofindia.indiatimes.com/city/lucknow/cong-accuses-bjp-of-targeting-dalits-obcs-through-sir/articleshow/135841842.cms"},{"text":"Bank of Baroda increased interest rates on its special 555-day retail term deposit scheme by ten basis points across customer categories.","url":"https://www.morungexpress.com/bank-of-baroda-raises-rates-on-555-day-bob-golden-goal-deposit-by-10-bps"},{"text":"Tata Trusts chairman Noel Tata voiced opposition to listing Tata Sons, warning that public shareholders could prioritize commercial profits over traditional philanthropy.","url":"https://timesofindia.indiatimes.com/business/india-business/listing-will-change-tata-way-put-profit-above-philanthropy-noel/articleshow/135842200.cms"}],"date":"2026-11-15"};



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
