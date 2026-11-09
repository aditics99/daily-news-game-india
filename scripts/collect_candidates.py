#!/usr/bin/env python3
"""Collect a ranked, unreviewed list of English-language India news leads."""
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html import unescape
from urllib.parse import quote_plus
from urllib.request import Request, urlopen
import re
import xml.etree.ElementTree as ET
from zoneinfo import ZoneInfo

IST = ZoneInfo("Asia/Kolkata")
QUERIES = [
    ("India", "India"),
    ("Politics", "India politics"),
    ("Business", "India business economy"),
    ("Sport", "India sports"),
    ("Science & technology", "India science technology"),
    ("Culture & entertainment", "India culture entertainment"),
]
EXCLUDE = re.compile(r"\b(killed|dead|death|dies|died|murder|rape|assault|crash|explosion|bomb|attack|terror|injured|flood|cyclone|earthquake|suicide|massacre)\b", re.I)

def text_of(node, name):
    child = next((item for item in node if item.tag.rsplit("}", 1)[-1] == name), None)
    return unescape("".join(child.itertext()).strip()) if child is not None else ""

def fetch(query, now):
    url = "https://news.google.com/rss/search?q=" + quote_plus(query + " when:1d") + "&hl=en-IN&gl=IN&ceid=IN:en"
    request = Request(url, headers={"User-Agent": "DailyNewsGameIndia/1.0 (public RSS reader)"})
    with urlopen(request, timeout=20) as response:
        root = ET.fromstring(response.read())
    items = []
    for item in root.iter():
        if item.tag.rsplit("}", 1)[-1] != "item":
            continue
        title = text_of(item, "title")
        link = text_of(item, "link")
        published = text_of(item, "pubDate")
        if not title or not link or EXCLUDE.search(title):
            continue
        try:
            date = parsedate_to_datetime(published).astimezone(timezone.utc)
            age = max(0.0, (now - date).total_seconds() / 3600)
        except (TypeError, ValueError):
            date, age = now, 12.0
        source = text_of(item, "source") or "News source"
        items.append({"title": title.replace("|", "–"), "url": link, "source": source, "date": date, "age": age, "query": query})
    return items

def main():
    now = datetime.now(timezone.utc)
    edition_date = now.astimezone(IST).date().isoformat()
    grouped = {}
    failures = []
    for label, query in QUERIES:
        try:
            for item in fetch(query, now):
                key = re.sub(r"[^a-z0-9]+", " ", item["title"].lower()).strip()
                entry = grouped.setdefault(key, {**item, "categories": set(), "query_hits": 0})
                entry["categories"].add(label)
                entry["query_hits"] += 1
                if item["age"] < entry["age"]:
                    entry.update(item)
        except Exception as error:
            failures.append(f"{label}: {type(error).__name__}")
    ranked = sorted(grouped.values(), key=lambda item: (item["query_hits"] * 10 + max(0, 24 - item["age"]) / 4), reverse=True)[:25]
    print(f"# Morning India news leads — {edition_date}\n")
    print("These are discovery leads from Google News RSS, ranked by appearance across topic searches and recency. They are not approved game stories and are not published on the website. Check the linked reporting, avoid tragedy-led stories, then write and review five simple stories with two fair blanks each.\n")
    if failures:
        print("Some topic searches did not load: " + ", ".join(failures) + ".\n")
    if not ranked:
        print("No usable headlines were returned today. Check the RSS workflow before preparing an edition.")
        return
    for index, item in enumerate(ranked, 1):
        categories = ", ".join(sorted(item["categories"]))
        published = item["date"].astimezone(IST).strftime("%I:%M %p IST")
        title = item["title"].replace("[", "(").replace("]", ")")
        print(f"{index}. [{title}]({item['url']}) — {item['source']} · {published} · {categories}")

if __name__ == "__main__":
    main()
