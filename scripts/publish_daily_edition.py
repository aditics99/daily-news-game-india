#!/usr/bin/env python3
"""Build a sourced, validated India news game edition and prepare it for publishing."""
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html import unescape
from urllib.parse import quote_plus, urlsplit
from urllib.request import Request, urlopen
from pathlib import Path
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from zoneinfo import ZoneInfo

IST = ZoneInfo("Asia/Kolkata")
API_URL = "https://generativelanguage.googleapis.com/v1beta/models"
MODEL = "gemini-3.5-flash-lite"
CATEGORIES = ["Politics & public life", "Business & money", "Everyday India", "Science & environment", "Sport", "Culture & entertainment"]
QUERIES = [
    ("Politics & public life", "India politics government parliament court policy"),
    ("Business & money", "India business economy finance companies markets"),
    ("Everyday India", "India public services transport education health infrastructure"),
    ("Science & environment", "India science technology environment climate space"),
    ("Sport", "India sports cricket tournament results"),
    ("Culture & entertainment", "India culture entertainment film music"),
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
                "sources": {"type": "array", "items": {"type": "object", "properties": {
                    "label": {"type": "string"}, "url": {"type": "string"}
                }, "required": ["label", "url"], "additionalProperties": False}}
            },
            "required": ["section", "headline", "copy", "answer", "options", "answer2", "options2", "explanation", "sources"],
            "additionalProperties": False
        }},
        "moreToday": {"type": "array", "items": {"type": "object", "properties": {
            "text": {"type": "string"}, "url": {"type": "string"}
        }, "required": ["text", "url"], "additionalProperties": False}}
    },
    "required": ["stories", "moreToday"],
    "additionalProperties": False
}


def local_text(node, name):
    child = next((item for item in node if item.tag.rsplit("}", 1)[-1] == name), None)
    return unescape("".join(child.itertext()).strip()) if child is not None else ""


def fetch_candidates(now):
    grouped = {}
    failures = []
    for section, query in QUERIES:
        url = "https://news.google.com/rss/search?q=" + quote_plus(query + " when:1d") + "&hl=en-IN&gl=IN&ceid=IN:en"
        try:
            request = Request(url, headers={"User-Agent": "DailyNewsGameIndia/1.0 (public RSS reader)"})
            with urlopen(request, timeout=25) as response:
                root = ET.fromstring(response.read())
            for item in root.iter():
                if item.tag.rsplit("}", 1)[-1] != "item":
                    continue
                title, link, published = local_text(item, "title"), local_text(item, "link"), local_text(item, "pubDate")
                if not title or not link:
                    continue
                try:
                    date = parsedate_to_datetime(published).astimezone(timezone.utc)
                    age = max(0.0, (now - date).total_seconds() / 3600)
                except (TypeError, ValueError):
                    date, age = now, 12.0
                if age > 30:
                    continue
                description = re.sub(r"<[^>]+>", " ", local_text(item, "description"))
                description = re.sub(r"\s+", " ", unescape(description)).strip()[:500]
                source = local_text(item, "source") or "News source"
                key = re.sub(r"[^a-z0-9]+", " ", title.lower()).strip()
                entry = grouped.setdefault(key, {"title": title.replace("|", "–"), "url": link, "source": source,
                    "published": date.astimezone(IST).strftime("%Y-%m-%d %H:%M IST"), "age": age,
                    "description": description, "categories": [], "hits": 0})
                if section not in entry["categories"]:
                    entry["categories"].append(section)
                entry["hits"] += 1
                if age < entry["age"]:
                    entry.update({"url": link, "source": source, "published": date.astimezone(IST).strftime("%Y-%m-%d %H:%M IST"), "age": age, "description": description})
        except Exception as error:
            failures.append(section + ": " + type(error).__name__)
    ranked = sorted(grouped.values(), key=lambda item: item["hits"] * 12 + max(0, 30 - item["age"]) / 3, reverse=True)
    picked, seen = [], set()
    for section, _query in QUERIES:
        count = 0
        for item in ranked:
            if section in item["categories"] and item["title"] not in seen:
                picked.append(item)
                seen.add(item["title"])
                count += 1
                if count == 7:
                    break
    for item in ranked:
        if item["title"] not in seen:
            picked.append(item)
            seen.add(item["title"])
        if len(picked) >= 25:
            break
    if len(picked) < 15:
        raise RuntimeError("Only " + str(len(picked)) + " recent India leads were found; refusing to publish a thin edition. Feed status: " + ", ".join(failures))
    return picked[:25], failures


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

    searched = {canonical_url(url) for url in re.findall(r'https://[^\s"]+', prompt)}
    if not searched:
        raise RuntimeError("News feed provided no source links; refusing to publish.")
        
    return edition, searched


def canonical_url(value):
    parts = urlsplit(value.strip())
    host = (parts.hostname or "").lower()
    if host.startswith("www."):
        host = host[4:]
    path = re.sub(r"/+$", "", parts.path)
    return host + path


def contains_answer(text, answer):
    return bool(re.search(r"(?<![\w])" + re.escape(answer.strip()) + r"(?![\w])", text, re.I))


def validate_edition(edition, searched):
    stories = edition.get("stories")
    extras = edition.get("moreToday")
    if not isinstance(stories, list) or len(stories) != 5:
        raise RuntimeError("The draft must contain exactly five stories.")
    if not isinstance(extras, list) or len(extras) != 3:
        raise RuntimeError("The ending card needs three verified extra stories.")
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
            first_positions[options.index(answer)] += 1
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
        sources = story.get("sources")
        if not isinstance(sources, list) or len(sources) < 1:
            raise RuntimeError("Story " + str(index) + " needs at least one source link.")
        
        for source in sources:
            url = source.get("url", "")
            if not url.startswith("https://") or canonical_url(url) not in searched:
                raise RuntimeError("Story " + str(index) + " includes a link that was not returned by web search.")
                    

                        
    if min(first_positions) < 1 or max(first_positions) > 5:
        raise RuntimeError("Correct answers are too concentrated in one dropdown position.")
    for extra in extras:
        if not extra.get("text") or not extra.get("url", "").startswith("https://") or canonical_url(extra["url"]) not in searched:
            raise RuntimeError("An ending-card link is missing or was not returned by web search.")
    edition["date"] = datetime.now(timezone.utc).astimezone(IST).date().isoformat()
    return edition


def build_prompt(candidates, failures):
    today = datetime.now(timezone.utc).astimezone(IST).strftime("%A, %d %B %Y")
    payload = json.dumps(candidates, ensure_ascii=False)
    return f"""Prepare the {today} edition using only the India news candidates below. Use only facts included in each candidate title and description; do not add unsupported details. Choose five important stories across different topics. Use source URLs only from the candidates. The links open the original publishers. Do not use paid search tools or invent facts or links.

Choose exactly five of the most significant, genuinely current India stories from the past day. Cover different parts of life in India: politics and public life, business and money, everyday services, science/environment, sport, culture/entertainment. Spread the five across at least four topic categories; use no more than two from one category. Do not choose a story solely because it is easy to quiz.

For each story: write a specific headline; write a natural, simple story of 2–4 short sentences with the literal marker strings "{{{{1}}}}" and "{{{{2}}}}" each appearing exactly once, in that order, as the blanks. Do not use underscores, unlabeled blanks, or other placeholder formats; choose useful facts or connections rather than arbitrary trivia; give each blank three distinct, plausible choices and one correct answer; vary correct dropdown positions across the edition; add a conversational explanation that gives useful context and a real-life example where one clarifies an unfamiliar concept. Do not reveal either answer in the headline or elsewhere in the unblanked story. Avoid sentences which explain a term in another sentence and then ask for that same term. Avoid the wording pattern “X, not Y.”

Attribute allegations and changing estimates. Include specific people, places, dates, decisions, and amounts when they matter. A significant disaster may be covered; describe verified location and magnitude where relevant, and mention rescue, relief, or recovery work underway. Never make death, injury, casualty, or graphic-harm counts into a blank or score.

Source each story with at least one relevant HTTPS URL from the candidate list. Use only links that support the story; never invent a URL or claim. Choose three additional moreToday links from other candidates, separate from the five main stories.

The candidates below contain current headlines, publisher names, short snippets, timestamps, topics, and article links. Use these as your only factual basis and source links; choose stories with enough detail to write accurately.

Return only valid JSON with this shape: {{"stories":[{{"section":"...","headline":"...","copy":"...","answer":"...","options":["...","...","..."],"answer2":"...","options2":["...","...","..."],"explanation":"...","sources":[{{"label":"...","url":"https://..."}},{{"label":"...","url":"https://..."}}]}}],"moreToday":[{{"text":"...","url":"https://..."}},{{"text":"...","url":"https://..."}},{{"text":"...","url":"https://..."}}]}}. Each story must include exactly the named fields. Explain unfamiliar acronyms and institutions in plain language at first mention. Category must be one of: {', '.join(CATEGORIES)}.
PREVIOUS VALIDATION ISSUES: {json.dumps(failures)}. Fix each issue before returning valid JSON. CANDIDATES:
{payload}"""


def main():
    now = datetime.now(timezone.utc)
    candidates, failures = fetch_candidates(now)
    prompt = build_prompt(candidates, failures)
    for attempt in range(3):
        edition, searched = api_response(prompt)
        try:
            edition = validate_edition(edition, searched)
            break
        except RuntimeError as error:
            if attempt == 2:
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
