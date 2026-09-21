"""
Blog routes for HDFC Life Insurance backend.
Blueprint: blogs | Prefix: /api/blogs
"""

from datetime import datetime, timezone
from functools import wraps

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, jwt_required

from app import mongo
from app.routes.utils import _serialize, admin_required


blogs_bp = Blueprint("blogs", __name__)


# ── Helpers ───────────────────────────────────────────────────────────────────





# ── GET /api/blogs ────────────────────────────────────────────────────────────
@blogs_bp.route("/", methods=["GET"])
def list_blogs():
    """Return published blogs with optional category filter and pagination."""
    try:
        category = request.args.get("category", "").strip()
        try:
            page = max(1, int(request.args.get("page", 1)))
            limit = min(50, max(1, int(request.args.get("limit", 10))))
        except ValueError:
            page, limit = 1, 10

        query: dict = {"published": True}
        if category:
            query["category"] = {"$regex": category, "$options": "i"}

        skip = (page - 1) * limit
        total = mongo.db.blogs.count_documents(query)
        blogs = list(
            mongo.db.blogs.find(query, {"content": 0})  # exclude heavy content in list
            .sort("created_at", -1)
            .skip(skip)
            .limit(limit)
        )

        return jsonify({
            "blogs": [_serialize(b) for b in blogs],
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit,
        }), 200

    except Exception as exc:
        return jsonify({"error": "Could not fetch blogs", "details": str(exc)}), 500


# ── GET /api/blogs/<slug> ─────────────────────────────────────────────────────
@blogs_bp.route("/<slug>", methods=["GET"])
def get_blog(slug: str):
    """Return a single blog post by its slug (increments view counter)."""
    try:
        blog = mongo.db.blogs.find_one({"slug": slug.lower(), "published": True})
        if not blog:
            return jsonify({"error": "Blog post not found"}), 404

        # Increment view count silently
        mongo.db.blogs.update_one({"_id": blog["_id"]}, {"$inc": {"views": 1}})
        blog["views"] = blog.get("views", 0) + 1

        return jsonify({"blog": _serialize(blog)}), 200

    except Exception as exc:
        return jsonify({"error": "Could not fetch blog", "details": str(exc)}), 500


# ── POST /api/blogs ───────────────────────────────────────────────────────────
@blogs_bp.route("/", methods=["POST"])
@admin_required
def create_blog_route():
    """Create a new blog post (admin only)."""
    try:
        data = request.get_json(silent=True) or {}

        required = ["title", "slug", "category", "author", "content"]
        missing = [f for f in required if not data.get(f)]
        if missing:
            return jsonify({"error": f"Missing required fields: {missing}"}), 400

        slug = data["slug"].strip().lower()
        if mongo.db.blogs.find_one({"slug": slug}):
            return jsonify({"error": "A blog with this slug already exists"}), 409

        blog_doc = {
            "title": data["title"],
            "slug": slug,
            "category": data["category"],
            "author": data["author"],
            "content": data["content"],
            "image_url": data.get("image_url", ""),
            "tags": data.get("tags", []),
            "published": data.get("published", True),
            "views": 0,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }

        result = mongo.db.blogs.insert_one(blog_doc)
        blog_doc["_id"] = result.inserted_id

        return jsonify({
            "message": "Blog post created successfully",
            "blog": _serialize(blog_doc),
        }), 201

    except Exception as exc:
        return jsonify({"error": "Could not create blog", "details": str(exc)}), 500


# ── PUT /api/blogs/<slug> ─────────────────────────────────────────────────────
@blogs_bp.route("/<slug>", methods=["PUT"])
@admin_required
def update_blog(slug: str):
    """Update a blog post by slug (admin only)."""
    try:
        blog = mongo.db.blogs.find_one({"slug": slug.lower()})
        if not blog:
            return jsonify({"error": "Blog post not found"}), 404

        data = request.get_json(silent=True) or {}
        updatable = ["title", "category", "author", "content",
                     "image_url", "tags", "published"]
        updates = {k: data[k] for k in updatable if k in data}

        if not updates:
            return jsonify({"error": "No valid fields provided for update"}), 400

        updates["updated_at"] = datetime.now(timezone.utc)

        mongo.db.blogs.update_one({"slug": slug.lower()}, {"$set": updates})
        updated = mongo.db.blogs.find_one({"slug": slug.lower()})

        return jsonify({
            "message": "Blog post updated successfully",
            "blog": _serialize(updated),
        }), 200

    except Exception as exc:
        return jsonify({"error": "Could not update blog", "details": str(exc)}), 500


# ── DELETE /api/blogs/<slug> ──────────────────────────────────────────────────
@blogs_bp.route("/<slug>", methods=["DELETE"])
@admin_required
def delete_blog(slug: str):
    """Unpublish a blog post by slug (admin only)."""
    try:
        result = mongo.db.blogs.update_one(
            {"slug": slug.lower()},
            {"$set": {"published": False, "updated_at": datetime.now(timezone.utc)}}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Blog post not found"}), 404

        return jsonify({"message": "Blog post deleted (unpublished) successfully"}), 200

    except Exception as exc:
        return jsonify({"error": "Could not delete blog", "details": str(exc)}), 500
