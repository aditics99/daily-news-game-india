const story = {
  kicker: "One quick game. One real story.",
  sentences: [
    "The government updated the Central Motor Vehicles Rules, 2026, to include E100 in the emission standards for flex-fuel vehicles—vehicles that can run on different petrol-and-ethanol blends.",
    " But this doesn’t make every petrol car E100-ready. To use E100, a vehicle must be ",
    ". E20 is petrol with 20% ethanol; E100 is fuel made mostly from ethanol."
  ],
  blanks: [
    {
      id: "qualification",
      label: "What must a vehicle be approved for before using E100?",
      answer: "designed and certified for high-ethanol fuel",
      options: ["designed and certified for high-ethanol fuel", "able to run on E20", "made after 2026"]
    }
  ],
  explanation: "The rules now name E100 in the emission-certification standards for flex-fuel vehicles. A vehicle must be designed and certified for high-ethanol fuel to use it. Being able to run on E20 alone isn’t enough.",
  source: {
    label: "MoRTH via PIB · E100 and flex-fuel rules",
    url: "https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2328642&lang=2&reg=48"
  }
};

const app = document.querySelector("#app");
const savedKey = "explain-that-news-game-v1";
let answers = {};
let checked = false;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function progressLabel() {
  try { return localStorage.getItem(savedKey) === "done" ? "Today's story · done" : "A small daily read"; }
  catch { return "A small daily read"; }
}

function render() {
  const complete = story.blanks.every((blank) => answers[blank.id]);
  const correctlyAnswered = story.blanks.every((blank) => answers[blank.id] === blank.answer);
  const storyBody = [
    escapeHTML(story.sentences[0]), escapeHTML(story.sentences[1]),
    blankSelect(story.blanks[0]), escapeHTML(story.sentences[2])
  ].join("");

  app.innerHTML = '<div class="page">' +
    '<header class="masthead"><a class="brand" href="./">Explain That<span>· India</span></a><span class="streak">' + escapeHTML(progressLabel()) + '</span></header>' +
    '<main class="content"><p class="kicker">' + escapeHTML(story.kicker) + '</p><h1>Daily news for the dopamine-fried brain.</h1>' +
    '<p class="intro">Make a guess. Then get the story behind the news.</p>' +
    '<div class="story-meta"><span class="demo-pill">Demo story · not live news</span><span>India</span></div>' +
    '<section aria-label="Fill in the story"><div class="story"><p>' + storyBody + '</p></div>' +
    '<div class="actions"><button class="check-button" type="button" data-check ' + (complete ? '' : 'disabled') + '>' + (checked ? 'Try again' : 'Check my story') + '</button>' +
    '<button class="reset-button" type="button" data-reset>Start over</button></div>' +
    '<section class="result" aria-live="polite" ' + (checked ? '' : 'hidden') + '><p class="result-title">' + (correctlyAnswered ? 'You got the story.' : 'Here’s how the story fits together.') + '</p>' +
    '<p class="result-copy">' + escapeHTML(story.explanation) + '</p>' +
    '<div class="fuel-visual" role="img" aria-label="A flex-fuel vehicle has one tank and can use different petrol and ethanol blends within the range it was designed and certified for.">' +
      '<p class="fuel-visual-title">One tank. A range of fuel blends.</p>' +
      '<div class="blend-row" aria-hidden="true"><span class="blend-chip"><strong>E20</strong><small>20% ethanol</small></span><span class="blend-chip"><strong>E85</strong><small>up to 85%</small></span><span class="blend-chip"><strong>E100</strong><small>mostly ethanol</small></span></div>' +
      '<div class="fuel-path" aria-hidden="true"><span></span><b>one tank</b><span></span></div>' +
      '<div class="car-row" aria-hidden="true"><svg viewBox="0 0 220 74" focusable="false"><path d="M35 46h-8a7 7 0 0 1-7-7v-8a8 8 0 0 1 6-8l22-6 18-16a12 12 0 0 1 9-4h55a15 15 0 0 1 11 5l17 19 29 7a9 9 0 0 1 7 9v9h-9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M35 46h117M63 17h76M76 4l-9 13m65-13 8 13" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="52" cy="48" r="12" fill="var(--paper)" stroke="currentColor" stroke-width="3"/><circle cx="165" cy="48" r="12" fill="var(--paper)" stroke="currentColor" stroke-width="3"/><circle cx="52" cy="48" r="4" fill="currentColor"/><circle cx="165" cy="48" r="4" fill="currentColor"/></svg><span>flex-fuel vehicle</span></div>' +
      '<p class="fuel-visual-note">Each model is certified for its own fuel range. The engine adjusts to the blend.</p></div>' +
    '<div class="sources"><a href="' + escapeHTML(story.source.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHTML(story.source.label) + ' ↗</a></div></section></section></main>' +
    '<footer class="footer"><span>Explain That</span><span>One story at a time.</span></footer></div>';

  app.querySelectorAll("[data-blank]").forEach((select) => {
    select.addEventListener("change", () => {
      answers[select.dataset.blank] = select.value;
      checked = false;
      render();
      app.querySelector('[data-blank="' + select.dataset.blank + '"]')?.focus();
    });
  });
  app.querySelector("[data-check]").addEventListener("click", () => {
    if (checked) checked = false;
    else {
      checked = true;
      if (correctlyAnswered) { try { localStorage.setItem(savedKey, "done"); } catch { /* progress is optional */ } }
    }
    render();
  });
  app.querySelector("[data-reset]").addEventListener("click", () => { answers = {}; checked = false; render(); });
}

function blankSelect(blank) {
  const value = answers[blank.id] || "";
  const resultClass = checked ? (value === blank.answer ? "is-correct" : "is-wrong") : "";
  const options = blank.options.map((option) => '<option value="' + escapeHTML(option) + '" ' + (value === option ? 'selected' : '') + '>' + escapeHTML(option) + '</option>').join("");
  return '<span class="select-wrap"><select class="blank-select ' + resultClass + '" data-blank="' + blank.id + '" aria-label="' + escapeHTML(blank.label) + '"><option value="" ' + (value ? '' : 'selected') + ' disabled>choose one</option>' + options + '</select></span>';
}

render();
