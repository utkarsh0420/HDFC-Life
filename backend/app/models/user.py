"""
User model helpers for HDFC Life Insurance backend.
Provides functions to create user documents and manage password hashing.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List

import bcrypt


def hash_password(password: str) -> bytes:
    """Hash a plain-text password using bcrypt.

    Args:
        password: Plain-text password string.

    Returns:
        Bcrypt-hashed bytes.
    """
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())


def check_password(password: str, hashed: bytes) -> bool:
    """Verify a plain-text password against a bcrypt hash.

    Args:
        password: Plain-text password string.
        hashed:   Stored bcrypt hash (bytes or str from MongoDB).

    Returns:
        True if the password matches, False otherwise.
    """
    if isinstance(hashed, str):
        hashed = hashed.encode("utf-8")
    return bcrypt.checkpw(password.encode("utf-8"), hashed)


def create_user(
    username: str,
    email: str,
    password: str,
    role: str = "customer",
    phone: str = "",
    city: str = "",
    policies: List[Dict[str, Any]] | None = None,
) -> Dict[str, Any]:
    """Build a new user document ready for insertion into MongoDB.

    Args:
        username: Display name of the user.
        email:    Unique email address.
        password: Plain-text password (will be hashed internally).
        role:     'customer' or 'admin'.
        phone:    Optional phone number.
        city:     Optional city.
        policies: Optional pre-seeded list of policy dicts.

    Returns:
        A dict representing the user document (without _id).
    """
    return {
        "username": username,
        "email": email.lower().strip(),
        "password_hash": hash_password(password),
        "role": role,
        "phone": phone,
        "city": city,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        # Each policy dict shape:
        # {
        #   "policy_id":   str,
        #   "plan_name":   str,
        #   "sum_assured": float,
        #   "premium":     float,
        #   "start_date":  datetime,
        #   "end_date":    datetime,
        #   "status":      "active" | "lapsed" | "matured",
        # }
        "policies": policies or [],
    }
