"""
Leads routes for HDFC Life Insurance backend.
Blueprint: leads | Prefix: /api/leads
"""

from datetime import datetime, timezone
from functools import wraps

from bson import ObjectId
from bson.errors import InvalidId
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, jwt_required

from app import mongo
from app.models.lead import VALID_STATUSES, create_lead

leads_bp = Blueprint("leads", __name__)


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


# ── POST /api/leads ───────────────────────────────────────────────────────────
@leads_bp.route("/", methods=["POST"])
def create_lead_route():
    """Submit a new lead (public endpoint – no auth required)."""
    try:
        data = request.get_json(silent=True) or {}

        name = (data.get("name") or "").strip()
        email = (data.get("email") or "").strip().lower()
        phone = (data.get("phone") or "").strip()

        if not name:
            return jsonify({"error": "name is required"}), 400
        if not email:
            return jsonify({"error": "email is required"}), 400
        if not phone:
            return jsonify({"error": "phone is required"}), 400

        lead_doc = create_lead(
            name=name,
            email=email,
            phone=phone,
            city=data.get("city", ""),
            product_interest=data.get("product_interest", ""),
            annual_income=data.get("annual_income", 0),
            message=data.get("message", ""),
        )

        result = mongo.db.leads.insert_one(lead_doc)
        lead_doc["_id"] = result.inserted_id

        return jsonify({
            "message": "Thank you! Our advisor will contact you shortly.",
            "lead": _serialize(lead_doc),
        }), 201

    except Exception as exc:
        return jsonify({"error": "Could not submit lead", "details": str(exc)}), 500


# ── GET /api/leads ────────────────────────────────────────────────────────────
@leads_bp.route("/", methods=["GET"])
@admin_required
def list_leads():
    """Return all leads with optional status filter (admin only)."""
    try:
        status = request.args.get("status", "").strip()
        query: dict = {}
        if status and status in VALID_STATUSES:
            query["status"] = status

        leads = list(mongo.db.leads.find(query).sort("created_at", -1))
        return jsonify({"leads": [_serialize(l) for l in leads], "total": len(leads)}), 200

    except Exception as exc:
        return jsonify({"error": "Could not fetch leads", "details": str(exc)}), 500


# ── PUT /api/leads/<lead_id> ──────────────────────────────────────────────────
@leads_bp.route("/<lead_id>", methods=["PUT"])
@admin_required
def update_lead(lead_id: str):
    """Update lead status or notes (admin only)."""
    try:
        oid = ObjectId(lead_id)
    except InvalidId:
        return jsonify({"error": "Invalid lead ID format"}), 400

    try:
        data = request.get_json(silent=True) or {}
        updatable = ["status", "notes"]
        updates = {k: data[k] for k in updatable if k in data}

        if "status" in updates and updates["status"] not in VALID_STATUSES:
            return jsonify({"error": f"status must be one of {VALID_STATUSES}"}), 400

        if not updates:
            return jsonify({"error": "No valid fields provided for update"}), 400

        updates["updated_at"] = datetime.now(timezone.utc)

        result = mongo.db.leads.update_one({"_id": oid}, {"$set": updates})
        if result.matched_count == 0:
            return jsonify({"error": "Lead not found"}), 404

        lead = mongo.db.leads.find_one({"_id": oid})
        return jsonify({"message": "Lead updated", "lead": _serialize(lead)}), 200

    except Exception as exc:
        return jsonify({"error": "Could not update lead", "details": str(exc)}), 500
