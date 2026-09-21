"""
Product model helpers for HDFC Life Insurance backend.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List

# Valid product categories
CATEGORIES = [
    "Life Insurance",
    "Health Insurance",
    "Investment Plans",
    "Retirement Plans",
]


def create_product(
    name: str,
    category: str,
    description: str,
    min_age: int,
    max_age: int,
    min_term: int,
    max_term: int,
    base_premium_rate: float,
    features: List[str],
    benefits: List[str],
    eligibility: List[str],
    documents_required: List[str],
) -> Dict[str, Any]:
    """Build a new product document ready for insertion into MongoDB.

    Args:
        name:               Product name.
        category:           One of CATEGORIES.
        description:        Short marketing description.
        min_age:            Minimum entry age (years).
        max_age:            Maximum entry age (years).
        min_term:           Minimum policy term (years).
        max_term:           Maximum policy term (years).
        base_premium_rate:  Base rate used in premium calculation.
        features:           List of feature strings.
        benefits:           List of benefit strings.
        eligibility:        List of eligibility criteria strings.
        documents_required: List of required document strings.

    Returns:
        A dict representing the product document (without _id).
    """
    if category not in CATEGORIES:
        raise ValueError(f"category must be one of {CATEGORIES}")

    return {
        "name": name,
        "category": category,
        "description": description,
        "min_age": min_age,
        "max_age": max_age,
        "min_term": min_term,
        "max_term": max_term,
        "base_premium_rate": base_premium_rate,
        "features": features,
        "benefits": benefits,
        "eligibility": eligibility,
        "documents_required": documents_required,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
