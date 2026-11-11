#!/usr/bin/env python3
"""Build a sourced, validated India news game edition and prepare it for publishing."""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from html import unescape
from html.parser import HTMLParser
from urllib.parse import quote_plus, urlsplit
from urllib.request import Request, urlopen
from pathlib import Path
import json
import os
import re
import sys
import time
from zoneinfo import ZoneInfo

IST = ZoneInfo("Asia/Kolkata")
API_URL = "https://generativelanguage.googleapis.com/v1beta/models"
MODEL = "gemini-3.5-flash-lite"
CATEGORIES = ["Politics & public life", "Business & money", "Everyday India", "Science & environment", "Sport", "Culture & entertainment"]
QUERIES = [
    ("Politics & public life", "sourcecountry:india sourcelang:english (government OR parliament OR election OR court OR minister OR policy)"),
    ("Business & money", "sourcecountry:india sourcelang:english (business OR economy OR companies OR markets OR finance OR industry)"),
    ("Everyday India", "sourcecountry:india sourcelang:english (transport OR education OR health OR infrastructure OR services OR prices)"),
    ("Science & environment", "sourcecountry:india sourcelang:english (science OR technology OR environment OR climate OR space OR energy)"),
    ("Sport", "sourcecountry:india sourcelang:english (India cricket OR sport OR tournament OR match OR athletics)"),
    ("Culture & entertainment", "sourcecountry:india sourcelang:english (culture OR entertainment OR film OR music OR books)"),
]

SCHEMA = {
    "type": "object",
    "properties": {
        "stories": {"type": "array", "items": {
            "type": "object", "properties": {
                "section": {"type": "string", "enum": CATEGORIES},
                "headline": {"type": "string"},
                "copy": {"type": "string"},
                "answer": {"type": "string"},
                "options": {"type": "array", "items": {"type": "string"}},
                "answer2": {"type": "string"},
                "options2": {"type": "array", "items": {"type": "string"}},
                "explanation": {"type": "string"},
                "candidateIds": {"type": "array", "items": {"type": "integer", "minimum": 1, "maximum": 25}}
            },
            "required": ["section", "headline", "copy", "answer", "options", "answer2", "options2", "explanation", "candidateIds"],
            "additionalProperties": False
        }},
        "moreToday": {"type": "array", "items": {"type": "object", "properties": {
            "text": {"type": "string"}, "candidateId": {"type": "integer", "minimum": 1, "maximum": 25}
        }, "required": ["text", "candidateId"], "additionalProperties": False}}
    },
    "required": ["stories", "moreToday"],
    "additionalProperties": False
}


class ArticleContextParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.depth = 0
        self.content_depths = []
        self.skip_depths = []
        self.paragraph_depth = None
        self.paragraph = []
        self.paragraphs = []
        self.title_depth = None
        self.title = []
        self.metadata = []
        self.jsonld_depth = None
        self.jsonld = []
        self.article_bodies = []

    def handle_starttag(self, tag, attrs):
        void_tags = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
        is_void = tag in void_tags
        self.depth += 1
        attrs = dict(attrs)
        classes = (attrs.get("class", "") + " " + attrs.get("id", "")).lower()
        if tag in ("article", "main") or any(word in classes for word in ("article", "story", "content", "post-body")):
            self.content_depths.append(self.depth)
        if tag in ("script", "style", "nav", "footer", "header", "aside"):
            self.skip_depths.append(self.depth)
        if tag == "meta":
            key = (attrs.get("property") or attrs.get("name") or "").lower()
            if key in ("description", "og:description", "twitter:description") and attrs.get("content"):
                self.metadata.append(attrs["content"].strip())
        if tag == "title":
            self.title_depth = self.depth
            self.title = []
        if tag == "script" and "ld+json" in attrs.get("type", "").lower():
            self.jsonld_depth = self.depth
            self.jsonld = []
        if tag == "p" and self.content_depths and not self.skip_depths:
            self.paragraph_depth = self.depth
            self.paragraph = []
        if is_void:
            self.depth -= 1

    def handle_data(self, data):
        if self.jsonld_depth is not None:
            self.jsonld.append(data)
        elif self.title_depth is not None:
            self.title.append(data)
        elif self.paragraph_depth is not None and not self.skip_depths:
            self.paragraph.append(data)

    def handle_endtag(self, tag):
        if tag == "p" and self.paragraph_depth == self.depth:
            text = re.sub(r"\s+", " ", " ".join(self.paragraph)).strip()
            if len(text) > 35:
                self.paragraphs.append(text)
            self.paragraph_depth = None
        if tag == "title" and self.title_depth == self.depth:
            self.metadata.append(" ".join(self.title).strip())
            self.title_depth = None
        if tag == "script" and self.jsonld_depth == self.depth:
            try:
                data = json.loads("".join(self.jsonld))
                self._collect_jsonld(data)
            except (ValueError, TypeError):
                pass
            self.jsonld_depth = None
        self.content_depths = [level for level in self.content_depths if level != self.depth]
        self.skip_depths = [level for level in self.skip_depths if level != self.depth]
        self.depth = max(0, self.depth - 1)

    def _collect_jsonld(self, value):
        if isinstance(value, dict):
            type_value = value.get("@type", [])
            raw_types = {type_value} if isinstance(type_value, str) else set(type_value) if isinstance(type_value, list) else set()
            types = {str(value).rsplit("/", 1)[-1].rsplit("#", 1)[-1] for value in raw_types}
            if types.intersection({"Article", "NewsArticle", "Report", "BlogPosting"}):
                for key in ("articleBody", "description"):
                    text = value.get(key)
                    if isinstance(text, str) and text.strip():
                        clean = re.sub(r"<[^>]+>", " ", text)
                        clean = re.sub(r"\s+", " ", unescape(clean)).strip()
                        if len(clean) > 80:
                            self.article_bodies.append(clean)
            for child in value.values():
                if isinstance(child, (dict, list)):
                    self._collect_jsonld(child)
        elif isinstance(value, list):
            for child in value:
                self._collect_jsonld(child)

    def context(self):
        parts = self.article_bodies[:1] or self.paragraphs[:8]
        if not parts:
            parts = self.metadata[:2]
        return re.sub(r"\s+", " ", " ".join(parts)).strip()[:1400]


def fetch_article_context(url):
    try:
        parsed = urlsplit(url)
        if parsed.scheme != "https" or not parsed.hostname:
            return ""
        request = Request(url, headers={
            "User-Agent": "DailyNewsGameIndia/1.0 (+public news explainer; contact: project repository)",
            "Accept": "text/html,application/xhtml+xml"
        })
        with urlopen(request, timeout=8) as response:
            if "html" not in response.headers.get("Content-Type", "").lower():
                return ""
            parser = ArticleContextParser()
            parser.feed(response.read(600000).decode("utf-8", errors="replace"))
        return parser.context()
    except Exception:
        return ""


def enrich_candidates(items):
    with ThreadPoolExecutor(max_workers=6) as executor:
        details = list(executor.map(lambda item: fetch_article_context(item["url"]), items))
    enriched = []
    for item, detail in zip(items, details):
        item["article_detail"] = detail
        item["evidence"] = "Publisher headline: " + item["title"]
        if detail:
            item["evidence"] += "\nArticle page details: " + detail
        enough_article_detail = len(detail) >= 160
        if enough_article_detail:
            enriched.append(item)
    return enriched


def fetch_candidates(now):
    grouped = {}
    failures = []
    last_request_at = 0.0
    for section, query in QUERIES:
        params = "query=" + quote_plus(query) + "&mode=artlist&maxrecords=75&timespan=1d&sort=datedesc&format=json"
        url = "https://api.gdeltproject.org/api/v2/doc/doc?" + params
        try:
            wait_for = 5.1 - (time.monotonic() - last_request_at)
            if last_request_at and wait_for > 0:
                time.sleep(wait_for)
            request = Request(url, headers={"User-Agent": "DailyNewsGameIndia/1.0 (+https://github.com/aditics99/daily-news-game-india)"})
            last_request_at = time.monotonic()
            with urlopen(request, timeout=30) as response:
                data = json.loads(response.read().decode("utf-8", errors="replace"))
            for article in data.get("articles", []):
                title = re.sub(r"\s+", " ", str(article.get("title", "")).strip())
                link = str(article.get("url", "")).strip()
                domain = str(article.get("domain", "")).strip()
                if not title or not link or urlsplit(link).scheme != "https":
                    continue
                try:
                    date = datetime.strptime(str(article.get("seendate", "")), "%Y%m%dT%H%M%SZ").replace(tzinfo=timezone.utc)
                    age = max(0.0, (now - date).total_seconds() / 3600)
                except (TypeError, ValueError):
                    date, age = now, 12.0
                if age > 30:
                    continue
                key = canonical_url(link) or re.sub(r"[^a-z0-9]+", " ", title.lower()).strip()
                entry = grouped.setdefault(key, {
                    "title": title.replace("|", "–"), "url": link, "source": domain or "News source",
                    "published": date.astimezone(IST).strftime("%Y-%m-%d %H:%M IST"), "age": age,
                    "description": "", "categories": [], "hits": 0
                })
                if section not in entry["categories"]:
                    entry["categories"].append(section)
                entry["hits"] += 1
                if age < entry["age"]:
                    entry.update({"title": title.replace("|", "–"), "url": link, "source": domain or "News source",
                                  "published": date.astimezone(IST).strftime("%Y-%m-%d %H:%M IST"), "age": age})
        except Exception as error:
            failures.append(section + ": " + type(error).__name__)

    ranked = sorted(grouped.values(), key=lambda item: item["hits"] * 12 + max(0, 30 - item["age"]) / 3, reverse=True)
    picked, seen = [], set()
    for section, _query in QUERIES:
        count = 0
        for item in ranked:
            if section in item["categories"] and item["url"] not in seen:
                picked.append(item)
                seen.add(item["url"])
                count += 1
                if count == 12:
                    break
    for item in ranked:
        if item["url"] not in seen:
            picked.append(item)
            seen.add(item["url"])
        if len(picked) >= 60:
            break
    raw_count = len(picked)
    picked = enrich_candidates(picked[:60])
    print("Article detail check: " + str(len(picked)) + " of " + str(raw_count) + " shortlisted GDELT leads had enough usable context.")
    if len(picked) < 8:
        raise RuntimeError("Only " + str(len(picked)) + " India leads had enough article detail; at least eight supported candidates are needed for five stories and three extra links. Feed status: " + ", ".join(failures))
    picked = picked[:25]
    for candidate_id, item in enumerate(picked, start=1):
        item["id"] = candidate_id
    return picked, failures

def api_response(prompt):
    key = os.environ.get("GEMINI_API_KEY", "")
    if not key:
        raise RuntimeError("GEMINI_API_KEY is missing. Add it as a GitHub Actions repository secret.")

    request_body = {
        "contents": [{"parts": [{"text": prompt}]}],
        
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 12000}
    }
    request = Request(API_URL + "/" + MODEL + ":generateContent", data=json.dumps(request_body).encode(), headers={"x-goog-api-key": key, "Content-Type": "application/json"}, method="POST")
    try:
        with urlopen(request, timeout=600) as response:
            result = json.loads(response.read())
    except Exception as error:
                raise RuntimeError("Gemini request failed" + (" (HTTP " + str(error.code) + ": " + json.loads(error.read().decode("utf-8")).get("error", {}).get("message", "")[:400] + ")" if hasattr(error, "code") else " (" + type(error).__name__ + ")")) from error

    candidates = result.get("candidates") or []
    if not candidates:
        raise RuntimeError("The news-writing service returned no finished draft.")
    candidate = candidates[0]
    parts = (candidate.get("content") or {}).get("parts", [])
    text = "".join(part.get("text", "") for part in parts).strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.I).strip()
    if not text:
        raise RuntimeError("The news-writing service returned no structured story set.")
    try:
        edition = json.loads(text)
    except json.JSONDecodeError as error:
        raise RuntimeError("The news-writing service returned unreadable structured content.") from error

    return edition


def canonical_url(value):
    parts = urlsplit(value.strip())
    host = (parts.hostname or "").lower()
    if host.startswith("www."):
        host = host[4:]
    path = re.sub(r"/+$", "", parts.path)
    return host + path


def contains_answer(text, answer):
    return bool(re.search(r"(?<![\w])" + re.escape(answer.strip()) + r"(?![\w])", text, re.I))


def validate_edition(edition, candidates):
    stories = edition.get("stories")
    extras = edition.get("moreToday")
    if not isinstance(stories, list):
        raise RuntimeError("The draft did not return a story list.")
    if len(stories) < 5:
        raise RuntimeError("Only " + str(len(stories)) + " stories had enough GDELT/article detail; refusing to publish a thin edition.")
    if len(stories) > 5:
        raise RuntimeError("The draft must contain exactly five stories.")
    if not isinstance(extras, list) or len(extras) != 3:
        raise RuntimeError("The ending card needs three verified extra stories.")
    candidate_by_id = {item["id"]: item for item in candidates}
    allowed_source_urls = {canonical_url(item["url"]) for item in candidates}
    used_candidate_ids = set()
    sections = [story.get("section") for story in stories]
    if len(set(sections)) < 4 or max(sections.count(section) for section in set(sections)) > 2:
        raise RuntimeError("The five stories did not cover enough different topics.")
    first_positions = [0, 0, 0]
    for index, story in enumerate(stories, 1):
        for field in ("headline", "copy", "answer", "answer2", "explanation"):
            if not isinstance(story.get(field), str) or not story[field].strip():
                raise RuntimeError("Story " + str(index) + " is missing " + field + ".")
        if re.findall(r"\{\{[12]\}\}", story["copy"]) != ["{{1}}", "{{2}}"]:
            raise RuntimeError("Story " + str(index) + " must contain two blanks in order.")
        body = story["copy"].replace("{{1}}", " ").replace("{{2}}", " ")
        for n, answer, options in ((1, story["answer"], story.get("options")), (2, story["answer2"], story.get("options2"))):
            if not isinstance(options, list) or len(options) != 3 or len(set(options)) != 3 or options.count(answer) != 1:
                raise RuntimeError("Story " + str(index) + " blank " + str(n) + " needs three different choices and one correct answer.")
            # Place correct answers in the least-used position so ordering stays
            # balanced even when the model repeatedly returns the answer first.
            position = first_positions.index(min(first_positions))
            distractors = [option for option in options if option != answer]
            story["options" if n == 1 else "options2"] = distractors[:position] + [answer] + distractors[position:]
            first_positions[position] += 1
            if contains_answer(body, answer) or contains_answer(story["headline"], answer):
                raise RuntimeError("Story " + str(index) + " gives away blank " + str(n) + " in its headline or remaining copy.")
            if re.search(r"\b(?:is|are|was|were)\b[^.!?]{0,100},\s*not\b", story["copy"] + " " + story["explanation"], re.I):
                raise RuntimeError("Story " + str(index) + " uses the avoided ‘X, not Y’ sentence pattern.")
            if re.search(r"\d", answer):
                parts = story["copy"].split("{{" + str(n) + "}}", 1)
                before, after = parts if len(parts) == 2 else ("", "")
                sentence = (before.rsplit(".", 1)[-1] + " " + after.split(".", 1)[0]).lower()
                if re.search(r"\b(dead|died|death|killed|injured|casualties|fatalities)\b", sentence):
                    raise RuntimeError("Story " + str(index) + " uses a number beside a human casualty detail as a blank.")
        candidate_ids = story.get("candidateIds")
        if not isinstance(candidate_ids, list) or not candidate_ids or any(type(value) is not int or value not in candidate_by_id for value in candidate_ids):
            raise RuntimeError("Story " + str(index) + " must cite one or more numbered GDELT candidates.")
        if len(set(candidate_ids)) != len(candidate_ids) or any(value in used_candidate_ids for value in candidate_ids):
            raise RuntimeError("Story " + str(index) + " reuses an GDELT candidate already assigned to another story.")
        used_candidate_ids.update(candidate_ids)
        story["sources"] = [
            {"label": candidate_by_id[value]["source"], "url": candidate_by_id[value]["url"]}
            for value in candidate_ids
        ]
        story.pop("candidateIds", None)
        for source in story["sources"]:
            if canonical_url(source["url"]) not in allowed_source_urls:
                raise RuntimeError("Story " + str(index) + " source did not come from the GDELT candidate list.")

    if min(first_positions) < 1 or max(first_positions) > 5:
        raise RuntimeError("Correct answers are too concentrated in one dropdown position.")
    for extra in extras:
        candidate_id = extra.get("candidateId")
        if not extra.get("text") or type(candidate_id) is not int or candidate_id not in candidate_by_id:
            raise RuntimeError("An ending-card item must use a numbered GDELT candidate.")
        if candidate_id in used_candidate_ids:
            raise RuntimeError("An ending-card item must use a different candidate from the five main stories.")
        used_candidate_ids.add(candidate_id)
        extra["url"] = candidate_by_id[candidate_id]["url"]
        extra.pop("candidateId", None)
        if canonical_url(extra["url"]) not in allowed_source_urls:
            raise RuntimeError("An ending-card link did not come from the GDELT candidate list.")

    edition["date"] = datetime.now(timezone.utc).astimezone(IST).date().isoformat()
    return edition


def build_prompt(candidates, failures):
    today = datetime.now(timezone.utc).astimezone(IST).strftime("%A, %d %B %Y")
    prompt_candidates = [{
        "id": item["id"], "publisher": item["source"], "published": item["published"],
        "topics": item["categories"], "evidence": item["evidence"]
    } for item in candidates]
    payload = json.dumps(prompt_candidates, ensure_ascii=False)
    return f"""Prepare the {today} edition using only the India news candidates below. Use only facts included in each candidate's supplied evidence; do not add unsupported details. Choose five important stories across different topics. Use only facts in that evidence. The script will add the selected candidates’ source links. Do not use paid search tools or invent facts.

Choose exactly five of the most significant, genuinely current India stories from the past day. Cover different parts of life in India: politics and public life, business and money, everyday services, science/environment, sport, culture/entertainment. Spread the five across at least four topic categories; use no more than two from one category. Do not choose a story solely because it is easy to quiz.

For each story: write a specific headline; write a natural, simple story of 2–4 short sentences with the literal marker strings "{{{{1}}}}" and "{{{{2}}}}" each appearing exactly once, in that order, as the blanks. Do not use underscores, unlabeled blanks, or other placeholder formats; choose useful facts or connections rather than arbitrary trivia; give each blank three distinct, plausible choices and one correct answer; vary correct dropdown positions across the edition; add a conversational explanation that gives useful context and a real-life example where one clarifies an unfamiliar concept. Do not reveal either answer in the headline or elsewhere in the unblanked story. Avoid sentences which explain a term in another sentence and then ask for that same term. Avoid the wording pattern “X, not Y.”

Attribute allegations and changing estimates. Include specific people, places, dates, decisions, and amounts when they matter. A significant disaster may be covered; describe verified location and magnitude where relevant, and mention rescue, relief, or recovery work underway. Never make death, injury, casualty, or graphic-harm counts into a blank or score.

Use only candidates whose supplied evidence supports the key who/what/where and why of the story. Skip thin or vague leads: do not fill missing context from memory or guess what an article probably says. If fewer than five candidates can support complete, accurate stories, return fewer than five stories; the publishing check will keep the previous edition live rather than publish guessed copy. For each story, return candidateIds containing the number of the most relevant candidate or candidates used. Do not return URLs. Each candidate has an id number. For moreToday, return candidateId for a different relevant candidate not already used among the five stories. The script will attach the original URLs, so do not write or alter URLs.

The candidates below have stable integer id values, publisher names, timestamps, topics, and evidence gathered from GDELT snippets plus accessible article-page text or metadata. Cite them by id. Use only the supplied evidence; skip a story if it does not establish enough facts to explain what happened and why. Article pages that block access or provide too little detail are excluded. Do not infer missing facts from a headline. The script will add the original source links.

Return only valid JSON with this shape: {{"stories":[{{"section":"...","headline":"...","copy":"...","answer":"...","options":["...","...","..."],"answer2":"...","options2":["...","...","..."],"explanation":"...","candidateIds":[1]}}],"moreToday":[{{"text":"...","candidateId":6}},{{"text":"...","candidateId":7}},{{"text":"...","candidateId":8}}]}}. Each story must include exactly the named fields. Explain unfamiliar acronyms and institutions in plain language at first mention. Category must be one of: {', '.join(CATEGORIES)}.
PREVIOUS VALIDATION ISSUES: {json.dumps(failures)}. Fix each issue before returning valid JSON. CANDIDATES:
{payload}"""


def main():
    now = datetime.now(timezone.utc)
    candidates, failures = fetch_candidates(now)
    prompt = build_prompt(candidates, failures)
    for attempt in range(3):
        edition = api_response(prompt)
        try:
            edition = validate_edition(edition, candidates)
            break
        except RuntimeError as error:
            if "had enough GDELT/article detail" in str(error) or attempt == 2:
                raise
            failures.append("Draft attempt " + str(attempt + 1) + " failed validation: " + str(error))
            prompt = build_prompt(candidates, failures)
    game_path = Path("news-game.js")
    game = game_path.read_text(encoding="utf-8")
    app_marker = 'const app = document.querySelector("#app");'
    if "const edition = " not in game or app_marker not in game:
        raise RuntimeError("Could not locate the game edition block safely; no files were published.")
    start = game.index("const edition = ")
    end = game.index(app_marker, start)
    edition_js = "const edition = " + json.dumps(edition, ensure_ascii=False, separators=(",", ":")) + ";\n\n\n\n"
    game_path.write_text(game[:start] + edition_js + game[end:], encoding="utf-8")
    index_path = Path("index.html")
    html = index_path.read_text(encoding="utf-8")
    cache_version = edition["date"].replace("-", "") + "-" + os.environ.get("GITHUB_RUN_NUMBER", "manual")
    updated, count = re.subn(r"news-game\.js\?v=[^\"'\s]+", "news-game.js?v=" + cache_version, html)
    if count != 1:
        raise RuntimeError("Could not safely refresh the game cache version; no edition published.")
    index_path.write_text(updated, encoding="utf-8")
    print("Prepared five verified stories across " + str(len(set(item["section"] for item in edition["stories"]))) + " topics and three extra links for " + edition["date"] + ".")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("Daily edition not published: " + str(error), file=sys.stderr)
        sys.exit(1)
