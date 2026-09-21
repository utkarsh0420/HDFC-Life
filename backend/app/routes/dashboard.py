"""
Dashboard routes for HDFC Life Insurance backend.
Blueprint: dashboard | Prefix: /api/dashboard
Blueprint: dashboard | Prefix: /api/dashboard
"""

from datetime import datetime, timezone

from bson import ObjectId
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app import mongo

dashboard_bp = Blueprint("dashboard", __name__)


def _serialize(doc: dict) -> dict:
    """Convert _id ObjectId to string."""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


# ── GET /api/dashboard ────────────────────────────────────────────────────────
@dashboard_bp.route("/", methods=["GET"])
@jwt_required()
def dashboard_summary():
    """Return profile summary and policy overview for the current user."""
    try:
        identity = get_jwt_identity()
        user = mongo.db.users.find_one({"_id": ObjectId(identity)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        policies = user.get("policies", [])
        active_count = sum(1 for p in policies if p.get("status") == "active")
        total_coverage = sum(
            p.get("sum_assured", 0) for p in policies if p.get("status") == "active"
        )

        return jsonify({
            "profile": {
                "id": str(user["_id"]),
                "username": user.get("username", ""),
                "email": user.get("email", ""),
                "phone": user.get("phone", ""),
                "city": user.get("city", ""),
            },
            "summary": {
                "total_policies": len(policies),
                "active_policies": active_count,
                "total_coverage": total_coverage,
            },
        }), 200

    except Exception as exc:
        return jsonify({"error": "Could not fetch dashboard", "details": str(exc)}), 500


# ── GET /api/dashboard/policies ───────────────────────────────────────────────
@dashboard_bp.route("/policies", methods=["GET"])
@jwt_required()
def get_policies():
    """Return the detailed policy list for the current user."""
    try:
        identity = get_jwt_identity()
        user = mongo.db.users.find_one(
            {"_id": ObjectId(identity)},
            {"policies": 1}
        )
        if not user:
            return jsonify({"error": "User not found"}), 404

        policies = user.get("policies", [])

        # Serialize any nested datetime values for JSON
        serialized_policies = []
        for policy in policies:
            p = dict(policy)
            for key in ("start_date", "end_date"):
                if isinstance(p.get(key), datetime):
                    p[key] = p[key].isoformat()
            serialized_policies.append(p)

        return jsonify({
            "policies": serialized_policies,
            "total": len(serialized_policies),
        }), 200

    except Exception as exc:
        return jsonify({"error": "Could not fetch policies", "details": str(exc)}), 500


# ── POST /api/dashboard/claim ─────────────────────────────────────────────────
@dashboard_bp.route("/claim", methods=["POST"])
@jwt_required()
def submit_claim():
    """Submit a new insurance claim request for the current user."""
    try:
        identity = get_jwt_identity()
        data = request.get_json(silent=True) or {}

        policy_id = (data.get("policy_id") or "").strip()
        claim_type = (data.get("claim_type") or "").strip()
        description = (data.get("description") or "").strip()

        if not policy_id:
            return jsonify({"error": "policy_id is required"}), 400
        if not claim_type:
            return jsonify({"error": "claim_type is required"}), 400

        # Verify the policy belongs to the user
        user = mongo.db.users.find_one(
            {"_id": ObjectId(identity), "policies.policy_id": policy_id},
            {"_id": 1}
        )
        if not user:
            return jsonify({"error": "Policy not found for this user"}), 404

        claim_doc = {
            "user_id": identity,
            "policy_id": policy_id,
            "claim_type": claim_type,
            "description": description,
            "amount_claimed": float(data.get("amount_claimed", 0)),
            "status": "pending",
            "documents": data.get("documents", []),
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }

        result = mongo.db.claims.insert_one(claim_doc)
        claim_doc["_id"] = result.inserted_id

        return jsonify({
            "message": "Claim submitted successfully. Our team will review it within 3-5 business days.",
            "claim": _serialize(claim_doc),
        }), 201

    except Exception as exc:
        return jsonify({"error": "Could not submit claim", "details": str(exc)}), 500
