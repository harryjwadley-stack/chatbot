from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow cross-origin requests from your GitHub Pages site

@app.route("/api/message", methods=["GET"])
def get_message():
    return jsonify({"message": "wowzer"})

if __name__ == "__main__":
    app.run()
