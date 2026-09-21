"""
Premium calculator route for HDFC Life Insurance backend.
Blueprint: calculator | Prefix: /api/calculator
"""

from flask import Blueprint, jsonify, request

calculator_bp = Blueprint("calculator", __name__)

# Base premium rates by plan type
BASE_RATES: dict[str, float] = {
    "Life": 0.004,
    "Health": 0.006,
    "Investment": 0.003,
    "Retirement": 0.0035,
}

# Accept full category names (from product catalogue) as well as short names
PLAN_ALIASES: dict[str, str] = {
    "life insurance": "Life",
    "health insurance": "Health",
    "investment plans": "Investment",
    "retirement plans": "Retirement",
    "life": "Life",
    "health": "Health",
    "investment": "Investment",
    "retirement": "Retirement",
}

GST_RATE = 0.18  # 18 % GST on insurance premiums


# ── POST /api/calculator ──────────────────────────────────────────────────────
@calculator_bp.route("/", methods=["POST"])
def calculate_premium():
    """Calculate insurance premium given policy parameters.

    Request JSON:
        age          (int)   – Applicant age in years (18–70)
        sum_assured  (float) – Desired sum assured in INR
        term         (int)   – Policy term in years (5–40)
        plan_type    (str)   – One of: Life, Health, Investment, Retirement
        smoker       (bool)  – Whether the applicant is a smoker

    Response JSON:
        annual_premium    – Base annual premium before GST
        monthly_premium   – annual_premium / 12
        quarterly_premium – annual_premium / 4
        gst_amount        – 18 % GST on annual_premium
        total_annual      – annual_premium + gst_amount
    """
    try:
        data = request.get_json(silent=True) or {}

        # ── Parse inputs ──────────────────────────────────────────────────────
        try:
            age = int(data.get("age", 0))
            sum_assured = float(data.get("sum_assured", 0))
            term = int(data.get("term", 0))
            plan_type = str(data.get("plan_type", "Life")).strip()
            plan_type = PLAN_ALIASES.get(plan_type.lower(), plan_type)  # normalize
            smoker = bool(data.get("smoker", False))
        except (TypeError, ValueError):
            return jsonify({"error": "Invalid input types. age/term must be int, sum_assured float"}), 400

        # ── Validation ────────────────────────────────────────────────────────
        errors = []
        if not (18 <= age <= 70):
            errors.append("age must be between 18 and 70")
        if sum_assured <= 0:
            errors.append("sum_assured must be a positive number")
        if not (5 <= term <= 40):
            errors.append("term must be between 5 and 40 years")
        if plan_type not in BASE_RATES:
            errors.append(f"plan_type must be one of: {', '.join(BASE_RATES.keys())}")
        if errors:
            return jsonify({"error": "Validation failed", "details": errors}), 400

        # ── Premium calculation formula ───────────────────────────────────────
        base_rate: float = BASE_RATES[plan_type]

        # Age factor: increases linearly with age beyond 18
        age_factor: float = 1.0 + (age - 18) * 0.015

        # Smoker surcharge: 25 % extra if smoker
        smoker_factor: float = 1.25 if smoker else 1.0

        # Term discount: 0.5 % per year beyond 5 years (capped implicitly by term range)
        term_discount: float = max(0.0, (term - 5) * 0.005)

        annual_premium: float = (
            sum_assured
            * base_rate
            * age_factor
            * smoker_factor
            * (1.0 - term_discount)
        )

        monthly_premium: float = annual_premium / 12
        quarterly_premium: float = annual_premium / 4
        gst_amount: float = annual_premium * GST_RATE
        total_annual: float = annual_premium + gst_amount

        return jsonify({
            "annual_premium": round(annual_premium, 2),
            "monthly_premium": round(monthly_premium, 2),
            "quarterly_premium": round(quarterly_premium, 2),
            "gst_amount": round(gst_amount, 2),
            "total_annual": round(total_annual, 2),
            "inputs": {
                "age": age,
                "sum_assured": sum_assured,
                "term": term,
                "plan_type": plan_type,
                "smoker": smoker,
            },
        }), 200

    except Exception as exc:
        return jsonify({"error": "Calculation failed", "details": str(exc)}), 500
