import json
import requests
import time
import os
import random
from pymongo import MongoClient
from pymongo import errors as pymongo_errors
from datetime import datetime, timedelta

# When using this script, respect the server resources that are spend every time you send a request
# Do NOT remove sleeps nor delays used in backoff strategy (https://en.wikipedia.org/wiki/Exponential_backoff)

def request_api(params, session):
    delay = 1
    while (delay < 120):
        try:
            url = "https://employability-portal.gupy.io/api/v1/jobs"
            current_offset = params["offset"]
            print(f"Sending a request with offset = {current_offset}")
            response = session.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            time.sleep(delay)
            delay = delay * 2
            delay += random.uniform(0, 1)  # Add jitter
            print(e)

    return None
    
def get_unique_jobs(jobs):
    unique_jobs = []
    unique_job_ids = set()
    
    for job in jobs:
        if job["id"] not in unique_job_ids:
            unique_job_ids.add(job["id"])
            unique_jobs.append(job)
    
    return unique_jobs

def is_job_old(job):
    current_datetime = datetime.now()
    two_days_ago = current_datetime.replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=1)
    published_date = datetime.strptime(job.get("publishedDate"), "%Y-%m-%dT%H:%M:%S.%fZ")

    return published_date <= two_days_ago

def open_database_connection(event):
    max_retry_attempts = 3
    delay = 5

    for i in range(max_retry_attempts):
        try:
            mongo_uri = os.environ.get('MONGO_URI')
            client = MongoClient(mongo_uri)
            db = client[event["database"]]
            collection = db[event["collection"]]
            print("Connection with Atlas is open")
            return collection
        except:
            time.sleep(delay)
            delay = delay * 2
            print(f"Connection with Atlas has failed ({i + 1}/{max_retry_attempts})")

    return None
    

def get_jobs_from_api(event):
    session = requests.Session()
    valid_jobs = []

    keywords = event["keywords"]
    for keyword in keywords:
        print(f'Starting search for jobs where name = {keyword}')
        params = {"jobName": keyword, "offset": 0}
        has_collected_all_new_jobs = False

        while(True):
            data = request_api(params, session)
            if data is None: break

            jobs = data.get("data", [])
            for job in jobs:
                if(is_job_old(job)):
                    has_collected_all_new_jobs = True
                    break
                else:
                    job["_id"] = job["id"]
                    valid_jobs.append(job)

            if (has_collected_all_new_jobs):
                print(f"The script has collected all new jobs for {keyword}.")
                break

            params["offset"] += data["pagination"]["limit"]
            has_reached_end_of_data = params["offset"] > data["pagination"]["total"]
            if(has_reached_end_of_data):
                limit = data["pagination"]["total"]
                print(f"Limit of {limit} has been reached for {keyword}.")
                break      

            time.sleep(1)
        
    return valid_jobs

def save_jobs_in_database(db, jobs): 
    print("Start saving jobs in MongoDB Atlas collection...")   
    if jobs:
        try:
            unique_jobs = get_unique_jobs(jobs)
            db.insert_many(unique_jobs, ordered=False)
            print('Jobs were inserted successfully!')
        except pymongo_errors.BulkWriteError as e:
            exception_str = str(e)
            start_index = exception_str.find("writeConcernErrors")
            write_errors_str = exception_str[start_index:]
            print("Bulk write error exception was launched.")
            print(write_errors_str)
        except Exception as e:
            print(f"Error: {e}")
    else:
        print("No jobs to insert.")

    return

def lambda_handler(event, context):
    print("Starting script...")

    db = open_database_connection(event)
    # Implement some sort of notification when this happen
    if(db is None): return
    
    jobs = get_jobs_from_api(event)

    # For testing purposes
    # with open("jobs.json", "w") as f:
    #     json.dump(jobs, f)
    #     return
        
    save_jobs_in_database(db, jobs)