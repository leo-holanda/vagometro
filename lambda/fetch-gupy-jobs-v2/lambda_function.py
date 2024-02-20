import json
import requests
import time
import os
from pymongo import MongoClient
from datetime import datetime, timedelta

def make_request(params):
    try:
        url = "https://portal.api.gupy.io/api/job"
        current_offset = params["offset"]
        print(f"Sending a request with offset = {current_offset}")
        response = requests.get(url, params=params)
        response.raise_for_status()

        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
    
    return None

def get_unique_jobs(jobs):
    unique_jobs = []
    unique_job_ids = set()
    
    for job in jobs:
        if job["id"] not in unique_job_ids:
            unique_job_ids.add(job["id"])
            unique_jobs.append(job)
    
    return unique_jobs

def is_job_published_yesterday(job):
    current_datetime = datetime.now()

    yesterday_start = current_datetime.replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=1)
    yesterday_end = current_datetime.replace(hour=23, minute=59, second=59, microsecond=999999) - timedelta(days=1)

    published_date = datetime.strptime(job.get("publishedDate"), "%Y-%m-%dT%H:%M:%S.%fZ")

    return yesterday_start <= published_date <= yesterday_end

def is_job_published_today(job):
    current_datetime = datetime.now()
    today_start = current_datetime.replace(hour=0, minute=0, second=0, microsecond=0) 

    published_date = datetime.strptime(job.get("publishedDate"), "%Y-%m-%dT%H:%M:%S.%fZ")

    return today_start <= published_date

def lambda_handler(event, context):
    all_jobs = []

    keywords = event["keywords"]
    mongo_uri = os.environ.get('MONGO_URI') 
    client = MongoClient(mongo_uri)
    db = client[event["database"]]
    collection = db[event["collection"]]

    max_retries = 3

    for keyword in keywords:
        params = {"name": keyword, "offset": 0}
        retry_count = 0
        has_collected_all_jobs_since_yesterday = False

        while retry_count < max_retries:
            data = make_request(params)

            if data is not None:
                jobs = data.get("data", [])

                for job in jobs:
                    if(is_job_published_today(job)):
                        continue
                    if(is_job_published_yesterday(job)):
                        job["_id"] = job["id"]
                        all_jobs.append(job)
                    else:
                        has_collected_all_jobs_since_yesterday = True
                        break

                time.sleep(1)

                if (has_collected_all_jobs_since_yesterday):
                    print(f"The script has collected all jobs for {keyword} since yesterday.")
                    break

                params["offset"] += data["pagination"]["limit"]
                has_reached_end_of_data = params["offset"] > data["pagination"]["total"]
                if(has_reached_end_of_data):
                    limit = data["pagination"]["total"]
                    print(f"Limit of {limit} has been reached for {keyword}.")
                    break
                    
            else:
                retry_count += 1
                print(f"Retrying ({retry_count}/{max_retries}) for {keyword}...")
                time.sleep(3)


    print(f"Saving jobs in MongoDB Atlas collection...")   
    if all_jobs:
        try:
            unique_jobs = get_unique_jobs(all_jobs)
            collection.insert_many(unique_jobs, ordered=False)
        except Exception as e:
            print(f"Error: {e}")
    else:
        print("No jobs to insert.")
