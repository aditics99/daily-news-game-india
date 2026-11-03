const story = {
  kicker: "A story to try",
  sentences: [
    "Could your E20 car switch to almost-pure ethanol now?",
    " Not automatically: the updated rules include ",
    " in the emission standards for ",
    " specially designed and certified to use it.",
    " E20 is petrol with 20% ethanol; a vehicle built for E20 alone isn’t cleared for E100."
  ],
  blanks: [
    { id: "fuel", label: "Which fuel did the rule add?", answer: "E100", options: ["E100", "E20", "E85"] },
    { id: "vehicle", label: "Which vehicles can use E100?", answer: "flex-fuel vehicles", options: ["flex-fuel vehicles", "all petrol vehicles", "electric vehicles"] }
  ],
  explanation: "The amendment expressly adds E100 alongside E85 in the emission-certification rules. It gives manufacturers a clear path to certify flex-fuel vehicles built for those blends. It doesn’t make an ordinary E20 car compatible with E100.",
  source: { label: "MoRTH via PIB · E100 and flex-fuel rules", url: "https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2328642&lang=2&reg=48" }
};

const app = document.querySelector("#app");
const savedKey = "explain-that-news-game-v1";
let answers = {};
let checked = false;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function progressLabel() {
  try { return localStorage.getItem(savedKey) === "done" ? "Today's story · done" : "A small daily read"; }
  catch { return "A small daily read"; }
}

function render() {
  const complete = story.blanks.every((blank) => answers[blank.id]);
  const correctlyAnswered = story.blanks.every((blank) => answers[blank.id] === blank.answer);
  const storyBody = [
    escapeHTML(story.sentences[0]), escapeHTML(story.sentences[1]), blankSelect(story.blanks[0]),
    escapeHTML(story.sentences[2]), blankSelect(story.blanks[1]), escapeHTML(story.sentences[3]),
    escapeHTML(story.sentences[4])
  ].join("");

  app.innerHTML =     '<div class="page">' +
      '<header class="masthead"><a class="brand" href="./">Explain That<span>· India</span></a><span class="streak">' + escapeHTML(progressLabel()) + '</span></header>' +
      '<main class="content"><p class="kicker">A little news, remembered</p><h1>News makes more sense when you join the dots.</h1>' +
      '<p class="intro">A short story. A couple of blanks. A clearer picture of what happened.</p>' +
      '<div class="story-meta"><span class="demo-pill">Demo story · not live news</span><span>India</span></div>' +
      '<section aria-label="Fill in the story"><div class="story"><p>' + storyBody + '</p></div>' +
      '<div class="actions"><button class="check-button" type="button" data-check ' + (complete ? '' : 'disabled') + '>' + (checked ? 'Try again' : 'Check my story') + '</button>' +
      '<button class="reset-button" type="button" data-reset>Start over</button></div>' +
      '<section class="result" aria-live="polite" ' + (checked ? '' : 'hidden') + '><p class="result-title">' + (correctlyAnswered ? 'You got the story.' : 'Here’s how the story fits together.') + '</p>' +
      '<p class="result-copy">' + escapeHTML(story.explanation) + '</p><div class="sources"><a href="' + escapeHTML(story.source.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHTML(story.source.label) + ' ↗</a></div></section></section></main>' +
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
