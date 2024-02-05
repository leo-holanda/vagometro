import json
import requests
import time
import os
from pymongo import MongoClient
from datetime import datetime, timedelta

def make_request(params, event):
    try:
        repo_owner = event["repo_owner"]
        repo_name = event["repo_name"]  
        url = f'https://api.github.com/repos/{repo_owner}/{repo_name}/issues'

        current_page = params['page']
        print(f"Sending a request with page = {current_page}")
        
        github_token = os.environ['GITHUB_TOKEN']
        response = requests.get(url, headers={'Authorization': f'{github_token}'}, params=params)
        response.raise_for_status()

        return response
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
    
    return None

def get_unique_issues(issues):
    unique_issues = []
    unique_issue_ids = set()
    
    for issue in issues:
        if issue["id"] not in unique_issue_ids:
            unique_issue_ids.add(issue["id"])
            unique_issues.append(issue)
    
    return unique_issues

def is_issue_published_yesterday(issue):
    current_datetime = datetime.now()

    yesterday_start = current_datetime.replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=1)
    yesterday_end = current_datetime.replace(hour=23, minute=59, second=59, microsecond=999999) - timedelta(days=1)

    published_date = datetime.strptime(issue.get("created_at"), "%Y-%m-%dT%H:%M:%SZ")

    return yesterday_start <= published_date <= yesterday_end

def is_issue_published_today(issue):
    current_datetime = datetime.now()
    today_start = current_datetime.replace(hour=0, minute=0, second=0, microsecond=0) 

    published_date = datetime.strptime(issue.get("created_at"), "%Y-%m-%dT%H:%M:%SZ")

    return today_start <= published_date

def lambda_handler(event, context):
    all_issues = []

    max_retries = 3

    params = {"per_page": 10, "page": 0, "state": "all"}
    has_collected_all_issues_since_yesterday = False

    retry_count = 0
    while retry_count < max_retries:
        request_response = make_request(params, event)

        if request_response is not None:
            issues = request_response.json()
            for issue in issues:
                if(is_issue_published_today(issue)):
                    continue
                if(is_issue_published_yesterday(issue)):
                    all_issues.append(issue)
                else:
                    has_collected_all_issues_since_yesterday = True
                    break

            time.sleep(1)

            if (has_collected_all_issues_since_yesterday):
                print(f"The script has collected all issues since yesterday.")
                break

            link_header = request_response.headers.get('link', '')
            if 'rel="next"' not in link_header:
                break 

            page += 1

        else:
            retry_count += 1
            print(f"Retrying ({retry_count}/{max_retries})...")
            time.sleep(3)


    print(f"Saving issues in MongoDB Atlas collection...")   
    if all_issues:
        try:
            mongo_uri = os.environ.get('MONGO_URI') 
            client = MongoClient(mongo_uri)
            db = client[event["database"]]
            collection = db[event["collection"]]
            
            unique_issues = get_unique_issues(all_issues)
            collection.insert_many(unique_issues)
        except e:
            print(f"Error: {e}")
    else:
        print("No issues to insert.")
