from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, "database", "shoe_store.db")

DATABASE_URI = "sqlite:///" + DATABASE_PATH