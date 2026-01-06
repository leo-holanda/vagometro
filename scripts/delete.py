from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = str(os.getenv("MONGODB_URI"))
DB_NAME = str(os.getenv("DB_NAME"))
DATE_FIELD_NAME = "publishedDate" if DB_NAME == "gupy" else "created_at"

YEAR = 2025
QUARTER_INDEX = 2

def get_quarter_date_range():
    quarters_list = [
        (datetime(YEAR, 1, 1, 0, 0, 0, 0),  datetime(YEAR, 3, 31, 23, 59, 59, 59)),
        (datetime(YEAR, 4, 1, 0, 0, 0, 0),  datetime(YEAR, 6, 30, 23, 59, 59, 59)),
        (datetime(YEAR, 7, 1, 0, 0, 0, 0),  datetime(YEAR, 9, 30, 23, 59, 59, 59)),
        (datetime(YEAR, 10, 1, 0, 0, 0, 0), datetime(YEAR, 12, 31, 23, 59, 59, 59)),
    ]

    return quarters_list[QUARTER_INDEX]

# Before running this code, run extract.py to get a backup first.
def main():
	client = MongoClient(MONGODB_URI)
	db = client[DB_NAME]
	collection = db[COLLECTION_NAME]
	
	start_date, end_date = get_quarter_date_range()
	result = collection.delete_many({
    		DATE_FIELD_NAME: {
        		"$gte": start_date.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
        		"$lt": end_date.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    		}
	})

	print(f"Deleted {result.deleted_count} documents from {COLLECTION_NAME} for the year {start_date.year}.")
