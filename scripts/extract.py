import os
import json
import zipfile
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = str(os.getenv("MONGODB_URI"))
DB_NAME = str(os.getenv("DB_NAME"))
CLIENT = MongoClient(MONGODB_URI)
DATABASE = CLIENT[DB_NAME]

COLLECTIONS_BY_DATABASE = {
	"gupy": ['agile', 'dados', 'devops', 'ia', 'mobile', 'productManager', 'qa', 'recrutamento', 'uiux', 'webdev'],
	"linkedin": ['dev', 'devops_br']
}

COLLECTIONS = COLLECTIONS_BY_DATABASE[DB_NAME]

DATE_FIELD_NAME = "publishedDate" if DB_NAME == "gupy" else "created_at"

YEAR = 2025
QUARTER_INDEX = 3

def get_quarter_date_range():
    quarters_list = [
        (datetime(YEAR, 1, 1, 0, 0, 0, 0),  datetime(YEAR, 3, 31, 23, 59, 59, 59)),
        (datetime(YEAR, 4, 1, 0, 0, 0, 0),  datetime(YEAR, 6, 30, 23, 59, 59, 59)),
        (datetime(YEAR, 7, 1, 0, 0, 0, 0),  datetime(YEAR, 9, 30, 23, 59, 59, 59)),
        (datetime(YEAR, 10, 1, 0, 0, 0, 0), datetime(YEAR, 12, 31, 23, 59, 59, 59)),
    ]

    return quarters_list[QUARTER_INDEX]

def query_data(collection_name, start_date, end_date):
    collection = DATABASE[collection_name]

    query = {
        DATE_FIELD_NAME: {
            "$gte": start_date.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
            "$lte": end_date.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        }
    }

    results = list(collection.find(query))
    print(f"Quarter Q{QUARTER_INDEX+1}: {len(results)} documents found")

    # Convert ObjectId and datetime to strings
    for r in results:
        r["_id"] = str(r["_id"])

    return results

def export_data(data, collection_name):
    output_dir = f"{DB_NAME}/{YEAR}/{collection_name}/"
    os.makedirs(output_dir, exist_ok=True)

    json_path = os.path.join(output_dir, f"Q{QUARTER_INDEX + 1}.json")
    zip_path = os.path.join(output_dir, f"Q{QUARTER_INDEX + 1}.zip")

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.write(json_path, arcname="data.json")
        os.remove(json_path)

    print(f"Data written and zipped at: {zip_path}")

def main():
    print(f"\nProcessing {YEAR} year...")    
    start, end = get_quarter_date_range()
    print(f"\nProcessing Q{QUARTER_INDEX + 1} ({start.date()} to {end.date()})...")
    
    for collection in COLLECTIONS:
        print(f"\nProcessing {collection} collection...")
        data = query_data(collection, start, end)
        export_data(data, collection)

main()