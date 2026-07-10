from flask import Blueprint, request, jsonify
from database import db
from models import Product

products = Blueprint("products", __name__)


@products.route("/products", methods=["GET"])
def get_products():

    brand = request.args.get("brand")
    category = request.args.get("category")

    query = Product.query

    if brand:
        query = query.filter_by(brand=brand)

    if category:
        query = query.filter_by(category=category)

    products = query.all()

    return jsonify([p.to_dict() for p in products])


@products.route("/products", methods=["POST"])
def add_product():

    data = request.json

    product = Product(
        name=data["name"],
        brand=data["brand"],
        category=data["category"],
        price=data["price"],
        stock=data["stock"],
        image=data["image"]
    )

    db.session.add(product)
    db.session.commit()

    return jsonify(product.to_dict()), 201


@products.route("/products/<int:id>", methods=["PUT"])
def update_product(id):

    product = Product.query.get_or_404(id)

    data = request.json

    product.name = data.get("name", product.name)
    product.brand = data.get("brand", product.brand)
    product.category = data.get("category", product.category)
    product.price = data.get("price", product.price)
    product.stock = data.get("stock", product.stock)
    product.image = data.get("image", product.image)

    db.session.commit()

    return jsonify(product.to_dict())


@products.route("/products/<int:id>", methods=["DELETE"])
def delete_product(id):

    product = Product.query.get_or_404(id)

    db.session.delete(product)
    db.session.commit()

    return jsonify({
        "message": "Product deleted successfully"
    })