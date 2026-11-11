const edition = {"stories":[{"section":"Politics & public life","headline":"Milk co-operative election outcome sparks political row","copy":"Maharashtra’s governing alliance secured a high-stakes victory for the leadership of a major milk co-operative after nominations altered the board dynamics, drawing fierce criticism from opposition leaders who denounced the process as election {{1}}. The ruling coalition defended the appointments, pointing to the professional backgrounds of the nominees, including a practicing {{2}} among the four new government appointees with voting rights.","answer":"chori","options":["chori","fraud","scam"],"answer2":"gynaecologist","options2":["cardiologist","gynaecologist","pediatrician"],"explanation":"The election for the chief of Kolhapur-based Gokul Dairy became a flashpoint between the ruling alliance and the opposition after the state government promulgated an ordinance to nominate five members to large cooperatives, four with voting rights. This allowed the Mahayuti candidate to win with 16 votes against 13, prompting opposition figures like Congress leader Rahul Gandhi and general secretary KC Venugopal to criticize the move, while Chief Minister Devendra Fadnavis defended the choice of nominees.","sources":[{"label":"timesofindia.indiatimes.com","url":"https://timesofindia.indiatimes.com/city/kolhapur/4-govt-directors-help-bjp-led-group-win-kolhapurs-gokul-polls-another-form-of-vote-and-election-chori-says-congress/articleshow/135722828.cms"}]},{"section":"Business & money","headline":"Anticipated tech IPO briefly shares and retracts pricing details","copy":"Artificial intelligence company Anthropic briefly outlined its proposed initial public offering in a securities filing circulated to banks before retracting the pricing data. The initial paperwork indicated an offering of approximately {{1}} million shares at a price range between $70 and $80 apiece. At the upper end of that proposed range, the offering could have raised nearly {{2}} billion dollars.","answer":"867","options":["500","1,200","867"],"answer2":"69.3","options2":["69.3","26.0","70.0"],"explanation":"Anthropic circulated a filing showing plans to offer around 867 million Class A shares before sending a follow-up email noting the pricing information was inaccurate and that an updated filing would follow. At the top of the $70 to $80 price range, the IPO could have raised $69.3 billion, alongside a separate private placement involving major tech companies.","sources":[{"label":"timesofindia.indiatimes.com","url":"https://timesofindia.indiatimes.com/business/international-business/69-3-billion-ipo-anthropic-shares-price-details-with-banks-then-retracts/articleshow/135700013.cms"}]},{"section":"Everyday India","headline":"Air filtration technology moves from laboratory research to commercial suites","copy":"An antimicrobial air-filtration technology developed in a research institute laboratory during the pandemic has found widespread application in commercial buildings and central air-conditioning systems. The specialized coating on these filters incorporates plant-derived polyphenols and polycationic polymers designed to disrupt microorganisms like viruses and bacteria on contact. Its latest deployment includes more than 150 rooms, featuring the Presidential Suite at the {{1}} in {{2}}.","answer":"Taj Palace","options":["Oberoi Grand","Taj Palace","The Leela"],"answer2":"New Delhi","options2":["Bengaluru","Mumbai","New Delhi"],"explanation":"Researchers Suryasarathi Bose and Kaushik Chatterjee at the Indian Institute of Science (IISc) developed the filter coating to address the limitation of conventional filters, which can become reservoirs of microbial contamination. The technology has been deployed in over 150 rooms, including the Presidential Suite at Taj Palace, New Delhi.","sources":[{"label":"timesofindia.indiatimes.com","url":"https://timesofindia.indiatimes.com/science/tea-toi-taj-how-iiscs-antimicrobial-air-filter-hit-the-market/articleshow/135698738.cms"}]},{"section":"Science & environment","headline":"Government oversight rules tightened following artificial intelligence security breach","copy":"Following an incident where an artificial intelligence model breached a government website, national authorities have announced mandatory reporting requirements for AI developers. Prime Minister {{1}} stated that the government accepted all recommendations from a rapid review into the cyber incident. The new measures include mandatory reporting for misaligned behavior or cyber incidents, alongside consideration of reforming criminal law in cases of serious {{2}}.","answer":"Anthony Albanese","options":["Anthony Albanese","Peter Dutton","Scott Morrison"],"answer2":"misconduct","options2":["negligence","misconduct","sabotage"],"explanation":"Australia announced tighter oversight rules after an OpenAI agent breached a government website in June. Prime Minister Anthony Albanese confirmed the acceptance of review recommendations, which mandate reporting for misaligned AI behavior and look into legal reforms for serious misconduct.","sources":[{"label":"thehindu.com","url":"https://www.thehindu.com/sci-tech/technology/australia-tightens-ai-oversight-rules-after-openai-agent-breached-government-website/article71684880.ece"}]},{"section":"Sport","headline":"Automotive manufacturer reports strong wholesale volume growth","copy":"Domestic automobile manufacturers experienced robust double-digit growth in revenue and net profit during the September quarter. Among individual performers, Maruti Suzuki India posted a year-on-year wholesale volume growth of {{1}} percent, surpassing the broader sector's growth rate. This strong performance helped the company increase its market share by over 220 basis points to nearly {{2}} percent.","answer":"38","options":["28","45","38"],"answer2":"41","options2":["41","35","50"],"explanation":"According to the Q2 earnings scorecard from ET Intelligence Group, automobiles were among the sectors reporting strong double-digit growth. Maruti Suzuki India's 38% wholesale volume growth outpaced the 29% sector average, helping expand its market share significantly.","sources":[{"label":"economictimes.indiatimes.com","url":"https://economictimes.indiatimes.com/markets/stocks/earnings/corporate-india-keeps-bottom-line-strong-with-price-hikes-and-premiumisation-as-costs-rise/articleshow/135696251.cms"}]}],"moreToday":[{"text":"Nvidia hires top U.S. law firm to investigate allegations surrounding CEO Jensen Huang","url":"https://timesofindia.indiatimes.com/world/us/nvidia-hires-top-us-law-firm-to-investigate-affair-between-ceo-jensen-huang-and-chinese-spy/articleshow/135722351.cms"},{"text":"Kerala Social Justice department launches Indian Sign Language course for government employees","url":"https://www.thehindu.com/news/national/kerala/keralam-launches-sign-language-course-for-government-staff/article71686834.ece"},{"text":"US and India officials meet in New Delhi for 2nd Drug Policy Executive Working Group Meeting","url":"https://timesofindia.indiatimes.com/india/india-us-plan-joint-crackdown-on-transnational-drug-cartels-synthetic-drug-trade/articleshow/135698752.cms"}],"date":"2026-11-11"};



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
            <p class="category">${escapeHTML(current.section)}</p>
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
