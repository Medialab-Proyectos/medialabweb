import argparse
import json
import os
import re
import sys
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


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--platform", required=True, choices=["instagram", "facebook", "youtube", "x"])
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
    else:
        signals, source = collect_youtube(merged_terms)

    sys.stdout.write(json.dumps({"signals": signals, "source": source}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
