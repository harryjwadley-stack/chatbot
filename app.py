from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://harryjwadley-stack.github.io",
            # "https://your-custom-domain.com"  # add if you have one
        ]
    }
})

@app.get("/")
def health():
    return "API is running. Try /api/random"

@app.get("/api/random")
def random_number():
    return jsonify({"value": random.randint(0, 100)})

@app.post("/api/process")
def process():
    data = request.get_json(silent=True) or {}
    text = data.get("user_text", "")
    return jsonify({"ok": True, "result": text.upper()})
