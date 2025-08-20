# app.py
from flask import Flask, jsonify, request, make_response
import random

app = Flask(__name__)

@app.after_request
def add_cors_headers(resp):
    # Allow your GitHub Pages origin (replace username!)
    resp.headers["Access-Control-Allow-Origin"] = "https://<your-gh-username>.github.io"
    resp.headers["Vary"] = "Origin"
    resp.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return resp

# Optional: handle preflight explicitly (for POST/JSON)
@app.route("/api/random", methods=["GET", "OPTIONS"])
def random_number():
    if request.method == "OPTIONS":
        return ("", 204)   # Preflight OK
    return jsonify({"number": random.randint(0, 100)})

@app.route("/api/process", methods=["POST", "OPTIONS"])
def process():
    if request.method == "OPTIONS":
        return ("", 204)
    data = request.get_json(force=True)  # expects {"user_text": "..."}
    text = (data or {}).get("user_text", "")
    return jsonify({"ok": True, "result": text.upper()})
