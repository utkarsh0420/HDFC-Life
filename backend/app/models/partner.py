"""
Partner application model helpers for HDFC Life Insurance backend.
"""

from datetime import datetime, timezone
from typing import Any, Dict

VALID_PARTNER_STATUSES = ["pending", "under_review", "approved", "rejected"]

PARTNER_TYPES = [
    "individual_agent",
    "corporate_agent",
    "broker",
    "bancassurance",
    "digital_partner",
]


def create_partner_application(
    full_name: str,
    email: str,
    phone: str,
    city: str = "",
    state: str = "",
    partner_type: str = "individual_agent",
    experience_years: int = 0,
    current_occupation: str = "",
    annual_income_range: str = "",
    message: str = "",
    status: str = "pending",
) -> Dict[str, Any]:
    """Build a new partner application document ready for insertion into MongoDB.

    Args:
        full_name:           Full legal name of the applicant.
        email:               Email address.
        phone:               Contact phone number.
        city:                City / location.
        state:               State.
        partner_type:        Type of partnership being applied for.
        experience_years:    Years of experience in insurance / finance.
        current_occupation:  Current job / business of the applicant.
        annual_income_range: Approximate annual income bracket.
        message:             Optional motivation / covering note.
        status:              Application lifecycle status (default: 'pending').

    Returns:
        A dict representing the partner application document (without _id).
    """
    if status not in VALID_PARTNER_STATUSES:
        status = "pending"

    return {
        "full_name": full_name.strip(),
        "email": email.lower().strip(),
        "phone": phone.strip(),
        "city": city.strip(),
        "state": state.strip(),
        "partner_type": partner_type,
        "experience_years": int(experience_years),
        "current_occupation": current_occupation.strip(),
        "annual_income_range": annual_income_range.strip(),
        "message": message.strip(),
        "status": status,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
