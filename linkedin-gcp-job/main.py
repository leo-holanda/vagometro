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
from pymongo import errors as pymongo_errors

# This code is a modified version of the main.py file found in this repository: https://github.com/cwwmbm/linkedinscraper
# The author is cwwmbm. His/her GitHub profile can be found in this link: https://github.com/cwwmbm

TASK_INDEX = os.getenv("CLOUD_RUN_TASK_INDEX", 0)
TASK_ATTEMPT = os.getenv("CLOUD_RUN_TASK_ATTEMPT", 0)


def get_with_retry(url, session):
    delay = 2
    while (True):
        try:
            response = session.get(url, timeout=5)
            response.raise_for_status()
            return BeautifulSoup(response.content, "lxml")
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


def get_parsed_jobs(session):
    all_jobs = []
    search_queries = os.getenv("SEARCH_QUERY").split(",")

    # externally defined by linkedin
    geo_id = os.getenv("GEO_ID")

    # 3 days = 60 * 60 * 24 * 3
    timespan = "r259200"

    for query in search_queries:
        keywords = quote(query)  # URL encode the keywords
        page = 0

        while (True):
            url = f"https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords={keywords}&geoId={geo_id}&f_TPR={timespan}&start={25*page}"
            print(f"Sending a request with start = {page * 25}")
            soup = get_with_retry(url, session)
            jobs = parse_jobs_data(soup)

            if (jobs == None):
                print("The final page has been reached")
                break

            all_jobs = all_jobs + jobs
            page += 1

            # LinkedIn sets a limit of 1000 jobs, so the loop must stop after the 39 page is requested
            # Because 39 * 25 + 25 (from the 0 page) = 1000
            # To avoid getting error 400 and retrying, the loop must break
            if(page == 40):
                print("The 1000 jobs limit has been reached")
                break

            tm.sleep(1)

        print("Finished scraping page: ", url)

    print("Total job cards scraped: ", len(all_jobs))
    unique_jobs = get_unique_jobs(all_jobs)
    print("Total job cards after removing duplicates: ", len(unique_jobs))

    return unique_jobs


def parse_job_page(soup):
    # This function used to search for the seniority level tag
    # This tag is highly misleading. Lots of times the person or robot that creates the job posting do not use the correct level
    # Due to this, it was removed.
    
    employment_type = None
    description = None

    try:
        employment_type_title_tag = soup.find(
            lambda tag: tag.name == 'h3' and 'Employment type' in tag.get_text(strip=True))

        if employment_type_title_tag:
            employment_type_content_Tag = employment_type_title_tag.find_next(
                'span', class_='description__job-criteria-text--criteria')
            if employment_type_content_Tag:
                employment_type = employment_type_content_Tag.get_text(
                    strip=True)
    except:
        print("Couldn't find employment type title tag")

    try:
        div = soup.find(
            'div', class_='description__text description__text--rich')
        description = div.get_text(" ").strip()
        description = description.replace('\n', ' ')
        description = description.replace('::marker', ' ')
        description = description.replace(
            'Show less', '').replace('Show more', '')
    except:
        print("Couldn't find description text tag")


    return {description: description, employment_type: employment_type}


def parse_jobs_data(soup):
    try:
        divs = soup.find_all('div', class_='base-search-card__info')
        if(len(divs) == 0): 
            print("Empty page, no jobs found")
            return None
    except:
        return None

    job_list = []
    for item in divs:
        company = item.find('a', class_='hidden-nested-link', href=True)
        # Low quality job postings usually doesn't not have the company name inside this specific a tag
        # If that's the case, do not consider this job posting
        if(company == None): continue

        title = item.find('h3').text.strip()
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
            'company_name': company.text.strip().replace('\n', ' ') if company else '',
            'company_url': company.get('href') if company else '',
            'location': location.text.strip() if location else '',
            'created_at': date,
            'url': job_url,
            'description': None,
            'employment_type': None
        }

        job_list.append(job)

    return job_list

def save_jobs_in_database(collection, jobs):
    print("Total jobs to save: ", len(jobs))
    try:
        collection.insert_many(jobs, ordered=False)
        print("Jobs were inserted successfully.")
    except pymongo_errors.BulkWriteError as e:
        exception_str = str(e)
        start_index = exception_str.find("writeConcernErrors")
        write_errors_str = exception_str[start_index:]
        print("Bulk write error exception was launched.")
        print(write_errors_str)
    except Exception as e:
        print(f"Error: {e}")

def main():
    print(f"Starting Task #{TASK_INDEX}, Attempt #{TASK_ATTEMPT}...")

    try:
        MONGO_URI = os.getenv("MONGO_URI")
        DB_NAME = os.getenv("DB_NAME")
        COLLECTION_NAME = os.getenv("COLLECTION_NAME")

        mongo_uri = MONGO_URI
        client = MongoClient(mongo_uri)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
    except Exception as e:
        print("Connection with Mongo has failed")
        print(f"Error: {str(e)}")
        sys.exit(1)

    session = requests.Session()
    session.headers = {
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }

    parsed_jobs = get_parsed_jobs(session)

    if len(parsed_jobs) == 0:
        print("No jobs found")
        return

    saved_jobs_id_set = {job['_id'] for job in collection.find({}, {'_id': 1})}
    new_jobs = [job for job in parsed_jobs if job['id'] not in saved_jobs_id_set]
    print(f"{len(new_jobs)} new jobs found!")

    jobs_to_save = []
    for job in new_jobs:
        try:
            job_page = get_with_retry(job['url'], session)
            description, employment_type = parse_job_page(
                job_page)
            job['description'] = description
            job['employment_type'] = employment_type

            if (job['description'] is None):
                print('Failed to get job description for',
                    job['title'], 'at ', job['company_name'], job['url'])

            job["_id"] = job['id']
            jobs_to_save.append(job)
            tm.sleep(1)
        except:
            print("An error ocurred while parsing job page")
        
        if(len(jobs_to_save) == 50):
            save_jobs_in_database(collection, jobs_to_save)
            jobs_to_save = []

    session.close()
    if(len(jobs_to_save) > 0): save_jobs_in_database(collection, jobs_to_save)
    client.close()
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
