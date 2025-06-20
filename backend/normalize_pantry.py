import json
import re
from sentence_transformers import SentenceTransformer, util

# Load pantry and recipes
with open("pantry.json") as f:
    pantry = json.load(f)

with open("recipes.json") as f:
    recipes = json.load(f)

# Flatten and deduplicate known ingredients
known_ingredients = sorted(set(
    ing.lower() for recipe in recipes for ing in recipe["ingredients"]
))

# Load transformer model (use local if SSL issues)
model = SentenceTransformer("C:/ML-Project/all-MiniLM-L6-v2")  # or "all-MiniLM-L6-v2"

# Junk filter
JUNK_WORDS = [
    "vitamin", "foil", "paper", "towel", "spray", "floss", "underwear",
    "gatorade", "remedies", "diaper", "pads", "napkin", "bottle"
]

def is_food(item_name: str) -> bool:
    return not any(junk in item_name.lower() for junk in JUNK_WORDS)

# Optional cleaner: removes brand names, units, etc.
def clean_item_name(name: str) -> str:
    name = name.lower()
    name = re.sub(r"\b(good & gather|market pantry|up&up|oikos|yoplait|mission|thomas|oscar mayer|quest|pampers)\b", "", name)
    name = re.sub(r"\b\d+[\w\.]*\b", "", name)  # removes things like 12ct, 16oz
    name = re.sub(r"[^a-z\s]", "", name)        # remove non-alpha
    return re.sub(r"\s{2,}", " ", name).strip()

# Semantic match with score logging
def normalize_with_model(item_name: str, ingredients: list[str], threshold=0.38):
    cleaned = clean_item_name(item_name)
    item_vec = model.encode(cleaned, convert_to_tensor=True)
    ingredient_vecs = model.encode(ingredients, convert_to_tensor=True)

    similarities = util.cos_sim(item_vec, ingredient_vecs)
    best_score = similarities.max().item()
    best_index = similarities.argmax().item()
    best_match = ingredients[best_index]

    return (best_match, best_score) if best_score >= threshold else (None, best_score)

# Normalize
missed_items = []

print("\n🔍 Normalizing pantry items using Hugging Face embeddings...\n")

for item in pantry:
    raw_name = item["item"]

    if is_food(raw_name):
        match, score = normalize_with_model(raw_name, known_ingredients, threshold=0.38)
        if match:
            print(f"✅ {raw_name} → {match} (score: {score:.2f})")
        else:
            print(f"❌ No match: {raw_name} (score: {score:.2f})")
            missed_items.append({"item": raw_name, "score": score})
        item["normalized_name"] = match
    else:
        print(f"🛑 Skipped (junk): {raw_name}")
        item["normalized_name"] = None

# Save results
with open("normalized_pantry.json", "w") as f:
    json.dump(pantry, f, indent=2)

with open("missed_items.txt", "w") as f:
    for missed in missed_items:
        f.write(f"{missed['item']} (score: {missed['score']:.2f})\n")

print("\n✅ Done: normalized_pantry.json and missed_items.txt saved.\n")