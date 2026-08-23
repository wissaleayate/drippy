import uuid
from datetime import datetime
from database import db
from werkzeug.security import generate_password_hash, check_password_hash

def generate_uuid():
    return str(uuid.uuid4())

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    brand = db.Column(db.String(50))
    category = db.Column(db.String(50))
    price = db.Column(db.Float)
    stock = db.Column(db.Integer, default=0)
    image = db.Column(db.String(300))
    uuid = db.Column(db.String(36), unique=True, default=generate_uuid)
    featured = db.Column(db.Boolean, default=False)
    sizes = db.Column(db.Text, default="")  # comma-separated, e.g. "39,40,41"
    extra_images = db.Column(db.Text, default="")  # comma-separated URLs, additional gallery photos

    def to_dict(self):
        gallery = [self.image] if self.image else []
        if self.extra_images:
            gallery += [u for u in self.extra_images.split(",") if u]
        return {
            "uuid": self.uuid,
            "name": self.name,
            "brand": self.brand,
            "category": self.category,
            "price": self.price,
            "stock": self.stock,
            "image": self.image,
            "featured": self.featured,
            "sizes": [s for s in self.sizes.split(",") if s] if self.sizes else [],
            "gallery": gallery
        }


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, default=generate_uuid)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.String(50), nullable=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self, include_email=True):
        data = {
            "id": self.id,
            "uuid": self.uuid,
            "name": self.name,
            "created_at": self.created_at
        }
        if include_email:
            data["email"] = self.email
        return data


class Promotion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, default=generate_uuid)
    tag = db.Column(db.String(50))
    subtitle = db.Column(db.String(100))
    title_line1 = db.Column(db.String(100))
    title_line2 = db.Column(db.String(100))
    description = db.Column(db.String(300))
    button_text = db.Column(db.String(50), default="EXPLORE DROP")
    button_link = db.Column(db.String(200), default="/products")
    image = db.Column(db.String(300))
    display_order = db.Column(db.Integer, default=0)
    active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            "uuid": self.uuid,
            "tag": self.tag,
            "subtitle": self.subtitle,
            "title_line1": self.title_line1,
            "title_line2": self.title_line2,
            "description": self.description,
            "button_text": self.button_text,
            "button_link": self.button_link,
            "image": self.image,
            "display_order": self.display_order,
            "active": self.active
        }

class DeliveryRate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, default=generate_uuid)
    wilaya = db.Column(db.String(100), unique=True, nullable=False)
    home_price = db.Column(db.Float, default=0)
    pickup_price = db.Column(db.Float, default=0)
    delivery_time = db.Column(db.String(50), default="2 - 3 Days")

    def to_dict(self):
        return {
            "uuid": self.uuid,
            "wilaya": self.wilaya,
            "home_price": self.home_price,
            "pickup_price": self.pickup_price,
            "delivery_time": self.delivery_time
        }

class StoreSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    store_email = db.Column(db.String(150), default="")
    store_phone = db.Column(db.String(30), default="")
    store_name = db.Column(db.String(100), default="Drippy")

    def to_dict(self):
        return {
            "store_email": self.store_email,
            "store_phone": self.store_phone,
            "store_name": self.store_name,
        }

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.Integer, nullable=True)
    customer = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(150), nullable=True)
    address = db.Column(db.String(200), nullable=True)
    wilaya = db.Column(db.String(100), nullable=True)
    delivery_type = db.Column(db.String(20), nullable=True)
    shipping_price = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(50), default="Nouveau")
    items = db.Column(db.Text, nullable=True)
    total_price = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        # Combine wilaya and address so the frontend always displays the delivery location
        full_address = f"{self.wilaya}"
        if self.address:
            full_address += f" - {self.address}"

        return {
            "id": self.id,
            "uuid": self.uuid,
            "customer": self.customer,
            "phone": self.phone,
            "email": self.email,
            "address": full_address,  # <--- This now includes the wilaya!
            "wilaya": self.wilaya,
            "delivery_type": self.delivery_type,
            "shipping_price": self.shipping_price,
            "status": self.status,
            "items": self.items,
            "total_price": self.total_price,
            "created_at": self.created_at
        }


class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_uuid = db.Column(db.String(36))
    user_id = db.Column(db.Integer, nullable=True)
    username = db.Column(db.String(100))
    rating = db.Column(db.Integer)
    fit = db.Column(db.String(30))
    comment = db.Column(db.String(500))
    image_urls = db.Column(db.Text, default="")
    created_at = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "product_uuid": self.product_uuid,
            "username": self.username,
            "rating": self.rating,
            "fit": self.fit,
            "comment": self.comment,
            "images": [u for u in self.image_urls.split(",") if u] if self.image_urls else [],
            "verified_purchase": True,
            "created_at": self.created_at
        }