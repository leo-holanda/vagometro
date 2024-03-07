# vagômetro

> IT jobs tracker in Brazil

<img src="demo.png" width="100%" />

🌐 Check it at [vagometro.vercel.app](https://vagometro.vercel.app)

## Contents

- [Features](#features)
- [Installation](#installation)
- [Contributing](#contributing)
- [Built with](#built-with)
- [Deployed at](#deployed-at)
- [License](#contributing)

## Features

### Daily tracking of IT job postings in Brazil

It collects job postings every day from Gupy, LinkedIn and GitHub repositories.


### Data Extraction

For each job posting, it extracts:
- Tech Stack (i.e. JavaScript, Docker, etc)
- Contract Type (i.e. CLT, PJ, etc)
- Experience level (i.e. Senior, Mid, etc)
- Workplace Type (i.e. Remote, Hybrid, On-site)
- Inclusion Type (i.e. PCD, Women, Black people, etc)
- Educational Level (i.e. Bachelor, Masters, Technician, etc)
- Required languages (i.e. English, Spanish, etc)
- Certifications (i.e. SCRUM PSD, AWS CCP, etc)
- Repostings of the same job and the timespan between repostings
- City, state and company who did the job posting

### Data Ranking 

Each data type has its own ranking that shows which items appears more frequently.

i.e. Tech Stack Ranking shows that JavaScript is the Top 1 most requested language.

<img src="./frontend/src/assets/ranks.png" width="100%" />

### Overview Pages

Each data type also has its own overview page. It filters the data and shows how each item is related to other data types. 

i.e. Experience level overview shows that senior jobs are more likely to be remote that hybrid/on-site, the companies that hire the most are the X and Y, Z% of the job required a Bachelor's degree and so on.

<img src="./frontend/src/assets/overview.png" width="100%" />

### Monthly and Yearly Comparisons

Tracks the job postings oscillation through time.

<img src="./frontend/src/assets/comparison.png" width="100%" />

### Easy Search 

Allows to define a search profile that is matched against all job postings. It generates a match percentage that indicates how much each job posting is similar to the search profile.

<img src="./frontend/src/assets/easy_search.png" width="100%" />


## Installation

Instructions will be provided in a future version.

## Contributing

Feel free to submit any issues or enhancement requests! I will do my best to fix or implement it. Already have a solution? Pull requests are also welcome!

## Built with

- Python
- MongoDB
- TypeScript
- Angular
- Tailwind
- DaisyUI
- Apache ECharts
- Umami

## Deployed at

- Vercel
- AWS Lambda (Python)
- Cloudflare R2 and Workers
- GCP Cloud Run (Python)
- MongoDB Atlas
- Supabase

## License

[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)
