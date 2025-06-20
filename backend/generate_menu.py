from flask import Flask, jsonify, request
import json
import random
from datetime import date, timedelta

app = Flask(__name__)

def load_data():
    with open("normalized_pantry.json") as f:
        pantry = json.load(f)
    with open("recipes.json") as f:
        recipes = json.load(f)
    available = {item["item"].strip().lower() for item in pantry if "item" in item and item["item"]}
    return pantry, recipes, available

pantry, recipes, available = load_data()

def missing_ingredients(recipe, available):
    needed = {ing.lower() for ing in recipe["ingredients"]}
    return needed - available

def can_make(recipe):
    return all(ing.lower() in available for ing in recipe["ingredients"])

def rank_recipes(recipes, available):
    ranked = []
    for r in recipes:
        miss = missing_ingredients(r, available)
        ranked.append((r, len(miss), miss))
    return sorted(ranked, key=lambda x: x[1])

def generate_menu_data():
    start_date = date.today()
    days = 7
    menu = {}
    # Shuffle recipes for variety
    recipe_list = recipes.copy()
    random.shuffle(recipe_list)
    for i in range(days):
        day = start_date + timedelta(days=i)
        recipe = recipe_list[i % len(recipe_list)]
        missing = missing_ingredients(recipe, available)
        if missing:
            menu[day.isoformat()] = f"{recipe['name']} (missing: {', '.join(missing)})"
        else:
            menu[day.isoformat()] = recipe['name']
    return menu

@app.route('/generate-menu', methods=['GET'])
def generate_menu():
    menu = generate_menu_data()
    if "message" in menu:
        return jsonify(menu), 404
    return jsonify(menu)

if __name__ == '__main__':
    app.run(debug=True)