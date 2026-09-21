"""
Blog model helpers for HDFC Life Insurance backend.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List


def create_blog(
    title: str,
    slug: str,
    category: str,
    author: str,
    content: str,
    image_url: str = "",
    tags: List[str] | None = None,
    published: bool = True,
) -> Dict[str, Any]:
    """Build a new blog document ready for insertion into MongoDB.

    Args:
        title:     Blog post title.
        slug:      URL-friendly unique identifier (e.g. 'why-term-insurance').
        category:  Blog category string.
        author:    Author display name.
        content:   Full HTML / markdown body content.
        image_url: Cover image URL (optional).
        tags:      List of tag strings (optional).
        published: Whether the post is publicly visible (default True).

    Returns:
        A dict representing the blog document (without _id).
    """
    return {
        "title": title.strip(),
        "slug": slug.strip().lower(),
        "category": category.strip(),
        "author": author.strip(),
        "content": content,
        "image_url": image_url,
        "tags": tags or [],
        "published": published,
        "views": 0,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
