import os
import re
import json
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_mail import Mail, Message
from werkzeug.utils import secure_filename

from database import db, DATABASE_URI
from models import Product, Order, Review, Promotion, DeliveryRate, StoreSettings, User

app = Flask(__name__)
CORS(app)

# ========================
# EMAIL CONFIGURATION
# ========================
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True 
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")  
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
app.config['MAIL_DEFAULT_SENDER'] = ('Drippy Store', app.config['MAIL_USERNAME'])

mail = Mail(app)

EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

# ========================
# EMAIL OTP VERIFICATION
# ========================
import random

OTP_STORE = {}  # { email: {"code": "123456", "expires": timestamp} }
VERIFIED_EMAILS = {}  # { email: expiry_timestamp } -- valid for 30 min after verification
OTP_LIFETIME_SECONDS = 10 * 60
VERIFIED_LIFETIME_SECONDS = 30 * 60


def send_otp_email(email, code):
    html_body = f"""
    <div style="font-family:Arial,sans-serif; max-width:400px; margin:auto;">
        <h2>Your Drippy verification code</h2>
        <p>Enter this code to confirm your order:</p>
        <p style="font-size:32px; font-weight:bold; letter-spacing:8px;">{code}</p>
        <p>This code expires in 10 minutes.</p>
    </div>
    """
    msg = Message(
        subject="Your Drippy verification code",
        recipients=[email],
        html=html_body
    )
    mail.send(msg)


@app.route("/send-otp", methods=["POST"])
def send_otp():
    data = request.json
    email = data.get("email", "").strip().lower()

    if not is_valid_email(email):
        return jsonify({"error": "Invalid email address"}), 400

    code = str(random.randint(100000, 999999))
    OTP_STORE[email] = {"code": code, "expires": time.time() + OTP_LIFETIME_SECONDS}

    try:
        send_otp_email(email, code)
    except Exception as e:
        print(f"Failed to send OTP email: {e}")
        return jsonify({"error": "Could not send verification email. Check the address and try again."}), 500

    return jsonify({"success": True, "message": "Verification code sent."}), 200


@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.json
    email = data.get("email", "").strip().lower()
    code = data.get("code", "").strip()

    entry = OTP_STORE.get(email)
    if not entry:
        return jsonify({"error": "No verification code was sent to this email."}), 400

    if time.time() > entry["expires"]:
        del OTP_STORE[email]
        return jsonify({"error": "Code expired. Please request a new one."}), 400

    if code != entry["code"]:
        return jsonify({"error": "Incorrect code."}), 400

    del OTP_STORE[email]
    VERIFIED_EMAILS[email] = time.time() + VERIFIED_LIFETIME_SECONDS

    return jsonify({"success": True, "message": "Email verified."}), 200


def is_email_verified(email):
    email = email.strip().lower()
    expiry = VERIFIED_EMAILS.get(email)
    if not expiry:
        return False
    if time.time() > expiry:
        del VERIFIED_EMAILS[email]
        return False
    return True




def is_valid_email(email):
    return bool(email) and bool(EMAIL_REGEX.match(email))

def send_receipt_email(order):
    if not order.email or not is_valid_email(order.email):
        return  # no valid email, skip silently

    try:
        items = json.loads(order.items) if order.items else []
    except Exception:
        items = []

    items_html = ""
    for item in items:
        items_html += f"""
        <tr>
            <td style="padding:8px 0;">{item.get('name','')} ({item.get('brand','')}) - Size {item.get('size','')}</td>
            <td style="padding:8px 0; text-align:right;">{item.get('quantity',1)} x {item.get('price',0)} DA</td>
        </tr>
        """

    html_body = f"""
    <div style="font-family:Arial,sans-serif; max-width:500px; margin:auto;">
        <h2>Thank you for your order, {order.customer}!</h2>
        <p>Your order <strong>#{order.id}</strong> has been received.</p>
        <table style="width:100%; border-collapse:collapse;">
            {items_html}
        </table>
        <hr>
        <p><strong>Shipping:</strong> {order.shipping_price} DA</p>
        <p><strong>Total Paid:</strong> {order.total_price} DA</p>
        <p><strong>Delivery Address:</strong> {order.address}, {order.wilaya}</p>
        <p><strong>Order Reference:</strong> {order.uuid}</p>
        <p>We'll notify you when your order ships.</p>
    </div>
    """

    try:
        msg = Message(
            subject=f"Your Drippy Order Receipt #{order.id}",
            recipients=[order.email],
            html=html_body
        )
        mail.send(msg)
    except Exception as e:
        print(f"Failed to send receipt email: {e}")

# ========================
# ADMIN AUTH (simple, single-account for now)
# ========================
import secrets
import time
from functools import wraps

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin"

# In-memory token store: { token: expiry_timestamp }
# Note: resets if the server restarts — fine for a small store, upgrade to DB later if needed.
ADMIN_TOKENS = {}
TOKEN_LIFETIME_SECONDS = 60 * 60 * 24  # 24 hours

def issue_admin_token():
    token = secrets.token_hex(32)
    ADMIN_TOKENS[token] = time.time() + TOKEN_LIFETIME_SECONDS
    return token

def is_valid_admin_token(token):
    if not token or token not in ADMIN_TOKENS:
        return False
    if time.time() > ADMIN_TOKENS[token]:
        del ADMIN_TOKENS[token]
        return False
    return True

def require_admin(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "").strip()
        if not is_valid_admin_token(token):
            return jsonify({"error": "Unauthorized. Please log in as admin."}), 401
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper

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
        token = issue_admin_token()
        return jsonify({"success": True, "token": token}), 200

    return jsonify({"success": False, "error": "Invalid username or password"}), 401


@app.route("/admin/verify", methods=["GET"])
def admin_verify():
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "").strip()
    if is_valid_admin_token(token):
        return jsonify({"valid": True}), 200
    return jsonify({"valid": False}), 401


@app.route("/admin/logout", methods=["POST"])
def admin_logout():
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "").strip()
    ADMIN_TOKENS.pop(token, None)
    return jsonify({"success": True}), 200
# ========================
# USER AUTH
# ========================
@app.route("/register", methods=["POST"])
def register_user():
    data = request.json
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400

    if not is_valid_email(email):
        return jsonify({"error": "Invalid email address"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"error": "An account with this email already exists"}), 409

    user = User(name=name, email=email, created_at=datetime.now().strftime("%d-%m-%Y %H:%M"))
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_dict()), 201


@app.route("/login", methods=["POST"])
def login_user():
    data = request.json
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify(user.to_dict()), 200


@app.route("/admin/users", methods=["GET"])
@require_admin
def get_all_users():
    users = User.query.order_by(User.id.desc()).all()
    return jsonify([u.to_dict() for u in users])




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
@require_admin
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



@app.route("/products/uuid/<string:uuid_val>", methods=["PUT"])
@require_admin
def update_product(uuid_val):
    product = Product.query.filter_by(uuid=uuid_val).first()
    if not product:
        return jsonify({"error": "Product not found"}), 404

    data = request.json

    if "stock" in data:
        try:
            new_stock = int(data["stock"])
            if new_stock < 0:
                return jsonify({"error": "Stock cannot be negative"}), 400
            product.stock = new_stock
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid stock value"}), 400

    if "price" in data:
        try:
            new_price = float(data["price"])
            if new_price < 0:
                return jsonify({"error": "Price cannot be negative"}), 400
            product.price = new_price
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid price value"}), 400

    if "name" in data and data["name"]:
        product.name = data["name"]

    if "brand" in data and data["brand"]:
        product.brand = data["brand"]

    db.session.commit()

    return jsonify(product.to_dict()), 200










@app.route("/products/uuid/<string:uuid_val>/featured", methods=["PUT"])
@require_admin
def toggle_product_featured(uuid_val):
    product = Product.query.filter_by(uuid=uuid_val).first()
    if not product:
        return jsonify({"error": "Product not found"}), 404

    data = request.json
    product.featured = bool(data.get("featured", not product.featured))
    db.session.commit()

    return jsonify(product.to_dict()), 200

@app.route("/products", methods=["POST"])
@require_admin
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

    # Optional extra gallery images (multiple files under 'extra_images')
    extra_urls = []
    for extra_file in request.files.getlist('extra_images'):
        if extra_file and extra_file.filename and allowed_file(extra_file.filename):
            extra_filename = secure_filename(extra_file.filename)
            unique_extra_filename = f"{int(datetime.now().timestamp())}_{extra_filename}"
            extra_file.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_extra_filename))
            extra_urls.append(f"http://127.0.0.1:5000/uploads/{unique_extra_filename}")

    name = request.form.get("name")
    brand = request.form.get("brand")
    category = request.form.get("category")
    price = float(request.form.get("price", 0))
    stock = int(request.form.get("stock", 0))
    sizes = request.form.get("sizes", "")

    product = Product(
        name=name,
        brand=brand,
        category=category,
        price=price,
        stock=stock,
        image=image_url,
        sizes=sizes,
        extra_images=",".join(extra_urls)
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
@require_admin
def delete_promotion(uuid_val):
    promotion = Promotion.query.filter_by(uuid=uuid_val).first()
    if not promotion:
        return jsonify({"error": "Promotion not found"}), 404

    db.session.delete(promotion)
    db.session.commit()

    return jsonify({"message": "Promotion deleted successfully"}), 200


@app.route("/promotions", methods=["POST"])
@require_admin
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
@require_admin
def add_or_update_delivery_rate():
    data = request.json
    wilaya = data.get("wilaya")

    if not wilaya:
        return jsonify({"error": "Wilaya is required"}), 400

    rate = DeliveryRate.query.filter_by(wilaya=wilaya).first()

    if rate:
        rate.home_price = float(data.get("home_price", rate.home_price))
        rate.pickup_price = float(data.get("pickup_price", rate.pickup_price))
        rate.delivery_time = data.get("delivery_time", rate.delivery_time)
    else:
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
@require_admin
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
    email = data.get("email", "")
    address = data.get("address")
    wilaya = data.get("wilaya")
    delivery_type = data.get("delivery_type", "home")
    user_id = data.get("user_id")

    if email and not is_valid_email(email):
        return jsonify({"error": "Invalid email address"}), 400
    if not email or not is_email_verified(email):
        return jsonify({"error": "Please verify your email before placing an order."}), 403

    cart_items = data.get("items", [])
    items_json = json.dumps(cart_items)

    items_total = sum(item.get("price", 0) * item.get("quantity", 1) for item in cart_items)

    shipping_price = 500
    if wilaya:
        rate = DeliveryRate.query.filter_by(wilaya=wilaya).first()
        if rate:
            shipping_price = rate.pickup_price if delivery_type == "pickup" else rate.home_price

    total_price = items_total + shipping_price
    current_time = datetime.now().strftime("%d-%m-%Y %H:%M")

    order = Order(
        user_id=user_id,
        customer=customer,
        phone=phone,
        email=email,
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

    send_receipt_email(order)

    return jsonify(order.to_dict()), 201

@app.route('/orders/user/<string:email>', methods=['GET'])
def get_orders_for_user(email):
    email = email.strip().lower()
    orders = Order.query.filter(Order.email.ilike(email)).order_by(Order.id.desc()).all()
    return jsonify([o.to_dict() for o in orders])


@app.route('/orders/<order_id_or_uuid>', methods=['GET'])
def get_order_status(order_id_or_uuid):
    order = Order.query.filter_by(uuid=order_id_or_uuid).first()

    if not order:
        return jsonify({"error": "Order not found. Please check your Unique UUID code."}), 404

    return jsonify(order.to_dict()), 200


@app.route('/orders/<uuid>/status', methods=['PUT'])
@require_admin
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
@require_admin
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


@app.route("/users/<int:user_id>/purchases", methods=["GET"])
def get_user_purchases(user_id):
    orders = Order.query.filter_by(user_id=user_id).all()
    purchased_uuids = set()
    for order in orders:
        try:
            items = json.loads(order.items) if order.items else []
        except Exception:
            items = []
        for item in items:
            if item.get("id"):
                purchased_uuids.add(str(item["id"]))
    return jsonify(list(purchased_uuids))


@app.route("/reviews", methods=["POST"])
def add_review():
    product_uuid = request.form.get("product_uuid")
    username = request.form.get("username")
    rating = request.form.get("rating")
    fit = request.form.get("fit")
    comment = request.form.get("comment")
    user_id = request.form.get("user_id")

    if not all([product_uuid, username, rating, fit, comment, user_id]):
        return jsonify({"error": "Missing required fields"}), 400

    # Verify this user actually purchased this exact product before allowing a review
    orders = Order.query.filter_by(user_id=user_id).all()
    purchased_uuids = set()
    for order in orders:
        try:
            items = json.loads(order.items) if order.items else []
        except Exception:
            items = []
        for item in items:
            if item.get("id"):
                purchased_uuids.add(str(item["id"]))

    if product_uuid not in purchased_uuids:
        return jsonify({"error": "You can only review products you have purchased."}), 403

    image_urls = []
    for photo in request.files.getlist('images'):
        if photo and photo.filename and allowed_file(photo.filename):
            filename = secure_filename(photo.filename)
            unique_filename = f"{int(datetime.now().timestamp())}_{filename}"
            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))
            image_urls.append(f"http://127.0.0.1:5000/uploads/{unique_filename}")

    review = Review(
        product_uuid=product_uuid,
        user_id=int(user_id),
        username=username,
        rating=int(rating),
        fit=fit,
        comment=comment,
        image_urls=",".join(image_urls),
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
@require_admin
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

with app.app_context():
    db.create_all()


if __name__ == "__main__":
    app.run(debug=True)