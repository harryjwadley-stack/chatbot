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
