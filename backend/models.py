from database import db


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    brand = db.Column(db.String(50))
    category = db.Column(db.String(50))
    price = db.Column(db.Float)
    stock = db.Column(db.Integer, default=0)
    image = db.Column(db.String(300))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "brand": self.brand,
            "category": self.category,
            "price": self.price,
            "stock": self.stock,
            "image": self.image
        }


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer = db.Column(db.String(100))
    phone = db.Column(db.String(30))
    address = db.Column(db.String(200))
    status = db.Column(
        db.String(50),
        default="Nouveau"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "customer": self.customer,
            "phone": self.phone,
            "address": self.address,
            "status": self.status
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