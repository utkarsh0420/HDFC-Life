"""
Configuration module for the HDFC Life Insurance Flask application.
Reads values from the .env file via python-dotenv.
"""

import os
from datetime import timedelta
from dotenv import load_dotenv

# Load .env from the backend directory (one level up from app/)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))


class Config:
    """Base configuration class."""

    # MongoDB
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017/hdfc_life")

    # JWT
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "hdfc-life-secret-2024")
    JWT_ACCESS_TOKEN_EXPIRES: timedelta = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES: timedelta = timedelta(days=30)

    # General
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")

    # Prevent CSRF issues with JWT cookies (tokens sent in headers)
    JWT_TOKEN_LOCATION: list = ["headers"]
