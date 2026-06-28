from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Sample product data (in a real app, this would be in a database)
PRODUCTS = [
    {
        "id": 1,
        "name": "Classic T-Shirt",
        "price": 24.99,
        "description": "A comfortable everyday cotton t-shirt in classic style.",
        "image": "/images/tshirt.jpg",
        "category": "clothing",
    },
    {
        "id": 2,
        "name": "Wireless Headphones",
        "price": 89.99,
        "description": "High-quality wireless headphones with noise cancellation.",
        "image": "/images/headphones.jpg",
        "category": "electronics",
    },
    {
        "id": 3,
        "name": "Ceramic Coffee Mug",
        "price": 12.99,
        "description": "Elegant ceramic coffee mug, perfect for your morning brew.",
        "image": "/images/mug.jpg",
        "category": "home",
    },
    {
        "id": 4,
        "name": "Leather Wallet",
        "price": 49.99,
        "description": "Genuine leather wallet with multiple card slots.",
        "image": "/images/wallet.jpg",
        "category": "accessories",
    },
    {
        "id": 5,
        "name": "Fitness Tracker",
        "price": 79.99,
        "description": "Track your fitness goals with this sleek and durable tracker.",
        "image": "/images/fitness.jpg",
        "category": "electronics",
    },
    {
        "id": 6,
        "name": "Notebook Set",
        "price": 19.99,
        "description": "Set of 3 premium notebooks with lined pages.",
        "image": "/images/notebook.jpg",
        "category": "stationery",
    },
]


# Routes
@app.route("/api/products", methods=["GET"])
def get_products():
    category = request.args.get("category")
    if category:
        filtered_products = [p for p in PRODUCTS if p["category"] == category]
        return jsonify(filtered_products)
    return jsonify(PRODUCTS)


@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = next((p for p in PRODUCTS if p["id"] == product_id), None)
    if product:
        return jsonify(product)
    return jsonify({"error": "Product not found"}), 404


@app.route("/api/cart", methods=["POST"])
def add_to_cart():
    # In a real application, this would interact with a database
    data = request.get_json()
    return jsonify({"success": True, "message": "Item added to cart", "data": data})


@app.route("/api/checkout", methods=["POST"])
def checkout():
    # In a real application, this would process payment and create an order
    data = request.get_json()
    return jsonify(
        {
            "success": True,
            "message": "Order placed successfully",
            "order_id": "ORD12345",
        }
    )


# Health check endpoint
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"}), 200


# Create public directory for images
if not os.path.exists("public"):
    os.makedirs("public")
if not os.path.exists("public/images"):
    os.makedirs("public/images")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "0.0.0.0")
    app.run(host=host, debug=False, port=port)
