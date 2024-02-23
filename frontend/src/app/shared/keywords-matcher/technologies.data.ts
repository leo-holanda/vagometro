export type KeywordTypes =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'mobile'
  | 'cloud'
  | 'testing'
  | 'miscellaneous'
  | 'dataScience'
  | 'gameDevelopment'
  | 'AI'
  | 'UIUX';
export type KeywordCategoryData = { name: string; badgeClass: string };
export type KeywordCategories = Record<KeywordTypes, KeywordCategoryData>;

export const keywordCategories: KeywordCategories = {
  frontend: { name: 'Frontend', badgeClass: 'badge-primary' },
  backend: { name: 'Backend', badgeClass: 'badge-secondary' },
  database: { name: 'Banco de Dados', badgeClass: 'badge-accent' },
  mobile: { name: 'Mobile', badgeClass: 'badge-info' },
  cloud: { name: 'Cloud', badgeClass: 'badge-success' },
  testing: { name: 'Testes', badgeClass: 'badge-neutral' },
  miscellaneous: { name: 'Outros', badgeClass: 'badge-warning' },
  dataScience: { name: 'Ciência de Dados', badgeClass: 'badge-neutral' },
  gameDevelopment: { name: 'Desenvolvimento de Jogos', badgeClass: 'badge-neutral' },
  AI: { name: 'AI', badgeClass: 'badge-neutral' },
  UIUX: { name: 'UI/UX', badgeClass: 'badge-neutral' },
};

export type KeywordData = {
  name: string;
  category: KeywordCategoryData;
};

export interface Keywords {
  [key: string]: KeywordData;
}

/*
  All keys must be in lower case.
  
  You will see multiple keys pointing to the same value.
  This is necessary to ensure that different ways of writing a technology
  will always be counted as just one technology. For example:

  typescript: 'TypeScript'
  ts: 'TypeScript'

  Two different ways of writing TypeScript that in the end will be counted only as TypeScript.

  And I just have to say: this would have been a massive work without ChatGPT. Thanks ChatGPT!
*/

export const oneWordKeywords: Keywords = {
  //FRONTEND
  html: { name: 'HTML', category: keywordCategories.frontend },
  html5: { name: 'HTML', category: keywordCategories.frontend },
  css: { name: 'CSS', category: keywordCategories.frontend },
  css3: { name: 'CSS', category: keywordCategories.frontend },
  javascript: { name: 'JavaScript', category: keywordCategories.frontend },
  js: { name: 'JavaScript', category: keywordCategories.frontend },
  typescript: { name: 'TypeScript', category: keywordCategories.frontend },
  ts: { name: 'TypeScript', category: keywordCategories.frontend },
  react: { name: 'React', category: keywordCategories.frontend },
  reactjs: { name: 'React', category: keywordCategories.frontend },
  angular: { name: 'Angular', category: keywordCategories.frontend },
  angularjs: { name: 'AngularJS', category: keywordCategories.frontend },
  vuejs: { name: 'Vue.js', category: keywordCategories.frontend },
  vue: { name: 'Vue.js', category: keywordCategories.frontend },
  vue3: { name: 'Vue.js', category: keywordCategories.frontend },
  bootstrap: { name: 'Bootstrap', category: keywordCategories.frontend },
  sass: { name: 'Sass', category: keywordCategories.frontend },
  less: { name: 'Less', category: keywordCategories.frontend },
  redux: { name: 'Redux', category: keywordCategories.frontend },
  webpack: { name: 'Webpack', category: keywordCategories.frontend },
  babel: { name: 'Babel', category: keywordCategories.frontend },
  ajax: { name: 'AJAX', category: keywordCategories.frontend },
  json: { name: 'JSON', category: keywordCategories.frontend },
  xml: { name: 'XML', category: keywordCategories.frontend },
  stylus: { name: 'Stylus', category: keywordCategories.frontend },
  next: { name: 'NextJS', category: keywordCategories.frontend },
  nextjs: { name: 'NextJS', category: keywordCategories.frontend },
  blazor: { name: 'Blazor', category: keywordCategories.frontend },
  jquery: { name: 'jQuery', category: keywordCategories.frontend },
  edux: { name: 'Edux', category: keywordCategories.frontend },
  mobx: { name: 'Mobx', category: keywordCategories.frontend },
  vuex: { name: 'Vuex', category: keywordCategories.frontend },
  recoil: { name: 'Recoil', category: keywordCategories.frontend },
  leaflet: { name: 'Leaflet', category: keywordCategories.frontend },
  leafletjs: { name: 'Leaflet', category: keywordCategories.frontend },
  relay: { name: 'Relay', category: keywordCategories.frontend },
  tailwind: { name: 'Tailwind', category: keywordCategories.frontend },
  spa: { name: 'Single Page Applications', category: keywordCategories.frontend },
  pwa: { name: 'Progressive Web Apps', category: keywordCategories.frontend },
  webassembly: { name: 'WebAssembly', category: keywordCategories.frontend },
  nuxt: { name: 'Nuxt', category: keywordCategories.frontend },
  nuxtjs: { name: 'Nuxt', category: keywordCategories.frontend },
  gastby: { name: 'Gatsby', category: keywordCategories.frontend },
  jekyll: { name: 'Jekyll', category: keywordCategories.frontend },
  hugo: { name: 'Hugo', category: keywordCategories.frontend },
  remix: { name: 'Remix', category: keywordCategories.frontend },
  zustand: { name: 'Zustand', category: keywordCategories.frontend },
  rxjs: { name: 'RxJS', category: keywordCategories.frontend },
  hooks: { name: 'React Hooks', category: keywordCategories.frontend },
  microfrontends: { name: 'Micro Frontend', category: keywordCategories.frontend },
  microfrontend: { name: 'Micro Frontend', category: keywordCategories.frontend },
  vb: { name: 'Visual Basic', category: keywordCategories.frontend },
  ngrx: { name: 'NgRx', category: keywordCategories.frontend },
  seo: { name: 'SEO', category: keywordCategories.frontend },
  //END OF FRONTEND

  //BACKEND
  rest: { name: 'REST', category: keywordCategories.backend },
  restful: { name: 'REST', category: keywordCategories.backend },
  restfull: { name: 'REST', category: keywordCategories.backend },
  graphql: { name: 'GraphQL', category: keywordCategories.backend },
  kotlin: { name: 'Kotlin', category: keywordCategories.backend },
  node: { name: 'Node.js', category: keywordCategories.backend },
  nodejs: { name: 'Node.js', category: keywordCategories.backend },
  express: { name: 'Express', category: keywordCategories.backend },
  java: { name: 'Java', category: keywordCategories.backend },
  springboot: { name: 'Spring Boot', category: keywordCategories.backend },
  spring: { name: 'Spring Boot', category: keywordCategories.backend },
  python: { name: 'Python', category: keywordCategories.backend },
  django: { name: 'Django', category: keywordCategories.backend },
  ruby: { name: 'Ruby', category: keywordCategories.backend },
  rails: { name: 'Ruby On Rails', category: keywordCategories.backend },
  php: { name: 'PHP', category: keywordCategories.backend },
  laravel: { name: 'Laravel', category: keywordCategories.backend },
  asp: { name: '.NET', category: keywordCategories.backend },
  dotnet: { name: '.NET', category: keywordCategories.backend },
  csharp: { name: 'C#', category: keywordCategories.backend },
  'c#': { name: 'C#', category: keywordCategories.backend },
  go: { name: 'Go', category: keywordCategories.backend },
  golang: { name: 'Go', category: keywordCategories.backend },
  flask: { name: 'Flask', category: keywordCategories.backend },
  fastapi: { name: 'FastAPI', category: keywordCategories.backend },
  oauth: { name: 'OAuth', category: keywordCategories.backend },
  jwt: { name: 'JWT', category: keywordCategories.backend },
  'c++': { name: 'C++', category: keywordCategories.backend },
  c: { name: 'C', category: keywordCategories.backend },
  soap: { name: 'SOAP', category: keywordCategories.backend },
  rabbitmq: { name: 'RabbitMQ', category: keywordCategories.backend },
  swagger: { name: 'Swagger', category: keywordCategories.backend },
  perl: { name: 'Perl', category: keywordCategories.backend },
  delphi: { name: 'Delphi', category: keywordCategories.backend },
  cobol: { name: 'Cobol', category: keywordCategories.backend },
  fortran: { name: 'Fortran', category: keywordCategories.backend },
  grpc: { name: 'GRPC', category: keywordCategories.backend },
  postman: { name: 'Postman', category: keywordCategories.backend },
  insomnia: { name: 'Insomnia', category: keywordCategories.backend },
  apollo: { name: 'Apollo', category: keywordCategories.backend },
  entity: { name: 'Entity Framework', category: keywordCategories.backend },
  elixir: { name: 'Elixir', category: keywordCategories.backend },
  haskell: { name: 'Haskell', category: keywordCategories.backend },
  mq: { name: 'IBM MQ', category: keywordCategories.backend },
  nestjs: { name: 'NestJS', category: keywordCategories.backend },
  nest: { name: 'NestJS', category: keywordCategories.backend },
  hibernate: { name: 'Hibernate', category: keywordCategories.backend },
  websocket: { name: 'WebSocket', category: keywordCategories.backend },
  websockets: { name: 'WebSocket', category: keywordCategories.backend },
  ssr: { name: 'Server-Side Rendering', category: keywordCategories.backend },
  sse: { name: 'Server-Sent Events', category: keywordCategories.backend },
  ssg: { name: 'Static Site Generator', category: keywordCategories.backend },
  svelte: { name: 'Svelte', category: keywordCategories.backend },
  deno: { name: 'Deno', category: keywordCategories.backend },
  bun: { name: 'Bun', category: keywordCategories.backend },
  symfony: { name: 'Symfony', category: keywordCategories.backend },
  fastify: { name: 'Fastify', category: keywordCategories.backend },
  groovy: { name: 'Groovy', category: keywordCategories.backend },
  grails: { name: 'Grails', category: keywordCategories.backend },
  marshmallow: { name: 'Marshmallow', category: keywordCategories.backend },
  alembic: { name: 'Alembic', category: keywordCategories.backend },
  sqlalchemy: { name: 'SQLAlchemy', category: keywordCategories.backend },
  gradle: { name: 'Gradle', category: keywordCategories.backend },
  api: { name: 'API', category: keywordCategories.backend },
  apis: { name: 'API', category: keywordCategories.backend },
  memcached: { name: 'Memcached', category: keywordCategories.backend },
  orm: { name: 'ORM', category: keywordCategories.backend },
  rust: { name: 'Rust', category: keywordCategories.backend },
  //END OF BACKEND

  //DATABASE
  sql: { name: 'SQL', category: keywordCategories.database },
  sqlite: { name: 'SQLite', category: keywordCategories.database },
  nosql: { name: 'NoSQL', category: keywordCategories.database },
  mongodb: { name: 'MongoDB', category: keywordCategories.database },
  mongo: { name: 'MongoDB', category: keywordCategories.database },
  mysql: { name: 'MySQL', category: keywordCategories.database },
  postgresql: { name: 'PostgreSQL', category: keywordCategories.database },
  postgres: { name: 'PostgreSQL', category: keywordCategories.database },
  elasticsearch: { name: 'Elasticsearch', category: keywordCategories.database },
  oracle: { name: 'Oracle', category: keywordCategories.database },
  redis: { name: 'Redis', category: keywordCategories.database },
  plsql: { name: 'PL/SQL', category: keywordCategories.database },
  aurora: { name: 'AWS Aurora', category: keywordCategories.database },
  dynamo: { name: 'AWS Dynamo', category: keywordCategories.database },
  mariadb: { name: 'MariaDB', category: keywordCategories.database },
  //END OF DATABASE

  //MOBILE
  android: { name: 'Android', category: keywordCategories.mobile },
  ios: { name: 'iOS', category: keywordCategories.mobile },
  swift: { name: 'Swift', category: keywordCategories.mobile },
  ionic: { name: 'Ionic', category: keywordCategories.mobile },
  cordova: { name: 'Cordova', category: keywordCategories.mobile },
  reactnative: { name: 'React Native', category: keywordCategories.mobile },
  flutter: { name: 'Flutter', category: keywordCategories.mobile },
  xamarin: { name: 'Xamarin', category: keywordCategories.mobile },
  expo: { name: 'Expo', category: keywordCategories.mobile },
  dart: { name: 'Dart', category: keywordCategories.mobile },
  //END OF MOBILE

  //CLOUD
  microservices: { name: 'Microsserviços', category: keywordCategories.cloud },
  microservicos: { name: 'Microsserviços', category: keywordCategories.cloud },
  microsservicos: { name: 'Microsserviços', category: keywordCategories.cloud },
  aws: { name: 'AWS', category: keywordCategories.cloud },
  cloudflare: { name: 'Cloudflare', category: keywordCategories.cloud },
  gcp: { name: 'GCP', category: keywordCategories.cloud },
  azure: { name: 'Azure', category: keywordCategories.cloud },
  nginx: { name: 'NGINX', category: keywordCategories.cloud },
  apache: { name: 'Apache', category: keywordCategories.cloud },
  docker: { name: 'Docker', category: keywordCategories.cloud },
  dockers: { name: 'Docker', category: keywordCategories.cloud },
  container: { name: 'Container', category: keywordCategories.cloud },
  containers: { name: 'Container', category: keywordCategories.cloud },
  ci: { name: 'CI/CD', category: keywordCategories.cloud },
  cd: { name: 'CI/CD', category: keywordCategories.cloud },
  jenkins: { name: 'Jenkins', category: keywordCategories.cloud },
  terraform: { name: 'Terraform', category: keywordCategories.cloud },
  kubernetes: { name: 'Kubernetes', category: keywordCategories.cloud },
  kubernets: { name: 'Kubernetes', category: keywordCategories.cloud }, //sic
  k8s: { name: 'Kubernetes', category: keywordCategories.cloud },
  firebase: { name: 'Firebase', category: keywordCategories.cloud },
  tomcat: { name: 'Tomcat', category: keywordCategories.cloud },
  amplify: { name: 'AWS Amplify', category: keywordCategories.cloud },
  kynesis: { name: 'AWS Kynesis', category: keywordCategories.cloud },
  cloudfront: { name: 'AWS Cloudfront', category: keywordCategories.cloud },
  ecs: { name: 'AWS ECS', category: keywordCategories.cloud },
  rds: { name: 'AWS RDS', category: keywordCategories.cloud },
  sqs: { name: 'AWS SQS', category: keywordCategories.cloud },
  s3: { name: 'AWS S3', category: keywordCategories.cloud },
  lambda: { name: 'AWS Lambda', category: keywordCategories.cloud },
  sns: { name: 'AWS SNS', category: keywordCategories.cloud },
  cloudwatch: { name: 'AWS Cloudwatch', category: keywordCategories.cloud },
  cdn: { name: 'CDN', category: keywordCategories.cloud },
  webhook: { name: 'Webhook', category: keywordCategories.cloud },
  openshift: { name: 'Red Hat OpenShift', category: keywordCategories.cloud },
  ansible: { name: 'Red Hat Ansible', category: keywordCategories.cloud },
  serverless: { name: 'Serverless', category: keywordCategories.cloud },
  ec2: { name: 'AWS EC2', category: keywordCategories.cloud },
  //END OF CLOUD

  //TESTING,
  junit: { name: 'JUnit', category: keywordCategories.testing },
  mockito: { name: 'Mockito', category: keywordCategories.testing },
  teste: { name: 'Testes', category: keywordCategories.testing },
  testes: { name: 'Testes', category: keywordCategories.testing },
  jest: { name: 'Jest', category: keywordCategories.testing },
  enzyme: { name: 'Enzyme', category: keywordCategories.testing },
  cypress: { name: 'Cypress', category: keywordCategories.testing },
  selenium: { name: 'Selenium', category: keywordCategories.testing },
  cucumber: { name: 'Cucumber', category: keywordCategories.testing },
  tdd: { name: 'TDD', category: keywordCategories.testing },
  bdd: { name: 'BDD', category: keywordCategories.testing },
  ddd: { name: 'DDD', category: keywordCategories.testing },
  pytest: { name: 'pytest', category: keywordCategories.testing },
  mocks: { name: 'Mocks', category: keywordCategories.testing },
  stubs: { name: 'Stubs', category: keywordCategories.testing },
  fakes: { name: 'Fakes', category: keywordCategories.testing },
  spies: { name: 'Spies', category: keywordCategories.testing },
  dummies: { name: 'Dummies', category: keywordCategories.testing },
  jasmine: { name: 'Jasmine', category: keywordCategories.testing },
  karma: { name: 'Karma', category: keywordCategories.testing },
  e2e: { name: 'End-to-End Testing', category: keywordCategories.testing },
  testng: { name: 'TestNG', category: keywordCategories.testing },
  jmeter: { name: 'Apache JMeter', category: keywordCategories.testing },
  gherkin: { name: 'Gherkin', category: keywordCategories.testing },
  //END OF TESTING

  //MISCELLANEOUS
  git: { name: 'Git', category: keywordCategories.miscellaneous },
  github: { name: 'GitHub', category: keywordCategories.miscellaneous },
  bitbucket: { name: 'Bitbucket', category: keywordCategories.miscellaneous },
  gitflow: { name: 'GitFlow', category: keywordCategories.miscellaneous },
  scrum: { name: 'Scrum', category: keywordCategories.miscellaneous },
  gitlab: { name: 'Gitlab', category: keywordCategories.miscellaneous },
  lean: { name: 'Lean', category: keywordCategories.miscellaneous },
  kanbam: { name: 'Kanban', category: keywordCategories.miscellaneous }, //sic
  kanban: { name: 'Kanban', category: keywordCategories.miscellaneous },
  salesforce: { name: 'Salesforce', category: keywordCategories.miscellaneous },
  yaml: { name: 'YAML', category: keywordCategories.miscellaneous },
  assembly: { name: 'Assembly', category: keywordCategories.miscellaneous },
  linux: { name: 'Linux', category: keywordCategories.miscellaneous },
  jira: { name: 'Jira', category: keywordCategories.miscellaneous },
  maven: { name: 'Maven', category: keywordCategories.miscellaneous },
  wordpress: { name: 'WordPress', category: keywordCategories.miscellaneous },
  shell: { name: 'Shell', category: keywordCategories.miscellaneous },
  powershell: { name: 'PowerShell', category: keywordCategories.miscellaneous },
  meteor: { name: 'Meteor.js', category: keywordCategories.miscellaneous },
  meteorjs: { name: 'Meteor.js', category: keywordCategories.miscellaneous },
  meteorJS: { name: 'Meteor.js', category: keywordCategories.miscellaneous },
  blockchain: { name: 'Blockchain', category: keywordCategories.miscellaneous },
  drupal: { name: 'Drupal', category: keywordCategories.miscellaneous },
  magento: { name: 'Magento', category: keywordCategories.miscellaneous },
  embarcado: { name: 'Sistemas embarcados', category: keywordCategories.miscellaneous },
  embarcados: { name: 'Sistemas embarcados', category: keywordCategories.miscellaneous },
  mensageria: { name: 'Mensageria', category: keywordCategories.miscellaneous },
  zabbix: { name: 'Zabbix', category: keywordCategories.miscellaneous },
  grafana: { name: 'Grafana', category: keywordCategories.miscellaneous },
  prometheus: { name: 'Prometheus', category: keywordCategories.miscellaneous },
  jaeger: { name: 'Jaeger', category: keywordCategories.miscellaneous },
  datadog: { name: 'Datadog', category: keywordCategories.miscellaneous },
  windows: { name: 'Windows', category: keywordCategories.miscellaneous },
  iot: { name: 'IoT', category: keywordCategories.miscellaneous },
  xp: { name: 'Extreme Programming', category: keywordCategories.miscellaneous },
  crm: { name: 'CRM', category: keywordCategories.miscellaneous },
  erp: { name: 'ERP', category: keywordCategories.miscellaneous },
  poo: { name: 'POO', category: keywordCategories.miscellaneous },
  mvc: { name: 'MVC', category: keywordCategories.miscellaneous },
  mvvm: { name: 'MVVM', category: keywordCategories.miscellaneous },
  cqrs: { name: 'CQRS', category: keywordCategories.miscellaneous },
  arcgis: { name: 'ArcGIS', category: keywordCategories.miscellaneous },
  agile: { name: 'Agile', category: keywordCategories.miscellaneous },
  ssh: { name: 'SSH', category: keywordCategories.miscellaneous },
  ftp: { name: 'FTP', category: keywordCategories.miscellaneous },
  filezilla: { name: 'FileZilla', category: keywordCategories.miscellaneous },
  cache: { name: 'Cache', category: keywordCategories.miscellaneous },
  pubsub: { name: 'Pub/Sub', category: keywordCategories.miscellaneous },
  splunk: { name: 'Splunk', category: keywordCategories.miscellaneous },
  solid: { name: 'SOLID', category: keywordCategories.miscellaneous },
  kiss: { name: 'KISS', category: keywordCategories.miscellaneous },
  dry: { name: 'DRY', category: keywordCategories.miscellaneous },
  circleci: { name: 'CircleCI', category: keywordCategories.miscellaneous },
  vtex: { name: 'VTEX', category: keywordCategories.miscellaneous },
  crud: { name: 'CRUD', category: keywordCategories.miscellaneous },
  criptografia: { name: 'Criptografia', category: keywordCategories.miscellaneous },
  cryptography: { name: 'Criptografia', category: keywordCategories.miscellaneous },
  waterfall: { name: 'Waterfall', category: keywordCategories.miscellaneous },
  vscode: { name: 'VS Code', category: keywordCategories.miscellaneous },
  intellij: { name: 'Intellij', category: keywordCategories.miscellaneous },
  wcag: { name: 'WCAG', category: keywordCategories.miscellaneous },
  tcp: { name: 'TCP', category: keywordCategories.miscellaneous },
  http: { name: 'HTTP', category: keywordCategories.miscellaneous },
  lua: { name: 'Lua', category: keywordCategories.miscellaneous },
  crypto: { name: 'Crypto', category: keywordCategories.miscellaneous },
  //END OF MISCELLANEOUS

  //DATA SCIENCE
  excel: { name: 'Excel', category: keywordCategories.dataScience },
  analytics: { name: 'Analytics', category: keywordCategories.dataScience },
  dmbok: { name: 'DMBOK', category: keywordCategories.dataScience },
  r: { name: 'R', category: keywordCategories.dataScience },
  scala: { name: 'Scala', category: keywordCategories.dataScience },
  spark: { name: 'Spark', category: keywordCategories.dataScience },
  airflow: { name: 'AirFlow', category: keywordCategories.dataScience },
  lgpd: { name: 'LGPD', category: keywordCategories.dataScience },
  qlik: { name: 'Qlik', category: keywordCategories.dataScience },
  tableau: { name: 'Tableau', category: keywordCategories.dataScience },
  looker: { name: 'Looker', category: keywordCategories.dataScience },
  pipeline: { name: 'Pipeline', category: keywordCategories.dataScience },
  pipelines: { name: 'Pipeline', category: keywordCategories.dataScience },
  etl: { name: 'ETL', category: keywordCategories.dataScience },
  etls: { name: 'ETL', category: keywordCategories.dataScience },
  numpy: { name: 'NumPy', category: keywordCategories.dataScience },
  matplotlib: { name: 'Matplotlib', category: keywordCategories.dataScience },
  seaborn: { name: 'Seaborn', category: keywordCategories.dataScience },
  redshift: { name: 'Redshift', category: keywordCategories.dataScience },
  bigquery: { name: 'GCP BigQuery', category: keywordCategories.dataScience },
  snowflake: { name: 'Snowflake', category: keywordCategories.dataScience },
  hive: { name: 'Hive', category: keywordCategories.dataScience },
  hbase: { name: 'HBase', category: keywordCategories.dataScience },
  kafka: { name: 'Kafka', category: keywordCategories.dataScience },
  hadoop: { name: 'Hadoop', category: keywordCategories.dataScience },
  primavera: { name: 'Primavera', category: keywordCategories.dataScience },
  kibana: { name: 'Kibana', category: keywordCategories.dataScience },
  matlab: { name: 'Matlab', category: keywordCategories.dataScience },
  bigdata: { name: 'Big Data', category: keywordCategories.dataScience },
  powerbi: { name: 'Power BI', category: keywordCategories.dataScience },
  protheus: { name: 'Protheus', category: keywordCategories.dataScience },
  aniel: { name: 'Aniel', category: keywordCategories.dataScience },
  pentaho: { name: 'Pentaho', category: keywordCategories.dataScience },
  glue: { name: 'AWS Glue', category: keywordCategories.dataScience },
  //END OF DATA SCIENCE

  //GAME DEVELOPMENT
  unity: { name: 'Unity', category: keywordCategories.gameDevelopment },
  godot: { name: 'Godot', category: keywordCategories.gameDevelopment },
  jogos: { name: 'Desenvolvimento de Jogos', category: keywordCategories.gameDevelopment },
  //END OF GAME DEVELOPMENT

  //AI
  ia: { name: 'IA', category: keywordCategories.AI },
  ai: { name: 'IA', category: keywordCategories.AI },
  tensorflow: { name: 'TensorFlow', category: keywordCategories.AI },
  pytorch: { name: 'PyTorch', category: keywordCategories.AI },
  keras: { name: 'Keras', category: keywordCategories.AI },
  'scikit-learn': { name: 'scikit-learn', category: keywordCategories.AI },
  scikit_learn: { name: 'scikit-learn', category: keywordCategories.AI },
  pandas: { name: 'Pandas', category: keywordCategories.AI },
  openai: { name: 'OpenAI', category: keywordCategories.AI },
  nltk: { name: 'NLTK', category: keywordCategories.AI },
  spaCy: { name: 'spaCy', category: keywordCategories.AI },
  fastai: { name: 'fastai', category: keywordCategories.AI },
  'stable-diffusion': { name: 'Stable Diffusion', category: keywordCategories.AI },
  transformers: { name: 'Transformers', category: keywordCategories.AI },
  gensim: { name: 'Gensim', category: keywordCategories.AI },
  prophet: { name: 'Prophet', category: keywordCategories.AI },
  opencv: { name: 'OpenCV', category: keywordCategories.AI },
  dlib: { name: 'dlib', category: keywordCategories.AI },
  pybrain: { name: 'PyBrain', category: keywordCategories.AI },
  deap: { name: 'DEAP', category: keywordCategories.AI },
  mlops: { name: 'MLOps', category: keywordCategories.AI },
  llama: { name: 'Llama', category: keywordCategories.AI },
  langchain: { name: 'Langchain', category: keywordCategories.AI },
  LLMS: { name: 'LLM', category: keywordCategories.AI },
  llm: { name: 'LLM', category: keywordCategories.AI },
  databricks: { name: 'Databricks', category: keywordCategories.AI },
  mlflow: { name: 'MLflow', category: keywordCategories.AI },
  lakehouse: { name: 'Lakehouse', category: keywordCategories.AI },
  ml: { name: 'Machine Learning', category: keywordCategories.AI },
  //END OF AI

  //UI/UX
  figma: { name: 'Figma', category: keywordCategories.UIUX },
  prototipacao: { name: 'Prototipação', category: keywordCategories.UIUX },
  photoshop: { name: 'Adobe Photoshop', category: keywordCategories.UIUX },
  illustrator: { name: 'Adobe Illustrator', category: keywordCategories.UIUX },
  coreldraw: { name: 'CorelDRAW', category: keywordCategories.UIUX },
  sketch: { name: 'Sketch', category: keywordCategories.UIUX },
  miro: { name: 'Miro', category: keywordCategories.UIUX },
  maze: { name: 'Maze', category: keywordCategories.UIUX },
  hotjar: { name: 'Hotjar', category: keywordCategories.UIUX },
  asana: { name: 'Asana', category: keywordCategories.UIUX },
  mural: { name: 'Mural', category: keywordCategories.UIUX },
  //END OF UI/UX
};

export const multiWordKeywords: Keywords = {
  //FRONTEND
  'micro frontends': { name: 'Micro Frontend', category: keywordCategories.frontend },
  'micro frontend': { name: 'Micro Frontend', category: keywordCategories.frontend },
  'micro front end': { name: 'Micro Frontend', category: keywordCategories.frontend },
  'micro front ends': { name: 'Micro Frontend', category: keywordCategories.frontend },
  'responsive design': { name: 'Responsive Design', category: keywordCategories.frontend },
  'styled components': { name: 'Styled Components', category: keywordCategories.frontend },
  'context api': { name: 'Context API', category: keywordCategories.frontend },
  'server side rendering': { name: 'Server-Side Rendering', category: keywordCategories.frontend },
  'visual basic': { name: 'Visual Basic', category: keywordCategories.frontend },
  'material design': { name: 'Material Design', category: keywordCategories.frontend },
  'react.js': { name: 'React', category: keywordCategories.frontend },
  'vue.js': { name: 'Vue.js', category: keywordCategories.frontend },
  'next.js': { name: 'NextJS', category: keywordCategories.frontend },
  'leaflet.js': { name: 'Leaflet', category: keywordCategories.frontend },
  'nuxt.js': { name: 'Nuxt', category: keywordCategories.frontend },
  'css-in-js': { name: 'CSS-in-JS', category: keywordCategories.frontend },
  //END OF FRONTEND

  //BACKEND
  'spring boot': { name: 'Spring Boot', category: keywordCategories.backend },
  'ruby on rails': { name: 'Ruby on Rails', category: keywordCategories.backend },
  'authentication and authorization': {
    name: 'Authentication and Authorization',
    category: keywordCategories.backend,
  },
  'security best practices': {
    name: 'Security Best Practices',
    category: keywordCategories.backend,
  },
  'representational state transfer': { name: 'REST', category: keywordCategories.backend },
  'node.js': { name: 'Node.js', category: keywordCategories.backend },
  'express.js': { name: 'Express', category: keywordCategories.backend },
  'asp.net': { name: '.NET', category: keywordCategories.backend },
  '.net': { name: '.NET', category: keywordCategories.backend },
  '.net core': { name: '.NET', category: keywordCategories.backend },
  'socket.io': { name: 'Socket.io', category: keywordCategories.backend },
  'nest.js': { name: 'NestJS', category: keywordCategories.backend },
  //END OF BACKEND

  //UI/UX
  'ui/ux design': { name: 'UI/UX Design', category: keywordCategories.UIUX },
  'design system': { name: 'Design System', category: keywordCategories.UIUX },
  'testes de usabilidade': { name: 'Testes de Usabilidade', category: keywordCategories.UIUX },
  'corel draw': { name: 'CorelDRAW', category: keywordCategories.UIUX },
  'design thinking': { name: 'Design Thinking', category: keywordCategories.UIUX },
  'user experience': { name: 'UX', category: keywordCategories.UIUX },
  'adobe xd': { name: 'Adobe XD', category: keywordCategories.UIUX },
  'product discovery': { name: 'Product Discovery', category: keywordCategories.UIUX },
  //END OF UI/UX

  //TESTING
  'frontend testing': { name: 'Testes', category: keywordCategories.testing },
  'robot framework': { name: 'Robot Framework', category: keywordCategories.testing },
  'react testing library': { name: 'React Testing Library', category: keywordCategories.testing },
  'testes unitarios': { name: 'Testes Unitários', category: keywordCategories.testing },
  'testes de unidade': { name: 'Testes Unitários', category: keywordCategories.testing },
  'testes integrados': { name: 'Testes de Integração', category: keywordCategories.testing },
  'testes de integracao': { name: 'Testes de Integração', category: keywordCategories.testing },
  'testes de regressao': { name: 'Testes de Regressão', category: keywordCategories.testing },
  'testes funcionais': { name: 'Testes Funcionais', category: keywordCategories.testing },
  'testes de caixa-preta': { name: 'Testes Funcionais', category: keywordCategories.testing },
  'testes automatizados': { name: 'Testes Automatizados', category: keywordCategories.testing },
  'testes de fumaca': { name: 'Testes de Fumaça', category: keywordCategories.testing },

  'teste unitarios': { name: 'Testes Unitários', category: keywordCategories.testing },
  'teste de unidade': { name: 'Testes Unitários', category: keywordCategories.testing },
  'teste integrados': { name: 'Testes de Integração', category: keywordCategories.testing },
  'teste de integracao': { name: 'Testes de Integração', category: keywordCategories.testing },
  'teste de regressao': { name: 'Testes de Regressão', category: keywordCategories.testing },
  'teste funcionais': { name: 'Testes Funcionais', category: keywordCategories.testing },
  'teste de caixa-preta': { name: 'Testes Funcionais', category: keywordCategories.testing },
  'teste automatizados': { name: 'Testes Automatizados', category: keywordCategories.testing },
  'teste de fumaca': { name: 'Testes de Fumaça', category: keywordCategories.testing },
  //END OF TESTING

  //DATABASE
  'database management': { name: 'Database Management', category: keywordCategories.database },
  'stored procedures': { name: 'Stored Procedures', category: keywordCategories.database },
  'sql server': { name: 'SQL Server', category: keywordCategories.database },
  'banco de dados relacionais': {
    name: 'Banco de dados relacional',
    category: keywordCategories.database,
  },
  'banco de dados não relacionais': {
    name: 'Banco de dados não relacional',
    category: keywordCategories.database,
  },
  'pl/sql': { name: 'PL/SQL', category: keywordCategories.database },
  'sq-lite': { name: 'SQLite', category: keywordCategories.database },
  //END OF DATABASE

  //MOBILE
  'apache cordova': { name: 'Cordova', category: keywordCategories.mobile },
  'react native': { name: 'React Native', category: keywordCategories.mobile },
  //END OF MOBILE

  //CLOUD
  'micro servicos': { name: 'Microsserviços', category: keywordCategories.cloud },
  'Google Cloud Platform': { name: 'GCP', category: keywordCategories.cloud },
  'web servers': { name: 'Web Servers', category: keywordCategories.cloud },
  'ci/cd': { name: 'CI/CD', category: keywordCategories.cloud },
  'integracao constante': { name: 'CI/CD', category: keywordCategories.cloud },
  'integracao continua': { name: 'CI/CD', category: keywordCategories.cloud },
  'continuous integration': { name: 'CI/CD', category: keywordCategories.cloud },
  'continuous delivery': { name: 'CI/CD', category: keywordCategories.cloud },
  'entrega continua': { name: 'CI/CD', category: keywordCategories.cloud },
  'new relic': { name: 'New Relic', category: keywordCategories.cloud },
  'cloud functions': { name: 'GCP Cloud Functions', category: keywordCategories.cloud },
  'github actions': { name: 'GitHub Actions', category: keywordCategories.cloud },
  'github action': { name: 'GitHub Actions', category: keywordCategories.cloud },
  'server-less': { name: 'Serverless', category: keywordCategories.cloud },
  'server less': { name: 'Serverless', category: keywordCategories.cloud },
  'serverless framework': { name: 'Serverless Framework', category: keywordCategories.cloud },
  //END OF CLOUD

  //MISCELLANEOUS
  'clean code': { name: 'Clean Code', category: keywordCategories.miscellaneous },
  'clean architecture': { name: 'Clean Architecture', category: keywordCategories.miscellaneous },
  'design patterns': { name: 'Design Patterns', category: keywordCategories.miscellaneous },
  'programacao orientada a eventos': {
    name: 'Programação Orientada a Eventos',
    category: keywordCategories.miscellaneous,
  },
  'programacao orientada a objetos': { name: 'POO', category: keywordCategories.miscellaneous },
  'orientacao a objetos': { name: 'POO', category: keywordCategories.miscellaneous },
  'metodologias ageis': { name: 'Agile', category: keywordCategories.miscellaneous },
  'metodologia agil': { name: 'Agile', category: keywordCategories.miscellaneous },
  'celulas ageis': { name: 'Agile', category: keywordCategories.miscellaneous },
  'desenvolvimento agil': { name: 'Agile', category: keywordCategories.miscellaneous },
  'git flow': { name: 'GitFlow', category: keywordCategories.miscellaneous },
  'injecao de dependencia': {
    name: 'Dependency Injection',
    category: keywordCategories.miscellaneous,
  },
  'dependency injection': {
    name: 'Dependency Injection',
    category: keywordCategories.miscellaneous,
  },
  'domain driven design': { name: 'DDD', category: keywordCategories.miscellaneous },
  'domain-driven design': { name: 'DDD', category: keywordCategories.miscellaneous },
  'test driven development': { name: 'TDD', category: keywordCategories.miscellaneous },
  'test-driven development': { name: 'TDD', category: keywordCategories.miscellaneous },
  'behavior-driven development': { name: 'TDD', category: keywordCategories.miscellaneous },
  'behavior driven development': { name: 'TDD', category: keywordCategories.miscellaneous },
  'application programming interface': { name: 'API', category: keywordCategories.miscellaneous },
  'system design': { name: 'System Design', category: keywordCategories.miscellaneous },
  'systems design': { name: 'System Design', category: keywordCategories.miscellaneous },
  'arquitetura hexagonal': {
    name: 'Arquitetura Hexagonal',
    category: keywordCategories.miscellaneous,
  },
  'json web token': { name: 'JWT', category: keywordCategories.miscellaneous },
  'json web tokens': { name: 'JWT', category: keywordCategories.miscellaneous },
  'pub/sub': { name: 'Pub/Sub', category: keywordCategories.miscellaneous },
  'extreme programming': { name: 'Extreme Programming', category: keywordCategories.miscellaneous },
  's.o.l.i.d': { name: 'SOLID', category: keywordCategories.miscellaneous },
  'meteor.js': { name: 'Meteor.js', category: keywordCategories.miscellaneous },
  solidity: { name: 'Solidity', category: keywordCategories.miscellaneous },
  //END OF MISCELLANEOUS

  //AI
  'machine learning': { name: 'Machine Learning', category: keywordCategories.AI },
  'aprendizado de maquina': { name: 'Machine Learning', category: keywordCategories.AI },
  'algoritmo de aprendizagem': { name: 'Machine Learning', category: keywordCategories.AI },
  'deep learning': { name: 'Deep Learning', category: keywordCategories.AI },
  'inteligencia artificial': { name: 'Inteligência Artificial', category: keywordCategories.AI },
  'artificial intelligence ': { name: 'Inteligência Artificial', category: keywordCategories.AI },
  'regressao logistica': { name: 'Regressão Logística', category: keywordCategories.AI },
  'modelos lineares': { name: 'Modelos Lineares', category: keywordCategories.AI },
  'rede neural': { name: 'Rede Neural', category: keywordCategories.AI },
  'neural network': { name: 'Rede Neural', category: keywordCategories.AI },
  'neural networks': { name: 'Rede Neural', category: keywordCategories.AI },
  'processamento de linguagem natural': { name: 'NLP', category: keywordCategories.AI },
  'natural language processing': { name: 'NLP', category: keywordCategories.AI },
  'visao computacional': { name: 'Visão Computacional', category: keywordCategories.AI },
  'computer vision': { name: 'Visão Computacional', category: keywordCategories.AI },
  'reconhecimento de padroes': {
    name: 'Reconhecimento de Padrões',
    category: keywordCategories.AI,
  },
  //END OF AI

  //DATA
  'big data': { name: 'Big Data', category: keywordCategories.dataScience },
  'google sheets': { name: 'Google Sheets', category: keywordCategories.dataScience },
  'Power BI': { name: 'Power BI', category: keywordCategories.dataScience },
  'series temporais': { name: 'Séries Temporais', category: keywordCategories.dataScience },
  'data bricks': { name: 'Databricks', category: keywordCategories.dataScience },
  'data factory': { name: 'Azure Data Factory', category: keywordCategories.dataScience },
  //END OF DATA
};
