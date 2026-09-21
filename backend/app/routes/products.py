"""
Products routes for HDFC Life Insurance backend.
Blueprint: products | Prefix: /api/products
"""

from datetime import datetime, timezone
from functools import wraps

from bson import ObjectId
from bson.errors import InvalidId
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, jwt_required

from app import mongo
from app.routes.utils import admin_required

CATEGORIES = ["Life Insurance", "Health Insurance", "Investment Plans", "Retirement Plans"]

products_bp = Blueprint("products", __name__)


# ── Helpers ───────────────────────────────────────────────────────────────────

def objectid_to_str(doc: dict) -> dict:
    """Convert the _id field of a MongoDB document to a plain string."""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc




# ── GET /api/products ─────────────────────────────────────────────────────────
@products_bp.route("/", methods=["GET"])
def list_products():
    """Return all active products with optional category and search filtering."""
    try:
        category = request.args.get("category", "").strip()
        search = request.args.get("search", "").strip()

        query: dict = {"is_active": True}

        if category and category in CATEGORIES:
            query["category"] = category

        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
            ]

        products = list(mongo.db.products.find(query))
        return jsonify({"products": [objectid_to_str(p) for p in products]}), 200

    except Exception as exc:
        return jsonify({"error": "Could not fetch products", "details": str(exc)}), 500


# ── GET /api/products/<product_id> ────────────────────────────────────────────
@products_bp.route("/<product_id>", methods=["GET"])
def get_product(product_id: str):
    """Return a single product by its MongoDB ObjectId."""
    try:
        oid = ObjectId(product_id)
    except InvalidId:
        return jsonify({"error": "Invalid product ID format"}), 400

    try:
        product = mongo.db.products.find_one({"_id": oid})
        if not product:
            return jsonify({"error": "Product not found"}), 404
        return jsonify({"product": objectid_to_str(product)}), 200

    except Exception as exc:
        return jsonify({"error": "Could not fetch product", "details": str(exc)}), 500


# ── POST /api/products ────────────────────────────────────────────────────────
@products_bp.route("/", methods=["POST"])
@admin_required
def create_product_route():
    """Create a new insurance product (admin only)."""
    try:
        data = request.get_json(silent=True) or {}

        required = ["name", "category", "description", "min_age", "max_age",
                    "min_term", "max_term", "base_premium_rate"]
        missing = [f for f in required if data.get(f) is None]
        if missing:
            return jsonify({"error": f"Missing required fields: {missing}"}), 400

        if data["category"] not in CATEGORIES:
            return jsonify({"error": f"category must be one of {CATEGORIES}"}), 400

                product_doc = {
            "name": data["name"],
            "category": category,
            "description": data["description"],
            "min_age": int(data["min_age"]),
            "max_age": int(data["max_age"]),
            "min_term": int(data["min_term"]),
            "max_term": int(data["max_term"]),
            "base_premium_rate": float(data["base_premium_rate"]),
            "features": data.get("features", []),
            "benefits": data.get("benefits", []),
            "eligibility": data.get("eligibility", []),
            "documents_required": data.get("documents_required", []),
            "is_active": True,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        },
            max_age=int(data["max_age"]),
            min_term=int(data["min_term"]),
            max_term=int(data["max_term"]),
            base_premium_rate=float(data["base_premium_rate"]),
            features=data.get("features", []),
            benefits=data.get("benefits", []),
            eligibility=data.get("eligibility", []),
            documents_required=data.get("documents_required", []),
        )

        result = mongo.db.products.insert_one(product_doc)
        product_doc["_id"] = result.inserted_id

        return jsonify({
            "message": "Product created successfully",
            "product": objectid_to_str(product_doc),
        }), 201

    except Exception as exc:
        return jsonify({"error": "Could not create product", "details": str(exc)}), 500


# ── PUT /api/products/<product_id> ────────────────────────────────────────────
@products_bp.route("/<product_id>", methods=["PUT"])
@admin_required
def update_product(product_id: str):
    """Update an existing product (admin only)."""
    try:
        oid = ObjectId(product_id)
    except InvalidId:
        return jsonify({"error": "Invalid product ID format"}), 400

    try:
        data = request.get_json(silent=True) or {}

        # Only allow updating known fields
        updatable = [
            "name", "category", "description", "min_age", "max_age",
            "min_term", "max_term", "base_premium_rate", "features",
            "benefits", "eligibility", "documents_required", "is_active",
        ]
        updates = {k: data[k] for k in updatable if k in data}

        if "category" in updates and updates["category"] not in CATEGORIES:
            return jsonify({"error": f"category must be one of {CATEGORIES}"}), 400

        if not updates:
            return jsonify({"error": "No valid fields provided for update"}), 400

        updates["updated_at"] = datetime.now(timezone.utc)

        result = mongo.db.products.update_one({"_id": oid}, {"$set": updates})
        if result.matched_count == 0:
            return jsonify({"error": "Product not found"}), 404

        product = mongo.db.products.find_one({"_id": oid})
        return jsonify({
            "message": "Product updated successfully",
            "product": objectid_to_str(product),
        }), 200

    except Exception as exc:
        return jsonify({"error": "Could not update product", "details": str(exc)}), 500


# ── DELETE /api/products/<product_id> ────────────────────────────────────────
@products_bp.route("/<product_id>", methods=["DELETE"])
@admin_required
def delete_product(product_id: str):
    """Soft-delete a product by marking it inactive (admin only)."""
    try:
        oid = ObjectId(product_id)
    except InvalidId:
        return jsonify({"error": "Invalid product ID format"}), 400

    try:
        result = mongo.db.products.update_one(
            {"_id": oid},
            {"$set": {"is_active": False, "updated_at": datetime.now(timezone.utc)}}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Product not found"}), 404

        return jsonify({"message": "Product deleted (deactivated) successfully"}), 200

    except Exception as exc:
        return jsonify({"error": "Could not delete product", "details": str(exc)}), 500
