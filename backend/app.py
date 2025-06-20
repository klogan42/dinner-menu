from flask import Flask, jsonify
from generate_menu import generate_menu_data
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/menu", methods=["GET"])
def menu():
    menu = generate_menu_data()
    if "message" in menu:
        return jsonify(menu), 404
    return jsonify(menu)

if __name__ == "__main__":
    app.run(debug=True)