"""
Authentication routes for HDFC Life Insurance backend.
Blueprint: auth | Prefix: /api/auth
"""

from datetime import datetime, timezone

from bson import ObjectId
from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
)

from app import mongo
import bcrypt

def hash_password(password: str) -> bytes:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

def check_password(password: str, hashed: bytes) -> bool:
    if isinstance(hashed, str):
        hashed = hashed.encode("utf-8")
    return bcrypt.checkpw(password.encode("utf-8"), hashed)
auth_bp = Blueprint("auth", __name__)


def _serialize_user(user: dict) -> dict:
    """Convert a MongoDB user document to a JSON-safe dict (no password)."""
    return {
        "id": str(user["_id"]),
        "username": user.get("username", ""),
        "email": user.get("email", ""),
        "role": user.get("role", "customer"),
        "phone": user.get("phone", ""),
        "city": user.get("city", ""),
        "created_at": user.get("created_at", "").isoformat()
        if isinstance(user.get("created_at"), datetime)
        else str(user.get("created_at", "")),
    }


# ── POST /api/auth/register ───────────────────────────────────────────────────
@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new customer account and return a JWT."""
    try:
        data = request.get_json(silent=True) or {}

        username = (data.get("username") or "").strip()
        email = (data.get("email") or "").strip().lower()
        password = data.get("password") or ""
        phone = (data.get("phone") or "").strip()
        city = (data.get("city") or "").strip()

        # Validate required fields
        if not username:
            return jsonify({"error": "username is required"}), 400
        if not email:
            return jsonify({"error": "email is required"}), 400
        if not password or len(password) < 6:
            return jsonify({"error": "password must be at least 6 characters"}), 400

        # Check duplicate email
        if mongo.db.users.find_one({"email": email}):
            return jsonify({"error": "An account with this email already exists"}), 409

        # Create & insert user
        user_doc = {
            "username": username,
            "email": email.lower().strip(),
            "password_hash": hash_password(password),
            "role": "customer",
            "phone": phone,
            "city": city,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
            "policies": [],
        }
        result = mongo.db.users.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id

        # Issue tokens – identity is the string user ID
        identity = str(result.inserted_id)
        access_token = create_access_token(
            identity=identity,
            additional_claims={"role": "customer", "email": email}
        )
        refresh_token = create_refresh_token(identity=identity)

        return jsonify({
            "message": "Registration successful",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": _serialize_user(user_doc),
        }), 201

    except Exception as exc:
        return jsonify({"error": "Registration failed", "details": str(exc)}), 500


# ── POST /api/auth/login ──────────────────────────────────────────────────────
@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate a user and return access + refresh tokens."""
    try:
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip().lower()
        password = data.get("password") or ""

        if not email or not password:
            return jsonify({"error": "email and password are required"}), 400

        user = mongo.db.users.find_one({"email": email})
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        if not check_password(password, user["password_hash"]):
            return jsonify({"error": "Invalid email or password"}), 401

        identity = str(user["_id"])
        access_token = create_access_token(
            identity=identity,
            additional_claims={"role": user.get("role", "customer"), "email": email}
        )
        refresh_token = create_refresh_token(identity=identity)

        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": _serialize_user(user),
        }), 200

    except Exception as exc:
        return jsonify({"error": "Login failed", "details": str(exc)}), 500


# ── POST /api/auth/refresh ────────────────────────────────────────────────────
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """Issue a new access token using a valid refresh token."""
    try:
        identity = get_jwt_identity()
        user = mongo.db.users.find_one({"_id": ObjectId(identity)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        access_token = create_access_token(
            identity=identity,
            additional_claims={
                "role": user.get("role", "customer"),
                "email": user.get("email", ""),
            }
        )
        return jsonify({"access_token": access_token}), 200

    except Exception as exc:
        return jsonify({"error": "Token refresh failed", "details": str(exc)}), 500


# ── GET /api/auth/me ──────────────────────────────────────────────────────────
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    """Return the current authenticated user's profile (no password)."""
    try:
        identity = get_jwt_identity()
        user = mongo.db.users.find_one({"_id": ObjectId(identity)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"user": _serialize_user(user)}), 200

    except Exception as exc:
        return jsonify({"error": "Could not retrieve profile", "details": str(exc)}), 500


# ── PUT /api/auth/me ──────────────────────────────────────────────────────────
@auth_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_me():
    """Update the current user's username, city, or phone."""
    try:
        identity = get_jwt_identity()
        data = request.get_json(silent=True) or {}

        allowed_fields = ["username", "city", "phone"]
        updates = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

        if not updates:
            return jsonify({"error": "No valid fields provided for update"}), 400

        updates["updated_at"] = datetime.now(timezone.utc)

        mongo.db.users.update_one(
            {"_id": ObjectId(identity)},
            {"$set": updates}
        )

        user = mongo.db.users.find_one({"_id": ObjectId(identity)})
        return jsonify({"message": "Profile updated", "user": _serialize_user(user)}), 200

    except Exception as exc:
        return jsonify({"error": "Profile update failed", "details": str(exc)}), 500


