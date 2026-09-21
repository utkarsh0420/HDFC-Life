"""
Lead model helpers for HDFC Life Insurance backend.
"""

from datetime import datetime, timezone
from typing import Any, Dict

VALID_STATUSES = ["new", "contacted", "qualified", "converted", "lost"]


def create_lead(
    name: str,
    email: str,
    phone: str,
    city: str = "",
    product_interest: str = "",
    annual_income: float = 0.0,
    message: str = "",
    status: str = "new",
) -> Dict[str, Any]:
    """Build a new lead document ready for insertion into MongoDB.

    Args:
        name:             Full name of the prospect.
        email:            Email address.
        phone:            Contact phone number.
        city:             City / location.
        product_interest: Product the lead is enquiring about.
        annual_income:    Approximate annual income (INR).
        message:          Optional free-text message.
        status:           Lead lifecycle status (default: 'new').

    Returns:
        A dict representing the lead document (without _id).
    """
    if status not in VALID_STATUSES:
        status = "new"

    return {
        "name": name.strip(),
        "email": email.lower().strip(),
        "phone": phone.strip(),
        "city": city.strip(),
        "product_interest": product_interest,
        "annual_income": float(annual_income),
        "message": message.strip(),
        "status": status,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
