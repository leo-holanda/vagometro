import json
import os
import sys
import requests
import time as tm
import os
import random
from bs4 import BeautifulSoup
from datetime import datetime, timedelta, time
from urllib.parse import quote
from pymongo import MongoClient

# This code is a modified version of the main.py file found in this repository: https://github.com/cwwmbm/linkedinscraper
# The author is cwwmbm. His/her GitHub profile can be found in this link: https://github.com/cwwmbm

TASK_INDEX = os.getenv("CLOUD_RUN_TASK_INDEX", 0)
TASK_ATTEMPT = os.getenv("CLOUD_RUN_TASK_ATTEMPT", 0)


def get_with_retry(url):
    headers = {
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }

    delay = 1
    while (True):
        try:
            response = requests.get(url, headers=headers, timeout=5)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'html.parser')
        except Exception as e:
            tm.sleep(delay)
            if (delay < 120):
                delay = delay * 2
                delay += random.uniform(0, 1)  # Add jitter
            print(e)


def get_unique_jobs(jobs):
    unique_jobs = []
    unique_jobs_ids = set()

    for jobs in jobs:
        if jobs["id"] not in unique_jobs_ids:
            unique_jobs_ids.add(jobs["id"])
            unique_jobs.append(jobs)

    return unique_jobs


def get_parsed_jobs():
    all_jobs = []
    search_queries = ["Desenvolvedor"]

    # defined by linkedin
    brazilian_geoid = 106057199

    # 24 hours = 60 * 60 * 24
    timespan = "r84600"

    for query in search_queries:
        keywords = quote(query)  # URL encode the keywords
        page = 0

        while (True):
            url = f"https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords={keywords}&geoId={brazilian_geoid}&f_TPR={timespan}&start={25*page}"
            print(f"Sending a request with start = {page * 25}")
            soup = get_with_retry(url)
            jobs = parse_jobs_data(soup)

            if (len(jobs) == 0):
                print("The final page has been reached")
                break

            all_jobs = all_jobs + jobs
            page += 1
            tm.sleep(1)

        print("Finished scraping page: ", url)

    print("Total job cards scraped: ", len(all_jobs))
    unique_jobs = get_unique_jobs(all_jobs)
    print("Total job cards after removing duplicates: ", len(unique_jobs))

    return unique_jobs


def parse_job_description(soup):
    try:
        div = soup.find(
            'div', class_='description__text description__text--rich')
    except:
        return None

    if div:
        # Remove unwanted elements
        for element in div.find_all(['span', 'a']):
            element.decompose()

        # Replace bullet points
        for ul in div.find_all('ul'):
            for li in ul.find_all('li'):
                li.insert(0, '-')

        text = div.get_text(separator='\n').strip()
        text = text.replace('\n\n', '')
        text = text.replace('::marker', '-')
        text = text.replace('-\n', '- ')
        text = text.replace('Show less', '').replace('Show more', '')
        return text
    else:
        return None


def parse_jobs_data(soup):
    # Parsing the job card info (title, company, location, date, job_url) from the beautiful soup object
    joblist = []

    try:
        divs = soup.find_all('div', class_='base-search-card__info')
    except:
        print("Empty page, no jobs found")
        return joblist

    for item in divs:
        title = item.find('h3').text.strip()
        company = item.find('a', class_='hidden-nested-link', href=True)
        location = item.find('span', class_='job-search-card__location')
        parent_div = item.parent
        entity_urn = parent_div['data-entity-urn']
        job_posting_id = entity_urn.split(':')[-1]
        job_url = 'https://www.linkedin.com/jobs/view/'+job_posting_id+'/'

        date_tag_new = item.find(
            'time', class_='job-search-card__listdate--new')
        date_tag = item.find('time', class_='job-search-card__listdate')
        date = date_tag['datetime'] if date_tag else date_tag_new['datetime'] if date_tag_new else ''

        job = {
            'id': job_posting_id,
            'title': title,
            'company': company.text.strip().replace('\n', ' ') if company else '',
            'company_url': company.get('href') if company else '',
            'location': location.text.strip() if location else '',
            'date': date,
            'url': job_url
        }

        joblist.append(job)

    return joblist


def main():
    print(f"Starting Task #{TASK_INDEX}, Attempt #{TASK_ATTEMPT}...")

    try:
        MONGO_URI = os.getenv("MONGO_URI", 0)
        DB_NAME = os.getenv("DB_NAME", 0)
        COLLECTION_NAME = os.getenv("COLLECTION_NAME", 0)

        mongo_uri = MONGO_URI
        client = MongoClient(mongo_uri)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
    except Exception as e:
        print("Connection with Atlas has failed")
        sys.exit(1)

    job_list = []
    all_jobs = get_parsed_jobs()
    if len(all_jobs) == 0:
        print("No jobs found")
        return

    for job in all_jobs:
        tm.sleep(1)

        description_soup = get_with_retry(job['url'])
        job['job_description'] = parse_job_description(description_soup)
        if (job['job_description'] is None):
            job['job_description'] = ""
            print('Failed to get job description for',
                  job['title'], 'at ', job['company'], job['url'])

        job["_id"] = job['id']
        job_list.append(job)

    print("Total jobs to add: ", len(job_list))
    try:
        collection.insert_many(job_list)
    except Exception as e:
        print(f"Error: {e}")

    print(f"Completed Task #{TASK_INDEX}.")


if __name__ == "__main__":
    try:
        main()
    except Exception as err:
        message = (
            f"Task #{TASK_INDEX}, " +
            f"Attempt #{TASK_ATTEMPT} failed: {str(err)}"
        )

        print(json.dumps({"message": message, "severity": "ERROR"}))
        sys.exit(1)  # Retry Job Task by exiting the process
