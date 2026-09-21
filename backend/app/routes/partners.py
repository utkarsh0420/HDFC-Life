"""
Partner application routes for HDFC Life Insurance backend.
Blueprint: partners | Prefix: /api/partners
"""

from datetime import datetime, timezone
from functools import wraps

from bson import ObjectId
from bson.errors import InvalidId
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, jwt_required

from app import mongo
from app.models.partner import (
    VALID_PARTNER_STATUSES,
    PARTNER_TYPES,
    create_partner_application,
)

partners_bp = Blueprint("partners", __name__)


# ── Helpers ───────────────────────────────────────────────────────────────────

def _serialize(doc: dict) -> dict:
    """Convert _id ObjectId to string."""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


def admin_required(fn):
    """Decorator: ensures the JWT identity belongs to an admin user."""
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get("role") != "admin":
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return wrapper


# ── POST /api/partners ────────────────────────────────────────────────────────
@partners_bp.route("/", methods=["POST"])
def submit_partner_application():
    """Submit a new partner application (public endpoint – no auth required)."""
    try:
        data = request.get_json(silent=True) or {}

        full_name = (data.get("full_name") or "").strip()
        email     = (data.get("email") or "").strip().lower()
        phone     = (data.get("phone") or "").strip()

        if not full_name:
            return jsonify({"error": "full_name is required"}), 400
        if not email:
            return jsonify({"error": "email is required"}), 400
        if not phone:
            return jsonify({"error": "phone is required"}), 400

        partner_type = data.get("partner_type", "individual_agent")
        if partner_type not in PARTNER_TYPES:
            return jsonify({"error": f"partner_type must be one of {PARTNER_TYPES}"}), 400

        # Duplicate check – same email should not re-apply if already pending/under_review
        existing = mongo.db.partner_applications.find_one(
            {"email": email, "status": {"$in": ["pending", "under_review"]}}
        )
        if existing:
            return jsonify({
                "error": "An application with this email is already under review."
            }), 409

        app_doc = create_partner_application(
            full_name=full_name,
            email=email,
            phone=phone,
            city=data.get("city", ""),
            state=data.get("state", ""),
            partner_type=partner_type,
            experience_years=data.get("experience_years", 0),
            current_occupation=data.get("current_occupation", ""),
            annual_income_range=data.get("annual_income_range", ""),
            message=data.get("message", ""),
        )

        result = mongo.db.partner_applications.insert_one(app_doc)
        app_doc["_id"] = result.inserted_id

        return jsonify({
            "message": "Thank you for your interest! Our partnership team will contact you within 2 business days.",
            "application": _serialize(app_doc),
        }), 201

    except Exception as exc:
        return jsonify({"error": "Could not submit application", "details": str(exc)}), 500


# ── GET /api/partners ─────────────────────────────────────────────────────────
@partners_bp.route("/", methods=["GET"])
@admin_required
def list_partner_applications():
    """Return all partner applications with optional status filter (admin only)."""
    try:
        status = request.args.get("status", "").strip()
        query: dict = {}
        if status and status in VALID_PARTNER_STATUSES:
            query["status"] = status

        apps = list(
            mongo.db.partner_applications.find(query).sort("created_at", -1)
        )
        return jsonify({"applications": [_serialize(a) for a in apps], "total": len(apps)}), 200

    except Exception as exc:
        return jsonify({"error": "Could not fetch applications", "details": str(exc)}), 500


# ── PUT /api/partners/<app_id> ────────────────────────────────────────────────
@partners_bp.route("/<app_id>", methods=["PUT"])
@admin_required
def update_partner_application(app_id: str):
    """Update application status or notes (admin only)."""
    try:
        oid = ObjectId(app_id)
    except InvalidId:
        return jsonify({"error": "Invalid application ID format"}), 400

    try:
        data = request.get_json(silent=True) or {}
        updatable = ["status", "notes"]
        updates = {k: data[k] for k in updatable if k in data}

        if "status" in updates and updates["status"] not in VALID_PARTNER_STATUSES:
            return jsonify({"error": f"status must be one of {VALID_PARTNER_STATUSES}"}), 400

        if not updates:
            return jsonify({"error": "No valid fields provided for update"}), 400

        updates["updated_at"] = datetime.now(timezone.utc)

        result = mongo.db.partner_applications.update_one({"_id": oid}, {"$set": updates})
        if result.matched_count == 0:
            return jsonify({"error": "Application not found"}), 404

        application = mongo.db.partner_applications.find_one({"_id": oid})
        return jsonify({"message": "Application updated", "application": _serialize(application)}), 200

    except Exception as exc:
        return jsonify({"error": "Could not update application", "details": str(exc)}), 500
