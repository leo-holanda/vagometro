# vagômetro

> A website that gathers and analyse data about dev jobs in Brazil

<img src="demo.png" width="100%" />

🌐 Check it at [vagometro.vercel.app/](vagometro.vercel.app/).

## Contents

- [Features](#features)
- [Installation](#installation)
- [Contributing](#contributing)
- [Built with](#built-with)
- [Deployed at](#deployed-at)
- [License](#contributing)

## Features

- Gathers daily data about dev jobs in Brazil
- Analyses the data to provide insights for better decision-making
- Allows to see data in different time windows

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

## License

[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)
