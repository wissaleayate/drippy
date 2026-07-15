from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE_DIR = os.path.join(BASE_DIR, "database")
os.makedirs(DATABASE_DIR, exist_ok=True)
DATABASE_PATH = os.path.join(DATABASE_DIR, "shoe_store.db")

DATABASE_URI = "sqlite:///" + DATABASE_PATH
