import argparse
import html
import json
import os
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

DEFAULT_TERMS = [
    "world cup",
    "fifa world cup",
    "mundial 2026",
    "world cup 2026",
    "match thread",
    "ticket",
    "stream",
]

DEFAULT_INSTAGRAM_PROFILES = [
    "fifaworldcup",
    "433",
    "espnfc",
    "brfootball",
    "goalglobal",
    "lamediainglesa",
]

DEFAULT_FACEBOOK_PAGES = [
    "365scores",
    "ESPNFC",
    "goalglobal",
    "fifaworldcup",
]

DEFAULT_YOUTUBE_CHANNELS = [
    "https://www.youtube.com/channel/UCGYYNGmyhZ_kwBF_lqqXdAQ",  # Tifo Football
    "https://www.youtube.com/@TheOverlap",
    "https://www.youtube.com/LaMediaInglesa",
    "https://www.youtube.com/c/elenganche/videos",
]

DEFAULT_X_QUERIES = [
    '"World Cup 2026"',
    '"Mundial 2026"',
    '"FIFA World Cup"',
    '"match thread"',
]

DEFAULT_REDDIT_SUBREDDITS = [
    "soccer",
    "futbol",
    "worldcup",
    "fifa",
]

FOOTBALL_WORDS = [
    "world cup",
    "mundial",
    "fifa",
    "football",
    "futbol",
    "soccer",
    "match",
    "partido",
    "goal",
    "gol",
    "ticket",
    "stream",
    "watchalong",
]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def sanitize_text(value: object, max_length: int = 320) -> str:
    text = re.sub(r"\s+", " ", str(value or "")).strip()
    if len(text) <= max_length:
        return text
    return text[: max_length - 3].rstrip() + "..."


def make_id(prefix: str, *parts: object) -> str:
    body = "-".join(re.sub(r"[^a-z0-9]+", "-", str(p or "").lower()).strip("-") for p in parts)
    body = re.sub(r"-{2,}", "-", body).strip("-")
    return f"{prefix}-{body[:90] or int(datetime.now().timestamp())}"


def infer_sentiment(text: str) -> str:
    lower = text.lower()
    negative = ["problem", "issue", "broken", "can't", "error", "scam", "bad", "slow", "worst", "awful", "fraud"]
    positive = ["great", "good", "love", "works", "easy", "brilliant", "amazing", "best"]
    n = sum(1 for word in negative if word in lower)
    p = sum(1 for word in positive if word in lower)
    if n > p:
        return "negativo"
    if p > n:
        return "positivo"
    return "mixto" if (n or p) else "neutral"


def is_relevant(text: str, terms: list[str]) -> bool:
    lower = text.lower()
    return any(term.lower() in lower for term in terms + FOOTBALL_WORDS)


# Las reglas del Experience Radar prohiben apuestas/cuotas como senal social.
BETTING_WORDS = [
    "odds", "betting", "bet builder", "bet-builder", "parlay", "moneyline",
    "bookmaker", "sportsbook", "markets:", "draftkings", "fanduel", "bet365",
    "stake.com", "apuesta", "apuestas", "cuota", "cuotas", "pronostico de apuesta",
    "picks for", "betting tips", "best bets", "+ev",
]


def is_betting(text: str) -> bool:
    lower = text.lower()
    return any(word in lower for word in BETTING_WORDS)


def env_list(name: str, default: list[str]) -> list[str]:
    raw = os.environ.get(name, "").strip()
    if not raw:
        return default
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, list):
            return [str(item).strip() for item in parsed if str(item).strip()]
    except Exception:
        pass
    return [item.strip() for item in raw.split(",") if item.strip()] or default


def collect_instagram(terms: list[str]) -> tuple[list[dict], dict]:
    try:
        import instaloader
    except Exception as exc:
        return [], {
            "id": "instagram-unavailable",
            "name": "Instagram via Instaloader",
            "type": "instagram",
            "url": "https://instaloader.github.io/",
            "ok": False,
            "itemCount": 0,
            "note": f"Instaloader no disponible: {exc}",
        }

    loader = instaloader.Instaloader(
        download_pictures=False,
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
        quiet=True,
    )
    ctx = loader.context
    session_user = os.environ.get("RADAR_INSTAGRAM_USERNAME", "").strip()
    session_file = os.environ.get("RADAR_INSTAGRAM_SESSIONFILE", "").strip()
    if session_user and session_file:
        try:
            loader.load_session_from_file(session_user, session_file)
        except Exception:
            pass
    detected_at = now_iso()
    signals: list[dict] = []

    for profile_name in env_list("RADAR_INSTAGRAM_PROFILES", DEFAULT_INSTAGRAM_PROFILES)[:8]:
        try:
            profile = instaloader.Profile.from_username(ctx, profile_name)
            count = 0
            for post in profile.get_posts():
                caption = sanitize_text(post.caption or "", 320)
                title = sanitize_text(caption.split(".")[0] if caption else f"Instagram: {profile_name}", 180)
                if not is_relevant(f"{title} {caption}", terms):
                    count += 1
                    if count >= 4:
                        break
                    continue
                signals.append({
                    "id": make_id("instagram", profile_name, post.shortcode),
                    "sourceType": "instagram",
                    "sourceName": "Instagram via Instaloader",
                    "sourceUrl": f"https://www.instagram.com/{profile_name}/",
                    "title": title,
                    "summary": caption or title,
                    "url": f"https://www.instagram.com/p/{post.shortcode}/",
                    "publishedAt": post.date_utc.replace(tzinfo=timezone.utc).isoformat() if post.date_utc else detected_at,
                    "detectedAt": detected_at,
                    "category": "Conversacion social",
                    "players": [],
                    "teams": [],
                    "tags": [profile_name, "Instagram"],
                    "score": int(getattr(post, "likes", 0) or 0),
                    "sentiment": infer_sentiment(f"{title} {caption}"),
                    "classifications": [],
                })
                count += 1
                if count >= 4:
                    break
        except Exception:
            continue

    return signals[:24], {
        "id": "instagram-instaloader",
        "name": "Instagram via Instaloader",
        "type": "instagram",
        "url": "https://instaloader.github.io/",
        "ok": len(signals) > 0,
        "itemCount": len(signals),
        "note": "Capturas best-effort desde perfiles publicos. Si Meta bloquea la consulta publica, configura RADAR_INSTAGRAM_USERNAME y RADAR_INSTAGRAM_SESSIONFILE con una sesion propia para mejorar estabilidad. Instagrapi queda instalado como alternativa con sesion propia, no como bypass anonimo.",
    }


def collect_facebook(terms: list[str]) -> tuple[list[dict], dict]:
    try:
        from facebook_scraper import get_posts
    except Exception as exc:
        return [], {
            "id": "facebook-unavailable",
            "name": "Facebook via facebook-scraper",
            "type": "facebook",
            "url": "https://github.com/kevinzg/facebook-scraper",
            "ok": False,
            "itemCount": 0,
            "note": f"facebook-scraper no disponible: {exc}",
        }

    detected_at = now_iso()
    signals: list[dict] = []
    cookies_path = os.environ.get("RADAR_FACEBOOK_COOKIES", "").strip() or None

    for page in env_list("RADAR_FACEBOOK_PAGES", DEFAULT_FACEBOOK_PAGES)[:8]:
        try:
            iterator = get_posts(
                page,
                pages=4,
                cookies=cookies_path,
                timeout=20,
                options={"comments": False, "reactors": False, "allow_extra_requests": False},
            )
            count = 0
            for post in iterator:
                text = sanitize_text(post.get("text") or post.get("post_text") or "", 320)
                title = sanitize_text(text.split(".")[0] if text else f"Facebook: {page}", 180)
                if not is_relevant(f"{title} {text}", terms):
                    count += 1
                    if count >= 4:
                        break
                    continue
                post_id = post.get("post_id") or post.get("time") or count
                post_url = post.get("post_url") or f"https://www.facebook.com/{page}"
                likes = post.get("likes") or 0
                comments = post.get("comments") or 0
                shares = post.get("shares") or 0
                signals.append({
                    "id": make_id("facebook", page, post_id),
                    "sourceType": "facebook",
                    "sourceName": "Facebook via facebook-scraper",
                    "sourceUrl": f"https://www.facebook.com/{page}",
                    "title": title,
                    "summary": text or title,
                    "url": str(post_url),
                    "publishedAt": sanitize_text(post.get("time"), 80) or detected_at,
                    "detectedAt": detected_at,
                    "category": "Conversacion social",
                    "players": [],
                    "teams": [],
                    "tags": [page, "Facebook", f"likes:{likes}", f"comments:{comments}", f"shares:{shares}"],
                    "score": int(likes) + int(comments) * 2 + int(shares) * 3,
                    "sentiment": infer_sentiment(f"{title} {text}"),
                    "classifications": [],
                })
                count += 1
                if count >= 4:
                    break
        except Exception:
            continue

    return signals[:24], {
        "id": "facebook-scraper",
        "name": "Facebook via facebook-scraper",
        "type": "facebook",
        "url": "https://github.com/kevinzg/facebook-scraper",
        "ok": len(signals) > 0,
        "itemCount": len(signals),
        "note": "Páginas públicas en modo best-effort; las cookies de una sesión propia mejoran estabilidad si se configuran.",
    }


def collect_youtube(terms: list[str]) -> tuple[list[dict], dict]:
    try:
        from yt_dlp import YoutubeDL
        from youtube_comment_downloader import SORT_BY_RECENT, YoutubeCommentDownloader
    except Exception as exc:
        return [], {
            "id": "youtube-unavailable",
            "name": "YouTube comments",
            "type": "youtube",
            "url": "https://github.com/egbertbouman/youtube-comment-downloader",
            "ok": False,
            "itemCount": 0,
            "note": f"Herramientas de YouTube no disponibles: {exc}",
        }

    detected_at = now_iso()
    signals: list[dict] = []
    downloader = YoutubeCommentDownloader()
    ydl_opts = {
        "quiet": True,
        "extract_flat": True,
        "playlistend": 3,
        "skip_download": True,
        "ignoreerrors": True,
    }

    for channel_url in env_list("RADAR_YOUTUBE_CHANNELS", DEFAULT_YOUTUBE_CHANNELS)[:8]:
        try:
            with YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(channel_url, download=False)
        except Exception:
            continue

        entries = (info or {}).get("entries") or []
        for entry in entries[:3]:
            video_id = entry.get("id")
            title = sanitize_text(entry.get("title") or "YouTube", 180)
            if not video_id or len(str(video_id)) != 11:
                continue
            video_url = f"https://www.youtube.com/watch?v={video_id}"
            comments = []
            try:
                for comment in downloader.get_comments_from_url(video_url, sort_by=SORT_BY_RECENT):
                    text = sanitize_text(comment.get("text") or "", 220)
                    if text:
                        comments.append(text)
                    if len(comments) >= 20:
                        break
            except Exception:
                comments = []

            haystack = f"{title} {' '.join(comments[:5])}"
            if not is_relevant(haystack, terms):
                continue

            signals.append({
                "id": make_id("youtube", video_id),
                "sourceType": "youtube",
                "sourceName": "YouTube comments",
                "sourceUrl": channel_url,
                "title": title,
                "summary": sanitize_text(" | ".join(comments[:4]) or title, 320),
                "url": video_url,
                "publishedAt": detected_at,
                "detectedAt": detected_at,
                "category": "Conversacion social",
                "players": [],
                "teams": [],
                "tags": ["YouTube", channel_url],
                "score": len(comments),
                "highlightedComments": comments[:3],
                "sentiment": infer_sentiment(haystack),
                "classifications": [],
            })

    return signals[:24], {
        "id": "youtube-comments",
        "name": "YouTube comments",
        "type": "youtube",
        "url": "https://github.com/egbertbouman/youtube-comment-downloader",
        "ok": len(signals) > 0,
        "itemCount": len(signals),
        "note": "Comentarios de videos recientes en canales de analistas/comentaristas reconocidos, sin usar la API oficial. Chat-downloader queda disponible para directos o watchalongs cuando RADAR_YOUTUBE_CHANNELS incluya enlaces accesibles.",
    }


def _x_query(terms: list[str]) -> str:
    quoted_terms = []
    for term in terms[:10]:
        cleaned = sanitize_text(term, 80).replace('"', "")
        if not cleaned:
            continue
        quoted_terms.append(f'"{cleaned}"' if " " in cleaned else cleaned)
    if not quoted_terms:
        quoted_terms = DEFAULT_X_QUERIES
    return " OR ".join(quoted_terms)


def collect_x(terms: list[str]) -> tuple[list[dict], dict]:
    detected_at = now_iso()
    query = os.environ.get("RADAR_X_QUERY", "").strip() or _x_query(terms)
    signals: list[dict] = []

    try:
        import snscrape.modules.twitter as sntwitter
    except Exception as exc:
        return [], {
            "id": "x-unavailable",
            "name": "X/Twitter via snscrape",
            "type": "x",
            "url": "https://github.com/JustAnotherArchivist/snscrape",
            "ok": False,
            "itemCount": 0,
            "note": f"snscrape no disponible: {sanitize_text(exc, 220)}",
        }

    error_note = ""
    try:
        scraper = sntwitter.TwitterSearchScraper(query)
        scanned = 0
        for item in scraper.get_items():
            scanned += 1
            text = sanitize_text(getattr(item, "rawContent", "") or getattr(item, "content", ""), 320)
            if text and is_relevant(text, terms):
                user = getattr(getattr(item, "user", None), "username", "") or "x"
                url = getattr(item, "url", "") or f"https://x.com/{user}/status/{getattr(item, 'id', '')}"
                item_date = getattr(item, "date", None)
                signals.append({
                    "id": make_id("x", user, getattr(item, "id", scanned)),
                    "sourceType": "x",
                    "sourceName": "X/Twitter via snscrape",
                    "sourceUrl": "https://x.com/search",
                    "title": sanitize_text(text.split(".")[0], 180) or f"X: {user}",
                    "summary": text,
                    "url": str(url),
                    "publishedAt": item_date.replace(tzinfo=timezone.utc).isoformat() if item_date else detected_at,
                    "detectedAt": detected_at,
                    "category": "Conversacion social",
                    "players": [],
                    "teams": [],
                    "tags": ["X", user],
                    "score": int(getattr(item, "likeCount", 0) or 0) + int(getattr(item, "retweetCount", 0) or 0) * 2,
                    "sentiment": infer_sentiment(text),
                    "classifications": [],
                })
            if len(signals) >= 24 or scanned >= 120:
                break
    except Exception as exc:
        error_note = sanitize_text(exc, 240)

    note = "Busqueda best-effort en X sin API oficial. Si X bloquea el endpoint anonimo, twscrape/twikit requieren una sesion/cookies propias antes de producir senales reales."
    if error_note:
        note = f"{note} Ultimo error: {error_note}"

    return signals[:24], {
        "id": "x-snscrape",
        "name": "X/Twitter via snscrape",
        "type": "x",
        "url": "https://github.com/JustAnotherArchivist/snscrape",
        "ok": len(signals) > 0,
        "itemCount": len(signals),
        "note": note,
    }


def _fetch_json(url, headers=None, timeout=20):
    req = urllib.request.Request(url, headers=headers or {"User-Agent": "ExperienceRadarSocial/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8", "replace"))


def _reddit_app_token(client_id, client_secret, user_agent):
    """Token app-only (client_credentials) para oauth.reddit.com. App gratuita en reddit.com/prefs/apps."""
    import base64
    creds = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    body = urllib.parse.urlencode({"grant_type": "client_credentials"}).encode()
    req = urllib.request.Request(
        "https://www.reddit.com/api/v1/access_token",
        data=body,
        headers={
            "Authorization": f"Basic {creds}",
            "User-Agent": user_agent,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8", "replace")).get("access_token", "")


def _fetch_text(url, headers=None, timeout=20):
    req = urllib.request.Request(url, headers=headers or {"User-Agent": "ExperienceRadarSocial/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8", "replace")


def _strip_html(value: object, max_length: int = 320) -> str:
    text = re.sub(r"<[^>]+>", " ", str(value or ""))
    return sanitize_text(html.unescape(text), max_length)


def collect_googlenews(terms: list[str]) -> tuple[list[dict], dict]:
    """Cobertura mediatica via Google News RSS (search), sin API key. Arranque inmediato."""
    detected_at = now_iso()
    signals: list[dict] = []
    error_note = ""
    hl = os.environ.get("RADAR_GNEWS_HL", "es-419").strip() or "es-419"
    gl = os.environ.get("RADAR_GNEWS_GL", "CO").strip() or "CO"
    lang = hl.split("-")[0]
    q_terms = [sanitize_text(t, 60).replace('"', "") for t in terms[:5] if sanitize_text(t, 60)]
    query = " OR ".join(f'"{t}"' if " " in t else t for t in q_terms) or "Mundial 2026"
    url = "https://news.google.com/rss/search?" + urllib.parse.urlencode(
        {"q": query, "hl": hl, "gl": gl, "ceid": f"{gl}:{lang}"}
    )
    try:
        root = ET.fromstring(_fetch_text(url, headers={"User-Agent": "Mozilla/5.0 (ExperienceRadarSocial)"}))
        for item in root.findall(".//item"):
            title = sanitize_text(item.findtext("title") or "", 200)
            if not title:
                continue
            desc = _strip_html(item.findtext("description") or "", 320)
            src_el = item.find("source")
            source = sanitize_text(src_el.text if src_el is not None else "Google News", 80)
            hay = f"{title} {desc}"
            if is_betting(hay):
                continue
            signals.append({
                "id": make_id("gnews", source, title),
                "sourceType": "googlenews",
                "sourceName": f"Google News - {source}" if source else "Google News",
                "sourceUrl": "https://news.google.com/",
                "title": title,
                "summary": desc or title,
                "url": item.findtext("link") or "https://news.google.com/",
                "publishedAt": sanitize_text(item.findtext("pubDate"), 80) or detected_at,
                "detectedAt": detected_at,
                "category": "Cobertura mediatica",
                "players": [],
                "teams": [],
                "tags": ["Google News", source],
                "score": 0,
                "sentiment": infer_sentiment(hay),
                "classifications": [],
            })
            if len(signals) >= 24:
                break
    except Exception as exc:
        error_note = sanitize_text(exc, 200)
    note = f"Google News RSS (search, {hl}/{gl}) sin API key. Cobertura de medios indexados por Google; arranque inmediato."
    if error_note and not signals:
        note = f"{note} Ultimo error: {error_note}"
    return signals[:24], {
        "id": "google-news-rss",
        "name": "Google News (RSS)",
        "type": "googlenews",
        "url": "https://news.google.com/",
        "ok": len(signals) > 0,
        "itemCount": len(signals),
        "note": note,
    }


def _collect_reddit_rss(terms, subs, user_agent, detected_at):
    """Feed RSS publico de Reddit (.rss top/day), funciona sin credenciales (mientras llega el API)."""
    signals: list[dict] = []
    error_note = ""
    combined = "+".join(subs[:8]) or "soccer"
    url = f"https://www.reddit.com/r/{combined}/top/.rss?sort=top&t=day&limit=25"
    ns = {"a": "http://www.w3.org/2005/Atom"}
    try:
        root = ET.fromstring(_fetch_text(url, headers={"User-Agent": user_agent}))
        for entry in root.findall("a:entry", ns):
            title = sanitize_text(entry.findtext("a:title", default="", namespaces=ns), 200)
            content = _strip_html(entry.findtext("a:content", default="", namespaces=ns), 320)
            hay = f"{title} {content}"
            if not title or not is_relevant(hay, terms) or is_betting(hay):
                continue
            link_el = entry.find("a:link", ns)
            link = link_el.get("href") if link_el is not None else "https://www.reddit.com"
            author = sanitize_text(entry.findtext("a:author/a:name", default="", namespaces=ns), 60)
            signals.append({
                "id": make_id("reddit", author or "rss", title),
                "sourceType": "reddit",
                "sourceName": "Reddit via RSS",
                "sourceUrl": f"https://www.reddit.com/r/{combined}/",
                "title": title,
                "summary": content or title,
                "url": link,
                "publishedAt": sanitize_text(entry.findtext("a:updated", default="", namespaces=ns), 80) or detected_at,
                "detectedAt": detected_at,
                "category": "Conversacion social",
                "players": [],
                "teams": [],
                "tags": ["Reddit", "RSS", author],
                "score": 0,
                "sentiment": infer_sentiment(hay),
                "classifications": [],
            })
            if len(signals) >= 24:
                break
    except Exception as exc:
        error_note = sanitize_text(exc, 200)
    note = f"Reddit via RSS publico (.rss top/day, sin auth) en r/{combined}. Para busqueda por partido define REDDIT_CLIENT_ID/REDDIT_CLIENT_SECRET (OAuth)."
    if error_note and not signals:
        note = f"{note} Ultimo error: {error_note}"
    return signals[:24], {
        "id": "reddit-rss",
        "name": "Reddit via RSS",
        "type": "reddit",
        "url": f"https://www.reddit.com/r/{combined}/.rss",
        "ok": len(signals) > 0,
        "itemCount": len(signals),
        "note": note,
    }


def collect_bluesky(terms: list[str]) -> tuple[list[dict], dict]:
    """Voz social via la API publica de Bluesky (sin login ni API key)."""
    detected_at = now_iso()
    # El AppView `public.api.bsky.app` responde 403; `api.bsky.app` sirve `searchPosts`
    # publicamente con un User-Agent de navegador (verificado jun-2026).
    base = "https://api.bsky.app/xrpc/app.bsky.feed.searchPosts"
    browser_ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    signals: list[dict] = []
    error_note = ""

    queries = [sanitize_text(t, 80) for t in terms[:6] if sanitize_text(t, 80)]
    if not queries:
        queries = [sanitize_text(t, 80) for t in DEFAULT_TERMS[:4]]

    for query in queries:
        try:
            url = base + "?" + urllib.parse.urlencode({"q": query, "limit": 25, "sort": "latest"})
            data = _fetch_json(url, headers={"User-Agent": browser_ua, "Accept": "application/json"})
        except Exception as exc:
            error_note = sanitize_text(exc, 200)
            continue

        for post in (data.get("posts") or []):
            record = post.get("record") or {}
            text = sanitize_text(record.get("text") or "", 320)
            if not text or not is_relevant(text, terms) or is_betting(text):
                continue
            author = post.get("author") or {}
            handle = author.get("handle") or "bsky"
            uri = post.get("uri") or ""
            rkey = uri.rsplit("/", 1)[-1] if uri else ""
            post_url = f"https://bsky.app/profile/{handle}/post/{rkey}" if rkey else f"https://bsky.app/profile/{handle}"
            likes = int(post.get("likeCount") or 0)
            reposts = int(post.get("repostCount") or 0)
            replies = int(post.get("replyCount") or 0)
            signals.append({
                "id": make_id("bluesky", handle, rkey or len(signals)),
                "sourceType": "bluesky",
                "sourceName": "Bluesky via API publica",
                "sourceUrl": "https://bsky.app/search",
                "title": sanitize_text(text.split(".")[0], 180) or f"Bluesky: {handle}",
                "summary": text,
                "url": post_url,
                "publishedAt": sanitize_text(record.get("createdAt"), 80) or sanitize_text(post.get("indexedAt"), 80) or detected_at,
                "detectedAt": detected_at,
                "category": "Conversacion social",
                "players": [],
                "teams": [],
                "tags": ["Bluesky", handle, f"query:{query}"],
                "score": likes + reposts * 2 + replies,
                "sentiment": infer_sentiment(text),
                "classifications": [],
            })
            if len(signals) >= 24:
                break
        if len(signals) >= 24:
            break

    note = "Busqueda en la API publica de Bluesky (app.bsky.feed.searchPosts), sin login ni API key. Fuente social abierta y estable."
    if error_note and not signals:
        note = f"{note} Ultimo error: {error_note}"

    return signals[:24], {
        "id": "bluesky-public-api",
        "name": "Bluesky via API publica",
        "type": "bluesky",
        "url": "https://docs.bsky.app/docs/api/app-bsky-feed-search-posts",
        "ok": len(signals) > 0,
        "itemCount": len(signals),
        "note": note,
    }


def collect_reddit(terms: list[str]) -> tuple[list[dict], dict]:
    """Voz social via el JSON publico de Reddit (search.json), con User-Agent propio."""
    detected_at = now_iso()
    signals: list[dict] = []
    error_note = ""

    user_agent = os.environ.get("REDDIT_USER_AGENT", "").strip() or "ExperienceRadarSocial/1.0 (by medialab)"
    headers = {"User-Agent": user_agent, "Accept": "application/json"}
    query_terms = [sanitize_text(t, 60).replace('"', "") for t in terms[:6] if sanitize_text(t, 60)]
    query = " OR ".join(f'"{t}"' if " " in t else t for t in query_terms) or "world cup 2026"
    subs = env_list("RADAR_REDDIT_SUBREDDITS", DEFAULT_REDDIT_SUBREDDITS)[:8]

    # El JSON publico de Reddit suele dar 403 desde IPs de datacenter/cloud. Si hay
    # credenciales de app (gratis), se usa OAuth app-only via oauth.reddit.com (robusto).
    token = ""
    client_id = os.environ.get("REDDIT_CLIENT_ID", "").strip()
    client_secret = os.environ.get("REDDIT_CLIENT_SECRET", "").strip()
    if client_id and client_secret:
        try:
            token = _reddit_app_token(client_id, client_secret, user_agent)
        except Exception as exc:
            error_note = f"OAuth fallo: {sanitize_text(exc, 160)}"

    # Sin token OAuth: usa el feed RSS publico (.rss), que funciona sin credenciales.
    if not token:
        return _collect_reddit_rss(terms, subs, user_agent, detected_at)

    for sub in subs:
        params = urllib.parse.urlencode({
            "q": query,
            "restrict_sr": 1,
            "sort": "new",
            "limit": 15,
            "t": "week",
        })
        if token:
            url = f"https://oauth.reddit.com/r/{urllib.parse.quote(sub)}/search?{params}"
            req_headers = {"User-Agent": user_agent, "Authorization": f"Bearer {token}", "Accept": "application/json"}
        else:
            url = f"https://www.reddit.com/r/{urllib.parse.quote(sub)}/search.json?{params}"
            req_headers = headers
        try:
            data = _fetch_json(url, headers=req_headers)
        except Exception as exc:
            error_note = sanitize_text(exc, 200)
            continue

        children = ((data.get("data") or {}).get("children")) or []
        for child in children:
            post = child.get("data") or {}
            title = sanitize_text(post.get("title") or "", 200)
            body = sanitize_text(post.get("selftext") or "", 320)
            haystack = f"{title} {body}"
            if not title or not is_relevant(haystack, terms) or is_betting(haystack):
                continue
            permalink = post.get("permalink") or ""
            post_url = f"https://www.reddit.com{permalink}" if permalink else (post.get("url") or "https://www.reddit.com")
            created = post.get("created_utc")
            try:
                published = datetime.fromtimestamp(float(created), timezone.utc).isoformat() if created else detected_at
            except Exception:
                published = detected_at
            score = int(post.get("score") or 0)
            comments = int(post.get("num_comments") or 0)
            signals.append({
                "id": make_id("reddit", sub, post.get("id") or len(signals)),
                "sourceType": "reddit",
                "sourceName": "Reddit via JSON publico",
                "sourceUrl": f"https://www.reddit.com/r/{sub}/",
                "title": title,
                "summary": body or title,
                "url": str(post_url),
                "publishedAt": published,
                "detectedAt": detected_at,
                "category": "Conversacion social",
                "players": [],
                "teams": [],
                "tags": ["Reddit", f"r/{sub}", f"comments:{comments}"],
                "score": score + comments * 2,
                "sentiment": infer_sentiment(haystack),
                "classifications": [],
            })
            if len(signals) >= 24:
                break
        if len(signals) >= 24:
            break

    via = "OAuth app-only (oauth.reddit.com)" if token else "JSON publico (search.json)"
    note = f"Busqueda en Reddit via {via}. Si el JSON publico da 403 (IP de datacenter), define REDDIT_CLIENT_ID y REDDIT_CLIENT_SECRET (app gratuita en reddit.com/prefs/apps) para usar OAuth. Define RADAR_REDDIT_SUBREDDITS para enfocar subs por seleccion."
    if error_note and not signals:
        note = f"{note} Ultimo error: {error_note}"

    return signals[:24], {
        "id": "reddit-public-json",
        "name": "Reddit via JSON publico",
        "type": "reddit",
        "url": "https://www.reddit.com/dev/api",
        "ok": len(signals) > 0,
        "itemCount": len(signals),
        "note": note,
    }


def main() -> int:
    # Windows usa cp1252 por defecto y rompe al imprimir emojis/acentos de posts reales.
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

    parser = argparse.ArgumentParser()
    parser.add_argument("--platform", required=True, choices=["instagram", "facebook", "youtube", "x", "bluesky", "reddit", "google_news"])
    parser.add_argument("--terms", default="[]")
    args = parser.parse_args()

    raw_terms = args.terms.strip()
    try:
        terms = json.loads(raw_terms)
        if not isinstance(terms, list):
            terms = []
    except Exception:
        cleaned = raw_terms.strip().strip("[]")
        terms = [term.strip().strip("'\"") for term in cleaned.split(",") if term.strip()]

    merged_terms = [str(term).strip() for term in terms if str(term).strip()]
    for term in DEFAULT_TERMS:
        if term not in merged_terms:
            merged_terms.append(term)

    if args.platform == "instagram":
        signals, source = collect_instagram(merged_terms)
    elif args.platform == "facebook":
        signals, source = collect_facebook(merged_terms)
    elif args.platform == "x":
        signals, source = collect_x(merged_terms)
    elif args.platform == "bluesky":
        signals, source = collect_bluesky(merged_terms)
    elif args.platform == "reddit":
        signals, source = collect_reddit(merged_terms)
    elif args.platform == "google_news":
        signals, source = collect_googlenews(merged_terms)
    else:
        signals, source = collect_youtube(merged_terms)

    sys.stdout.write(json.dumps({"signals": signals, "source": source}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
