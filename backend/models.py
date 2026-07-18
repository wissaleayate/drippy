import uuid
from database import db
def generate_uuid():
    return str(uuid.uuid4())

class Product(db.Model):
    # Old code remains exactly the same:
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    brand = db.Column(db.String(50))
    category = db.Column(db.String(50))
    price = db.Column(db.Float)
    stock = db.Column(db.Integer, default=0)
    image = db.Column(db.String(300))
    
    # NEW: We only ADD this new column. 
    # It is safe and won't conflict with your team's work.
    uuid = db.Column(db.String(36), unique=True, default=generate_uuid)
    def to_dict(self):
        return {
            "uuid": self.uuid,
            "name": self.name,
            "brand": self.brand,
            "category": self.category,
            "price": self.price,
            "stock": self.stock,
            "image": self.image
        }
    




class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    customer = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), default="Nouveau")
    items = db.Column(db.Text, nullable=True)
    total_price = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "uuid": self.uuid, # <--- Make sure this is returned!
            "customer": self.customer,
            "phone": self.phone,
            "address": self.address,
            "status": self.status,
            "items": self.items,
            "total_price": self.total_price,
            "created_at": self.created_at
        }


class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer)
    username = db.Column(db.String(100))
    rating = db.Column(db.Integer)
    fit = db.Column(db.String(30))
    comment = db.Column(db.String(500))

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "username": self.username,
            "rating": self.rating,
            "fit": self.fit,
            "comment": self.comment
        }