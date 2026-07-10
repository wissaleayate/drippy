from flask import Blueprint, jsonify, request
from database import db
from models import Review

reviews_bp = Blueprint("reviews", __name__)


# Get all reviews
@reviews_bp.route("/reviews", methods=["GET"])
def get_reviews():
    reviews = Review.query.all()

    return jsonify([
        review.to_dict()
        for review in reviews
    ])


# Add a review
@reviews_bp.route("/reviews", methods=["POST"])
def add_review():
    data = request.json

    review = Review(
        product_id=data["product_id"],
        username=data["username"],
        rating=data["rating"],
        fit=data["fit"],
        comment=data["comment"]
    )

    db.session.add(review)
    db.session.commit()

    return jsonify(review.to_dict()), 201