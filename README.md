# vagômetro

> Web app that gathers and analyse data about dev jobs in Brazil

<img src="demo.png" width="100%" />

🌐 Check it at [vagometro.vercel.app/](vagometro.vercel.app/)

## Contents

- [Features](#features)
- [Installation](#installation)
- [Contributing](#contributing)
- [Built with](#built-with)
- [Deployed at](#deployed-at)
- [License](#contributing)

## Features

- Gathers daily data about dev jobs in Brazil
- Analyses the data to answer some questions:
    - Which tech stack is the most requested?
    - Which job contract type is the most frequent?
    - Which experience level has more jobs?
    - Which companies hire the most?
    - Are there more remote jobs than hybrid/on-site?
    - How many jobs are also for people with disability?
    - Regarding hybrid/on-site jobs, which cities concentrate most of the jobs?
    - Which education levels are being requested in jobs?
    - Which month has more jobs published?
    - Which foreign languages are more requested?
- For each question: 
    - Allows to see data in different time windows
    - Allows monthly and annual data comparison
    - Allows to see each job publication that was used in the analysis

## Installation

**Clone this project**

`git clone https://github.com/leo-holanda/vagometro`

**Install dev dependencies**

`npm install -g @angular/cli`

The Angular CLI version used was 16.1.8.

`npm i`

**Generate the enviroment files**

You need to generate the enviroment files with `ng generate environments`. Then, add a key named IDENTITY_POOL_ID whose value is provided by AWS Cognito to connect anonymously with DynamoDB.

Easier instructions will be provided in the next versions.

**Start the web server**

`npm run start`

## Contributing

Feel free to submit any issues or enhancement requests! I will do my best to fix or implement it. Already have a solution? Pull requests are also welcome!

## Built with

- TypeScript
- Angular
- Tailwind
- DaisyUI
- Apache ECharts

## Deployed at

- Vercel
- AWS
- Cloudflare R2 and Workers

## License

[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)
