from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt, jwt_required

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
