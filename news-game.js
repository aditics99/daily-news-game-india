const story = {
  kicker: "A story to try",
  title: "One betting network, two levels of control",
  intro: "Fill in the parts that make the story click. No dates or money figures to memorise.",
  sentences: [
    "It looked like one betting business, but the ED says Mahadev Online Book worked through a split operation.",
    " Its promoters ran it from ",
    " while ",
    " signed up customers and handled bets in India.",
    " That left the people controlling the software and accounts at the top, while local teams did the work on the ground."
  ],
  blanks: [
    { id: "place", label: "Where were the promoters based?", answer: "Dubai", options: ["Dubai", "Doha", "Singapore"] },
    { id: "people", label: "Who signed up customers and handled bets?", answer: "local teams", options: ["local teams", "bank auditors", "sports teams"] }
  ],
  explanation: "The ED says the promoters controlled the platform from Dubai. Local operators brought in customers and managed bets. In plain English: the people at the top kept control, while local teams handled the day-to-day work.",
  source: {
    label: "NDTV · How the network worked",
    url: "https://www.ndtv.com/india-news/mahadev-online-book-saurabh-chandrakar-rs-200-crore-wedding-that-unravelled-rs-90-000-crore-mahadev-betting-empire-12273098"
  }
};

const app = document.querySelector("#app");
const savedKey = "explain-that-news-game-v1";
let answers = {};
let openBlank = null;
let checked = false;
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
function progressLabel() {
  try { return localStorage.getItem(savedKey) === "done" ? "Today's story · done" : "A small daily read"; }
  catch { return "A small daily read"; }
}
function blankButton(blank) {
  const value = answers[blank.id];
  const resultClass = checked ? (value === blank.answer ? "is-correct" : "is-wrong") : "";
  return '<button class="blank ' + resultClass + '" type="button" data-blank="' + blank.id + '" aria-label="' + escapeHTML(blank.label) + '">' + (value ? escapeHTML(value) : "choose one") + '</button>';
}
function render() {
  const complete = story.blanks.every((blank) => answers[blank.id]);
  const correctlyAnswered = story.blanks.every((blank) => answers[blank.id] === blank.answer);
  const storyBody = escapeHTML(story.sentences[0]) + escapeHTML(story.sentences[1]) + blankButton(story.blanks[0]) + escapeHTML(story.sentences[2]) + blankButton(story.blanks[1]) + escapeHTML(story.sentences[3]) + escapeHTML(story.sentences[4]);
  app.innerHTML = '<div class="page"><header class="masthead"><a class="brand" href="./">Explain That<span>· India</span></a><span class="streak">' + escapeHTML(progressLabel()) + '</span></header><main class="content"><p class="kicker">A little news, remembered</p><h1>News makes more sense when you join the dots.</h1><p class="intro">A short story. A couple of blanks. A clearer picture of what happened.</p><div class="story-meta"><span class="demo-pill">Demo story · not live news</span><span>India</span></div><section aria-label="Fill in the story"><div class="story"><p>' + storyBody + '</p></div>' + story.blanks.map((blank) => '<div class="blank-menu" data-menu="' + blank.id + '" ' + (openBlank === blank.id ? "" : "hidden") + '>' + blank.options.map((option) => '<button class="choice" type="button" data-answer="' + blank.id + '" data-value="' + escapeHTML(option) + '">' + escapeHTML(option) + '</button>').join("") + '</div>').join("") + (openBlank ? '<p class="prompt">' + escapeHTML(story.blanks.find((blank) => blank.id === openBlank).label) + '</p>' : "") + '<div class="actions"><button class="check-button" type="button" data-check ' + (complete ? "" : "disabled") + '>' + (checked ? "Try again" : "Check my story") + '</button><button class="reset-button" type="button" data-reset>Start over</button></div><section class="result" aria-live="polite" ' + (checked ? "" : "hidden") + '><p class="result-title">' + (correctlyAnswered ? "You got the story." : "Here’s how the story fits together.") + '</p><p class="result-copy">' + escapeHTML(story.explanation) + '</p><div class="sources"><a href="' + escapeHTML(story.source.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHTML(story.source.label) + ' ↗</a></div></section></section></main><footer class="footer"><span>Explain That</span><span>One story at a time.</span></footer></div>';
  app.querySelectorAll("[data-blank]").forEach((button) => button.addEventListener("click", () => { openBlank = openBlank === button.dataset.blank ? null : button.dataset.blank; render(); }));
  app.querySelectorAll("[data-answer]").forEach((button) => button.addEventListener("click", () => { answers[button.dataset.answer] = button.dataset.value; openBlank = null; checked = false; render(); }));
  app.querySelector("[data-check]").addEventListener("click", () => {
    if (checked) checked = false;
    else { checked = true; if (correctlyAnswered) { try { localStorage.setItem(savedKey, "done"); } catch { /* progress is optional */ } } }
    render();
  });
  app.querySelector("[data-reset]").addEventListener("click", () => { answers = {}; openBlank = null; checked = false; render(); });
}
render();
