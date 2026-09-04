from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE_DIR = os.path.join(BASE_DIR, "database")
os.makedirs(DATABASE_DIR, exist_ok=True)

DATABASE_PATH = os.path.join(DATABASE_DIR, "shoe_store.db")

# Local development → SQLite
# Production (Render) → PostgreSQL through DATABASE_URL
DATABASE_URI = os.environ.get("DATABASE_URL")

if not DATABASE_URI:
    DATABASE_URI = "sqlite:///" + DATABASE_PATH

# Some providers may return postgres://
if DATABASE_URI.startswith("postgres://"):
    DATABASE_URI = DATABASE_URI.replace(
        "postgres://",
        "postgresql://",
        1
    )