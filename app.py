from flask import Flask, jsonify, request
import random

app = Flask(__name__)

ALLOWED_ORIGINS = {
    "https://harryjwadley-stack.github.io",  # <-- confirm this exactly from your live page
    # add any other origins you use for testing or a custom domain
}

@app.after_request
def add_cors_headers(resp):
    origin = request.headers.get("Origin")
    if origin in ALLOWED_ORIGINS:
        resp.headers["Access-Control-Allow-Origin"] = origin
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
