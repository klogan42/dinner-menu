from PIL import Image 
from pdf2image import convert_from_path
import pytesseract
import json
import re
import glob
from datetime import datetime

JUNK_PREFIXES = (
    "amount", "discount", "target circle", "item total",
    "sales tax", "taxes", "invoice", "picked up at", "receipt total","hide details", "save", "buy 1", "get 1", "when you spend", "qualifying purchase", "target circle",
    "promo", "offer", "discount", "giftcard", "rebate", "store pickup", "personal care"
)

def is_junk_prefix(line: str) -> bool:
    low = line.lower()
    return (
        not line                               # blank
        or any(low.startswith(prefix) for prefix in JUNK_PREFIXES)
        or re.fullmatch(r"[\d\s\-]+", line)    # numeric code
    )

def extract_pantry_items(text: str):
    lines  = [ln.strip() for ln in text.splitlines()]
    pantry = []
    
    for i, line in enumerate(lines):
        if "unit price" not in line.lower():
            continue

        ln_clean = re.sub(r"[¢’•·]", "", line)

        match = re.match(
        r"^(?P<name>.+?)\s+qty\s+(?P<qty>\d+)\D*\$(?P<price>\d+(?:\.\d+)?)\s+unit price",
        ln_clean,
        re.IGNORECASE
            )
        
        if match:
            name  = match.group("name").strip()
            qty   = int(match.group("qty"))
            price = float(match.group("price"))
            pantry.append({
                "item": name,
                "qty": qty,
                "price": price,
                "remaining_percent": 100,
                "date_added": datetime.today().date().isoformat()
            })
            continue

        qty_match   = re.search(r"qty\s+(\d+)", ln_clean, re.I)
        price_match = re.search(r"\$(\d+(?:\.\d+)?)", ln_clean)
        if not (qty_match and price_match):
            print("⚠️ Skipping malformed unit-price line:", line)
            continue
        qty   = int(qty_match.group(1))
        price = float(price_match.group(1))

        name_lines = []
        j = i - 1
        while j >= 0:
            prev = lines[j]
            if prev.lower().startswith("qty") or "unit price" in prev.lower():
                break
            if prev.lower().startswith("receipt total"):
                break
            if not is_junk_prefix(prev):
                name_lines.insert(0, prev)
            j -= 1

        if len(name_lines) == 1 and len(name_lines[0]) < 15 and i + 1 < len(lines):
            nxt = lines[i + 1].strip()
            if nxt and not is_junk_prefix(nxt):
                print("↪️ Appending next line:", nxt)
                name_lines.append(nxt)

        item_name = " ".join(name_lines).strip()
        pantry.append({
            "item": item_name,
            "qty": qty,
            "price": price,
            "remaining_percent": 100,
            "date_added": datetime.today().date().isoformat()
        })

    return pantry

def process_receipts():
    receipts = glob.glob("*.pdf")
    all_pantry_items = []

    for i, receipt in enumerate(receipts):
        print(f"Processing {i+1}/{len(receipts)}: {receipt}")
        pages = convert_from_path(receipt, dpi=300)
        text = pytesseract.image_to_string(pages[0])
        pantry_items = extract_pantry_items(text)
        
        all_pantry_items.extend(pantry_items)

        print(f"✅ Parsed {len(pantry_items)} items from {receipt}")
        for p in pantry_items:
            print(p)

    with open("pantry.json", "w") as f:
        json.dump(all_pantry_items, f, indent=2)

    print(f"🍽️ Pantry now includes {len(all_pantry_items)} total items → pantry.json")

if __name__ == "__main__":
    process_receipts()