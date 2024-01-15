import os
from datetime import datetime, timedelta
import urllib.request
import json
import boto3
import time

def getJobs(response):
    responseData = response.read().decode('utf-8')
    jobs = json.loads(responseData)["data"]
    
    yesterday_date = (datetime.now() - timedelta(days=1)).date()
    filtered_jobs = [job for job in jobs if datetime.strptime(job['publishedDate'], "%Y-%m-%dT%H:%M:%S.%fZ").date() == yesterday_date]

    return filtered_jobs
    
def getDynamoConnection():
    dynamodb_table = 'jobs'
    dynamodb = boto3.resource('dynamodb', endpoint_url='http://localhost:8000')
    return dynamodb.Table(dynamodb_table)
    
def getUniqueJobs(jobs):
    unique_jobs = []
    unique_job_ids = set()
    
    for job in jobs:
        if job["id"] not in unique_job_ids:
            unique_job_ids.add(job["id"])
            unique_jobs.append(job)
    
    return unique_jobs
    
def lambda_handler(event, context):
    keywords = [
        "desenvolvedor",
        "dev",
        "front",
        "back",
        "full",
        "fullstack",
        "software"
    ]
    dynamoDb = getDynamoConnection()
    jobs = []
    headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 OPR/100.0.0.0 (Edition std-1)" }
    
    for keyword in keywords:
        url = f"https://portal.api.gupy.io/api/job?name={keyword}&offset=0&limit=300"
        request = urllib.request.Request(url, headers=headers)
        
        try:
            with urllib.request.urlopen(request) as response:
                jobs = jobs + getJobs(response)
                time.sleep(1)
                
            for job in getUniqueJobs(jobs):
                try:
                    job["partition_key"] = job["id"]
                    job["sort_key"] = job["publishedDate"]
                    dynamoDb.put_item(Item=job)
                except Exception as e:
                    print("Error putting item into DynamoDB table:", str(e))
    
        except urllib.error.URLError as e:
            print(f"Request failed: {e}")
        except json.JSONDecodeError as e:
            print(f"Failed to decode JSON: {e}")