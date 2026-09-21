"""
Flask application factory for HDFC Life Insurance backend.
"""

from flask import Flask
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Module-level extension instances (imported by routes)
mongo = PyMongo()
jwt = JWTManager()


def create_app() -> Flask:
    """Create and configure the Flask application."""
    app = Flask(__name__)

    # ── Load configuration ────────────────────────────────────────────────────
    from app.config import Config
    app.config.from_object(Config)

    # ── Initialise extensions ─────────────────────────────────────────────────
    mongo.init_app(app)
    jwt.init_app(app)
    CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

    # ── Register blueprints ───────────────────────────────────────────────────
    from app.routes.auth import auth_bp
    from app.routes.products import products_bp
    from app.routes.calculator import calculator_bp
    from app.routes.leads import leads_bp
    from app.routes.blogs import blogs_bp
    from app.routes.dashboard import dashboard_bp
    from app.routes.partners import partners_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(calculator_bp, url_prefix="/api/calculator")
    app.register_blueprint(leads_bp, url_prefix="/api/leads")
    app.register_blueprint(blogs_bp, url_prefix="/api/blogs")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(partners_bp, url_prefix="/api/partners")

    # ── CLI Commands ──────────────────────────────────────────────────────────
    from app.seed import seed_command
    app.cli.add_command(seed_command)

    # ── Health-check route ────────────────────────────────────────────────────
    @app.route("/api/health")
    def health():
        return {"status": "ok", "message": "HDFC Life API is running"}, 200

    return app
