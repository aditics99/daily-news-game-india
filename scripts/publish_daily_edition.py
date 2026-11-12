#!/usr/bin/env python3
"""Build a sourced, validated India news game edition and prepare it for publishing."""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from html import unescape
from html.parser import HTMLParser
from urllib.parse import quote_plus, urlsplit
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from pathlib import Path
import json
import os
import re
import sys
import time
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from zoneinfo import ZoneInfo

IST = ZoneInfo("Asia/Kolkata")
API_URL = "https://generativelanguage.googleapis.com/v1beta/models"
MODEL = "gemini-3.5-flash-lite"
CATEGORIES = ["Politics & public life", "Business & money", "Everyday India", "Science & environment", "Sport", "Culture & entertainment"]
INDIAN_PUBLISHER_HOSTS = (
    "thehindu.com", "timesofindia.indiatimes.com", "indianexpress.com",
    "hindustantimes.com", "ndtv.com", "livemint.com", "business-standard.com",
    "economictimes.indiatimes.com", "moneycontrol.com", "news18.com",
    "theprint.in", "scroll.in", "tribuneindia.com", "deccanherald.com",
    "indiatoday.in", "ptinews.com", "aninews.in", "newindianexpress.com",
    "financialexpress.com", "telegraphindia.com", "deccanchronicle.com",
)
TOPIC_PATTERNS = {
    "Politics & public life": [r"\bpolitic", r"\bparliament\b", r"\belection", r"\bminister\b", r"\bgovernment\b", r"\bcourt\b", r"\bbill\b", r"\bpolicy\b", r"\bmodi\b", r"\bbjp\b", r"\bcongress\b", r"\bassembly\b", r"\bvote\b", r"\bpoll\b"],
    "Business & money": [r"\bbusiness\b", r"\beconom", r"\bcompany\b", r"\bcompanies\b", r"\bcorporate\b", r"\bIPO\b", r"\bshare\b", r"\bshares\b", r"\boffering\b", r"\bmarket\b", r"\bstock\b", r"\bbank\b", r"\bfinance\b", r"\btax\b", r"\binflation\b", r"\bprice", r"\btrade\b", r"\binvest", r"\bindustry\b", r"\bearnings\b", r"\bprofit", r"\bauction\b"],
    "Everyday India": [r"\bmetro\b", r"\btrain\b", r"\brail", r"\bschool\b", r"\beducation\b", r"\bhealth\b", r"\bhospital\b", r"\bmedicine\b", r"\bwater\b", r"\bpower\b", r"\btraffic\b", r"\btransport\b", r"\bweather\b", r"\bcity\b", r"\bpension\b", r"\bration\b", r"\bfuel\b", r"\bpetrol\b"],
    "Science & environment": [r"\bscience\b", r"\btechnology\b", r"\btech\b", r"\bspace\b", r"\bisro\b", r"\bsatellite\b", r"\bclimate\b", r"\benvironment\b", r"\bpollution\b", r"\benergy\b", r"\bsolar\b", r"\bresearch\b", r"\bAI\b", r"\binnovation\b"],
    "Sport": [r"\bsport", r"\bcricket\b", r"\bfootball\b", r"\bhockey\b", r"\btennis\b", r"\bbadminton\b", r"\bolympic", r"\bworld cup\b", r"\bIPL\b", r"\btournament\b", r"\bathlet", r"\bwicket\b", r"\bgoal\b", r"\bmedal\b", r"\bchess\b"],
    "Culture & entertainment": [r"\bfilm\b", r"\bmovie\b", r"\bactor", r"\bactress\b", r"\bcinema\b", r"\bmusic\b", r"\bsinger\b", r"\bconcert\b", r"\bbook\b", r"\bauthor\b", r"\bart\b", r"\btheatre\b", r"\bfestival\b", r"\bstreaming\b", r"\bBollywood\b", r"\bdance\b"],
}


def infer_categories(title):
    matches = [section for section, patterns in TOPIC_PATTERNS.items()
               if any(re.search(pattern, title, re.I) for pattern in patterns)]
    return matches


def is_indian_publisher(domain):
    domain = (domain or "").lower().removeprefix("www.")
    return domain.endswith(".in") or any(
        domain == host or domain.endswith("." + host)
        for host in INDIAN_PUBLISHER_HOSTS
    )


INDIA_CONTEXT_PATTERN = re.compile(
    r"\b(?:India|Indian|Bharat|New Delhi|Delhi|Mumbai|Bengaluru|Bangalore|Kolkata|Calcutta|Chennai|Madras|Hyderabad|Pune|Ahmedabad|Jaipur|Lucknow|Patna|Bhopal|Guwahati|Kochi|Thiruvananthapuram|Chandigarh|Srinagar|Jammu|Maharashtra|Gujarat|Rajasthan|Punjab|Haryana|Bihar|Odisha|Assam|Kerala|Karnataka|Tamil Nadu|Telangana|Andhra Pradesh|Uttar Pradesh|Madhya Pradesh|West Bengal|Chhattisgarh|Jharkhand|Uttarakhand|Himachal Pradesh|Goa|Manipur|Meghalaya|Mizoram|Nagaland|Tripura|Sikkim|Arunachal Pradesh|Lok Sabha|Rajya Sabha|RBI|ISRO|DRDO|Election Commission|Supreme Court of India|Reserve Bank of India|Modi|BJP|Congress|rupee|Gokul|Maruti)\b",
    re.I,
)

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
        india_context = item["title"] + " " + detail[:900]
        if enough_article_detail and INDIA_CONTEXT_PATTERN.search(india_context):
            enriched.append(item)
    return enriched


def fetch_candidates(now):
    failures = []
    query = "sourcecountry:india sourcelang:english"
    params = "query=" + quote_plus(query) + "&mode=artlist&maxrecords=250&timespan=1d&sort=hybridrel&format=json"
    url = "https://api.gdeltproject.org/api/v2/doc/doc?" + params
    data = None
    for attempt in range(4):
        request = Request(url, headers={"User-Agent": "DailyNewsGameIndia/1.0 (+https://github.com/aditics99/daily-news-game-india)"})
        try:
            with urlopen(request, timeout=45) as response:
                raw = response.read().decode("utf-8", errors="replace")
            try:
                data = json.loads(raw)
            except ValueError as error:
                if "Please limit requests" in raw:
                    if attempt < 3:
                        pause = 12 * (2 ** attempt)
                        print("GDELT is rate-limiting requests; retrying once the cooldown passes.")
                        time.sleep(pause)
                        continue
                    raise RuntimeError("GDELT rate limit: " + raw[:220]) from error
                raise RuntimeError("GDELT returned unreadable article results: " + raw[:160]) from error
            break
        except HTTPError as error:
            detail = error.read().decode("utf-8", errors="replace")[:220]
            if error.code == 429 and attempt < 3:
                pause = 12 * (2 ** attempt)
                print("GDELT is rate-limiting requests; retrying once the cooldown passes.")
                time.sleep(pause)
                continue
            failures.append("GDELT HTTP " + str(error.code) + (": " + detail if detail else ""))
            break
        except Exception as error:
            failures.append("GDELT: " + str(error)[:220])
            break

    grouped = {}
    # DOC search may be rate-limited independently of this scheduled job.
    # GDELT also publishes its Article List as a public RSS feed. Use that
    # rolling feed as a discovery fallback; article-page checks below still
    # decide whether a lead contains enough evidence to use.
    if not data or not data.get("articles"):
        try:
            feed_request = Request(
                "https://data.gdeltproject.org/gdeltv3/gal/feed.rss",
                headers={"User-Agent": "DailyNewsGameIndia/1.0 (+https://github.com/aditics99/daily-news-game-india)"},
            )
            with urlopen(feed_request, timeout=45) as response:
                feed_root = ET.fromstring(response.read())

            feed_articles = []
            for order, node in enumerate(feed_root.iter()):
                if node.tag.rsplit("}", 1)[-1].lower() != "item":
                    continue
                fields = {
                    child.tag.rsplit("}", 1)[-1].lower(): (child.text or "").strip()
                    for child in list(node)
                }
                title = re.sub(r"\s+", " ", fields.get("title", "")).strip()
                link = fields.get("link", "").strip()
                published = fields.get("pubdate", "")
                if not title or not link or urlsplit(link).scheme != "https" or not published:
                    continue
                try:
                    date = parsedate_to_datetime(published)
                    if date.tzinfo is None:
                        date = date.replace(tzinfo=timezone.utc)
                    date = date.astimezone(timezone.utc)
                except (TypeError, ValueError, OverflowError):
                    continue
                letters = [char for char in title if char.isalpha()]
                if not letters or sum(char.isascii() for char in letters) / len(letters) < 0.85:
                    continue
                feed_articles.append({
                    "title": title,
                    "url": link,
                    "domain": urlsplit(link).hostname or "",
                    "seendate": date.strftime("%Y%m%dT%H%M%SZ"),
                    # Prefer Indian outlets and titles with explicit India
                    # context before the 60-page detail check. The page text
                    # still has to pass the existing India relevance gate.
                    "_feed_rank": order - (
                        10000
                        if is_indian_publisher(urlsplit(link).hostname)
                        or INDIA_CONTEXT_PATTERN.search(title)
                        else 0
                    ),
                })

            if feed_articles:
                data = {"articles": feed_articles}
                failures.append("DOC search unavailable; used GDELT Article List RSS fallback.")
                print("GDELT DOC search was unavailable; using its public Article List feed.")
            else:
                failures.append("GDELT Article List RSS fallback returned no usable leads.")
        except Exception as error:
            failures.append("GDELT Article List RSS fallback: " + str(error)[:180])

    for order, article in enumerate((data or {}).get("articles", [])):
        title = re.sub(r"\s+", " ", str(article.get("title", "")).strip())
        link = str(article.get("url", "")).strip()
        domain = str(article.get("domain", "")).strip()
        if not title or not link or urlsplit(link).scheme != "https":
            continue
        try:
            date = datetime.strptime(str(article.get("seendate", "")), "%Y%m%dT%H%M%SZ").replace(tzinfo=timezone.utc)
            age = max(0.0, (now - date).total_seconds() / 3600)
        except (TypeError, ValueError):
            continue
        if age > 30:
            continue
        key = canonical_url(link) or re.sub(r"[^a-z0-9]+", " ", title.lower()).strip()
        grouped.setdefault(key, {
            "title": title.replace("|", "–"), "url": link, "source": domain or "News source",
            "published": date.astimezone(IST).strftime("%Y-%m-%d %H:%M IST"), "age": age,
            "description": "", "categories": infer_categories(title), "hits": 1, "rank": article.get("_feed_rank", order)
        })

    ranked = sorted(grouped.values(), key=lambda item: (item["rank"], item["age"]))
    # Interleave topics before fetching full articles so the 25-item prompt
    # does not get filled by the first categories in the list.
    picked, seen = [], set()
    topic_queues = {
        section: [item for item in ranked if section in item["categories"]]
        for section in CATEGORIES
    }
    while len(picked) < 60:
        added = False
        for section in CATEGORIES:
            next_item = next((item for item in topic_queues[section] if item["url"] not in seen), None)
            if next_item:
                picked.append(next_item)
                seen.add(next_item["url"])
                added = True
                if len(picked) >= 60:
                    break
        if not added:
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
            if any(re.search(r"\d", str(option)) for option in (options or [])):
                raise RuntimeError("Story " + str(index) + " blank " + str(n) + " uses a numeric answer choice.")
            clean_options = [str(option).strip() for option in options] if isinstance(options, list) else []
            answer_matches = [i for i, option in enumerate(clean_options) if option.casefold() == answer.strip().casefold()]
            if len(clean_options) != 3 or len({option.casefold() for option in clean_options}) != 3 or len(answer_matches) != 1:
                raise RuntimeError("Story " + str(index) + " blank " + str(n) + " needs three different choices and one correct answer.")
            clean_options[answer_matches[0]] = answer
            options = clean_options
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
        story_text = story["headline"] + " " + body
        if not INDIA_CONTEXT_PATTERN.search(story_text):
            raise RuntimeError("Story " + str(index) + " does not clearly connect the event to India.")
        supported_sections = {section for value in candidate_ids for section in candidate_by_id[value]["categories"]}
        if story["section"] not in supported_sections:
            raise RuntimeError("Story " + str(index) + " topic does not match its selected candidate.")
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

Choose exactly five of the most significant, genuinely current stories about India from the past day. A publisher being based in India does not make an unrelated foreign story an India story; include an international event only when the supplied article explains its direct effect on India. Cover different parts of life in India: politics and public life, business and money, everyday services, science/environment, sport, culture/entertainment. Spread the five across at least four topic categories; use no more than two from one category. Do not choose a story solely because it is easy to quiz.

For each story: write a specific headline; write a natural, simple story of 2–4 short sentences with the literal marker strings "{{{{1}}}}" and "{{{{2}}}}" each appearing exactly once, in that order, as the blanks. Do not use underscores, unlabeled blanks, or other placeholder formats; choose useful facts or connections rather than arbitrary trivia; never make money amounts, votes, shares, percentages, counts, or other numeric totals into blanks; no answer or dropdown choice may contain a digit; if a fact is numeric, choose another useful fact; give each blank three distinct, plausible choices and one correct answer; vary correct dropdown positions across the edition; add a conversational explanation that gives useful context and a real-life example where one clarifies an unfamiliar concept. Do not reveal either answer in the headline or elsewhere in the unblanked story. Avoid sentences which explain a term in another sentence and then ask for that same term. Avoid the wording pattern “X, not Y.”

Attribute allegations and changing estimates. Include specific people, places, dates, decisions, and amounts when they matter. A significant disaster may be covered; describe verified location and magnitude where relevant, and mention rescue, relief, or recovery work underway. Never make death, injury, casualty, or graphic-harm counts into a blank or score.

Use only candidates whose supplied evidence supports the key who/what/where and why of the story. Skip thin or vague leads: do not fill missing context from memory or guess what an article probably says. If fewer than five candidates can support complete, accurate stories, return fewer than five stories; the publishing check will keep the previous edition live rather than publish guessed copy. For each story, return candidateIds containing the number of the most relevant candidate or candidates used. Do not return URLs. Each candidate has an id number. For moreToday, return candidateId for a different relevant candidate not already used among the five stories. The script will attach the original URLs, so do not write or alter URLs.

The candidates below have stable integer id values, publisher names, timestamps, topics, and evidence gathered from GDELT snippets plus accessible article-page text or metadata. Cite them by id. Use only the supplied evidence; skip a story if it does not establish enough facts to explain what happened and why. Article pages that block access or provide too little detail are excluded. Do not infer missing facts from a headline. The script will add the original source links.

Return only valid JSON with this shape: {{"stories":[{{"section":"...","headline":"...","copy":"...","answer":"...","options":["...","...","..."],"answer2":"...","options2":["...","...","..."],"explanation":"...","candidateIds":[1]}}],"moreToday":[{{"text":"...","candidateId":6}},{{"text":"...","candidateId":7}},{{"text":"...","candidateId":8}}]}}. Each story must include exactly the named fields. Explain unfamiliar acronyms and institutions in plain language at first mention. Category must be one of: {', '.join(CATEGORIES)}.
PREVIOUS VALIDATION ISSUES: {json.dumps(failures)}. Repair all listed validation issues before returning JSON. Preserve valid story facts and change only the affected story: replace duplicate choices with distinct plausible choices grounded in its candidate evidence; if an unblanked sentence gives away an answer, replace that sentence with a different verified detail from the same evidence; if blank markers are missing or out of order, rewrite only that story so both markers appear exactly once and in order. Recheck all stories for duplicate choices, answer leaks, exactly two blanks, and numeric answer choices. Do not invent facts. CANDIDATES:
{payload}"""


def build_repair_prompt(edition, candidates, error):
    evidence = [{
        "id": item["id"], "publisher": item["source"], "title": item["title"],
        "evidence": item["evidence"]
    } for item in candidates]
    return f"""Repair this draft using only the collected article evidence. The validator reported: {str(error)}

This is a targeted repair. Preserve valid stories, topics, explanations, and candidateIds. Return the complete edition as valid JSON in the same schema.

If an unblanked sentence gives away a blank, locate the named story and blank. Replace the entire sentence that reveals the answer with a different specific fact stated in that story's candidate evidence. Do not repeat the answer anywhere in the headline or unblanked copy, and do not use a synonym or another clue that makes it obvious. Keep both blank markers exactly once and in order. If no other supported sentence can be written, change the answer and rewrite that blank using a different fact the evidence supports.

If answer choices are duplicated or invalid, replace only faulty distractors with distinct plausible choices that do not overlap in meaning. If the validator reports a numeric answer choice, replace that blank with a useful non-numeric fact from the same candidate evidence: rewrite its sentence, answer, and all three choices so none contains a digit. Never quiz money amounts, counts, percentages, or other numeric totals.

Do not invent facts, change candidate IDs unnecessarily, or add URLs. Keep the writing simple and specific. Before returning, check every headline and unblanked sentence against both answers, and ensure each blank has exactly three distinct choices.

DRAFT:
{json.dumps(edition, ensure_ascii=False)}

CANDIDATE EVIDENCE:
{json.dumps(evidence, ensure_ascii=False)}"""


def main():
    now = datetime.now(timezone.utc)
    candidates, failures = fetch_candidates(now)
    prompt = build_prompt(candidates, failures)
    for attempt in range(5):
        edition = api_response(prompt)
        try:
            edition = validate_edition(edition, candidates)
            break
        except RuntimeError as error:
            if "had enough GDELT/article detail" in str(error) or attempt == 4:
                raise
            failures.append("Draft attempt " + str(attempt + 1) + " failed validation: " + str(error))
            prompt = build_repair_prompt(edition, candidates, error)
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
