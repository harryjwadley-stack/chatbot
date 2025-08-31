# app.py
from flask import Flask, jsonify, request
import random

app = Flask(__name__)

GHPAGES_ORIGIN = 'https://harryjwadley-stack.github.io'  # EXACT value of location.origin

@app.after_request
def add_cors(resp):
    resp.headers["Access-Control-Allow-Origin"] = GHPAGES_ORIGIN
    resp.headers["Vary"] = "Origin"
    resp.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return resp

@app.get("/")
def health():
    return "API is running. Try /api/random"

@app.route("/api/random", methods=["GET", "OPTIONS"])
def random_number():
    if request.method == "OPTIONS":
        return ("", 204)
    return jsonify({"value": random.randint(0, 100)})

@app.route("/api/calculate", methods=["POST"])
def calculate():
    data = request.get_json(silent=True) or {}
    if "value" not in data:
        return jsonify({"error": "Missing 'value'"}), 400
    try:
        x = float(data["value"])
    except (TypeError, ValueError):
        return jsonify({"error": "'value' must be numeric"}), 400

    # Replace with your real calculation:
    result = x * x + 10

    return jsonify({"input": x, "result": result})
