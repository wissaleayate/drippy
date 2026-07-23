import os
import json
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

from database import db, DATABASE_URI
from models import Product, Order, Review, Promotion, DeliveryRate, StoreSettings

app = Flask(__name__)
CORS(app)

# ========================
# ADMIN AUTH (simple, single-account for now)
# ========================
ADMIN_USERNAME = "drippy_admin"
ADMIN_PASSWORD = "Dr1ppy!Vault#2026"

# ========================
# STORAGE CONFIGURATION
# ========================
UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


db.init_app(app)

# ========================
# STATIC FILE SERVING
# ========================
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# ========================
# ADMIN LOGIN
# ========================
@app.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.json
    username = data.get("username", "")
    password = data.get("password", "")

    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        return jsonify({"success": True, "token": "admin-session-token"}), 200

    return jsonify({"success": False, "error": "Invalid username or password"}), 401


# ========================
# HOME
# ========================

# ========================
# HOME
# ========================

@app.route("/")
def home():
    return jsonify({
        "message": "Shoe Platform API is running"
    })


# ========================
# PRODUCTS
# ========================
@app.route("/products", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([
        product.to_dict()
        for product in products
    ])


@app.route("/products/uuid/<string:uuid_val>", methods=["GET"])
def get_product_by_uuid(uuid_val):
    product = Product.query.filter_by(uuid=uuid_val).first()
    if not product:
        return jsonify({
            "error": "Product not found"
        }), 404
    return jsonify(product.to_dict())


@app.route("/products/uuid/<string:uuid_val>", methods=["DELETE"])
def delete_product_by_uuid(uuid_val):
    product = Product.query.filter_by(uuid=uuid_val).first()
    if not product:
        return jsonify({
            "error": "Product not found"
        }), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({
        "message": "Product deleted successfully"
    }), 200


@app.route("/products", methods=["POST"])
def add_product():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_filename = f"{int(datetime.now().timestamp())}_{filename}"
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))
        image_url = f"http://127.0.0.1:5000/uploads/{unique_filename}"
    else:
        return jsonify({"error": "File type not allowed"}), 400

    name = request.form.get("name")
    brand = request.form.get("brand")
    category = request.form.get("category")
    price = float(request.form.get("price", 0))
    stock = int(request.form.get("stock", 0))

    product = Product(
        name=name,
        brand=brand,
        category=category,
        price=price,
        stock=stock,
        image=image_url
    )

    db.session.add(product)
    db.session.commit()

    return jsonify(product.to_dict()), 201
# ========================
# PROMOTIONS
# ========================
@app.route("/promotions", methods=["GET"])
def get_promotions():
    promotions = Promotion.query.filter_by(active=True).order_by(Promotion.display_order).all()
    return jsonify([p.to_dict() for p in promotions])


@app.route("/promotions/uuid/<string:uuid_val>", methods=["DELETE"])
def delete_promotion(uuid_val):
    promotion = Promotion.query.filter_by(uuid=uuid_val).first()
    if not promotion:
        return jsonify({"error": "Promotion not found"}), 404

    db.session.delete(promotion)
    db.session.commit()

    return jsonify({"message": "Promotion deleted successfully"}), 200


@app.route("/promotions", methods=["POST"])
def add_promotion():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_filename = f"{int(datetime.now().timestamp())}_{filename}"
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))
        image_url = f"http://127.0.0.1:5000/uploads/{unique_filename}"
    else:
        return jsonify({"error": "File type not allowed"}), 400

    tag = request.form.get("tag", "NEW DROP")
    subtitle = request.form.get("subtitle", "")
    title_line1 = request.form.get("title_line1", "")
    title_line2 = request.form.get("title_line2", "")
    description = request.form.get("description", "")
    button_text = request.form.get("button_text", "EXPLORE DROP")
    button_link = request.form.get("button_link", "/products")
    display_order = int(request.form.get("display_order", 0))

    promotion = Promotion(
        tag=tag,
        subtitle=subtitle,
        title_line1=title_line1,
        title_line2=title_line2,
        description=description,
        button_text=button_text,
        button_link=button_link,
        image=image_url,
        display_order=display_order,
        active=True
    )

    db.session.add(promotion)
    db.session.commit()

    return jsonify(promotion.to_dict()), 201


# ========================
# DELIVERY RATES
# ========================
@app.route("/delivery-rates", methods=["GET"])
def get_delivery_rates():
    rates = DeliveryRate.query.order_by(DeliveryRate.wilaya).all()
    return jsonify([r.to_dict() for r in rates])


@app.route("/delivery-rates", methods=["POST"])
def add_or_update_delivery_rate():
    data = request.json
    wilaya = data.get("wilaya")

    if not wilaya:
        return jsonify({"error": "Wilaya is required"}), 400

    rate = DeliveryRate.query.filter_by(wilaya=wilaya).first()

    if rate:
        # Update existing rate for this wilaya
        rate.home_price = float(data.get("home_price", rate.home_price))
        rate.pickup_price = float(data.get("pickup_price", rate.pickup_price))
        rate.delivery_time = data.get("delivery_time", rate.delivery_time)
    else:
        # Create new rate
        rate = DeliveryRate(
            wilaya=wilaya,
            home_price=float(data.get("home_price", 0)),
            pickup_price=float(data.get("pickup_price", 0)),
            delivery_time=data.get("delivery_time", "2 - 3 Days")
        )
        db.session.add(rate)

    db.session.commit()
    return jsonify(rate.to_dict()), 201


@app.route("/delivery-rates/uuid/<string:uuid_val>", methods=["DELETE"])
def delete_delivery_rate(uuid_val):
    rate = DeliveryRate.query.filter_by(uuid=uuid_val).first()
    if not rate:
        return jsonify({"error": "Delivery rate not found"}), 404

    db.session.delete(rate)
    db.session.commit()

    return jsonify({"message": "Delivery rate deleted successfully"}), 200




# ========================
# ORDERS
# ========================

@app.route("/orders", methods=["GET"])
def get_orders():
    orders = Order.query.all()
    return jsonify([
        order.to_dict()
        for order in orders
    ])


@app.route("/orders", methods=["POST"])
def add_order():
    data = request.json

    customer = data.get("customer")
    phone = data.get("phone")
    address = data.get("address")
    wilaya = data.get("wilaya")
    delivery_type = data.get("delivery_type", "home")  # "home" or "pickup"

    cart_items = data.get("items", [])
    items_json = json.dumps(cart_items)

    items_total = sum(item.get("price", 0) * item.get("quantity", 1) for item in cart_items)

    # Look up the real shipping price for this wilaya + delivery type
    shipping_price = 500  # fallback if no rate is set for this wilaya
    if wilaya:
        rate = DeliveryRate.query.filter_by(wilaya=wilaya).first()
        if rate:
            shipping_price = rate.pickup_price if delivery_type == "pickup" else rate.home_price

    total_price = items_total + shipping_price
    current_time = datetime.now().strftime("%d-%m-%Y %H:%M")

    order = Order(
        customer=customer,
        phone=phone,
        address=address,
        wilaya=wilaya,
        delivery_type=delivery_type,
        shipping_price=shipping_price,
        status="Nouveau",
        items=items_json,
        total_price=total_price,
        created_at=current_time
    )

    db.session.add(order)
    db.session.commit()

    return jsonify(order.to_dict()), 201


@app.route('/orders/<order_id_or_uuid>', methods=['GET'])
def get_order_status(order_id_or_uuid):
    order = Order.query.filter_by(uuid=order_id_or_uuid).first()

    if not order:
        return jsonify({"error": "Order not found. Please check your Unique UUID code."}), 404

    return jsonify(order.to_dict()), 200


@app.route('/orders/<uuid>/status', methods=['PUT'])
def update_order_status_by_uuid(uuid):
    order = Order.query.filter_by(uuid=uuid).first()

    if not order:
        return jsonify({"error": "Order not found"}), 404

    data = request.json
    new_status = data.get("status")

    allowed_status = ["Nouveau", "Confirmé", "Ne répond pas", "Expédiée"]

    if new_status not in allowed_status:
        return jsonify({"error": "Invalid status"}), 400

    order.status = new_status
    db.session.commit()

    return jsonify({"message": "Status updated successfully", "status": order.status}), 200


@app.route("/orders/<int:id>", methods=["PUT"])
def update_order_status(id):
    order = Order.query.get(id)

    if not order:
        return jsonify({
            "error": "Order not found"
        }), 404

    data = request.json
    frontend_status = data.get("status")

    status_mapping = {
        "Pending": "Nouveau",
        "Confirmed": "Confirmé",
        "Cancelled": "Ne répond pas",
    }

    final_status = status_mapping.get(frontend_status, frontend_status)

    allowed_status = [
        "Nouveau",
        "Confirmé",
        "Ne répond pas",
        "Expédiée",
        "Pending",
        "Confirmed",
        "Cancelled"
    ]

    if final_status not in allowed_status:
        return jsonify({
            "error": "Invalid status"
        }), 400

    order.status = final_status
    db.session.commit()

    return jsonify(order.to_dict()), 200


# ========================
# REVIEWS
# ========================

@app.route("/reviews", methods=["GET"])
def get_reviews():
    reviews = Review.query.all()
    return jsonify([
        review.to_dict()
        for review in reviews
    ])


@app.route("/reviews/product/<string:product_uuid>", methods=["GET"])
def get_reviews_for_product(product_uuid):
    reviews = Review.query.filter_by(product_uuid=product_uuid).order_by(Review.id.desc()).all()
    return jsonify([review.to_dict() for review in reviews])


@app.route("/reviews", methods=["POST"])
def add_review():
    data = request.json

    required = ["product_uuid", "username", "rating", "fit", "comment"]
    if not all(data.get(field) for field in required):
        return jsonify({"error": "Missing required fields"}), 400

    review = Review(
        product_uuid=data["product_uuid"],
        username=data["username"],
        rating=data["rating"],
        fit=data["fit"],
        comment=data["comment"],
        created_at=datetime.now().strftime("%d-%m-%Y %H:%M")
    )

    db.session.add(review)
    db.session.commit()

    return jsonify(review.to_dict()), 201

# ========================
# STORE SETTINGS
# ========================
@app.route("/settings", methods=["GET"])
def get_settings():
    settings = StoreSettings.query.first()
    if not settings:
        settings = StoreSettings()
        db.session.add(settings)
        db.session.commit()
    return jsonify(settings.to_dict())


@app.route("/settings", methods=["POST"])
def update_settings():
    data = request.json
    settings = StoreSettings.query.first()
    if not settings:
        settings = StoreSettings()
        db.session.add(settings)

    settings.store_email = data.get("store_email", settings.store_email)
    settings.store_phone = data.get("store_phone", settings.store_phone)
    settings.store_name = data.get("store_name", settings.store_name)

    db.session.commit()
    return jsonify(settings.to_dict()), 200


# ========================
# DATABASE
# ========================
# ========================
# DATABASE
# ========================

with app.app_context():
    db.create_all()


if __name__ == "__main__":
    app.run(debug=True)
