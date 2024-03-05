import { Job } from 'src/app/job/job.types';
import { CertificationStatus } from 'src/app/shared/keywords-matcher/certification.data';
import { ContractTypes } from 'src/app/shared/keywords-matcher/contract-types.data';
import { EducationalData } from 'src/app/shared/keywords-matcher/education.data';
import { ExperienceLevels } from 'src/app/shared/keywords-matcher/experience-levels.data';
import { InclusionTypes } from 'src/app/shared/keywords-matcher/inclusion.data';
import {
  matchCertificationStatus,
  matchInclusionTypes,
  matchWorkplaceTypes,
  matchContractTypes,
  matchExperienceLevel,
  matchKeywords,
  matchEducationalTerms,
  matchLanguages,
  removeAccents,
} from 'src/app/shared/keywords-matcher/keywords-matcher';
import { WorkplaceTypes } from 'src/app/shared/keywords-matcher/workplace.data';
import { LinkedInJob, linkedInEmploymentTypesMap } from './linked-in.types';
import { KeywordData } from 'src/app/shared/keywords-matcher/technologies.data';
import { SearchData } from 'src/app/job/easy-search/easy-search.types';
import { getJobMatchPercentage } from 'src/app/job/easy-search/easy-search.mapper';

const statesNames = [
  'acre',
  'alagoas',
  'amazonas',
  'amapa',
  'bahia',
  'ceara',
  'df',
  'espirito santo',
  'goias',
  'maranhao',
  'minas gerais',
  'mato grosso do sul',
  'mato grosso',
  'para',
  'paraiba',
  'pernambuco',
  'piaui',
  'parana',
  'rio de janeiro',
  'rio grande do norte',
  'rondonia',
  'roraima',
  'rio grande do sul',
  'santa catarina',
  'sergipe',
  'sao paulo',
  'tocantins',
];

export function mapLinkedInJobsToJobs(
  jobs: LinkedInJob[],
  searchData: SearchData | undefined,
): Job[] {
  const jobsByCompanyMap = new Map<string, Job[]>();

  return jobs
    .map((jobs) => mapToJob(jobs, searchData, jobsByCompanyMap))
    .map((jobs) => setDuplicates(jobs, jobsByCompanyMap))
    .sort((a, b) => (a.publishedDate > b.publishedDate ? -1 : 1));
}

function setDuplicates(job: Job, jobsByCompanyMap: Map<string, Job[]>): Job {
  const jobsByCompany = jobsByCompanyMap.get(job.companyName) || [];

  const duplicatedJobs = jobsByCompany.filter((jobFromCompany) => {
    const hasSameTitle = jobFromCompany.title == job.title;
    const hasSameDescription = jobFromCompany.description == job.description;
    const hasDifferentIDs = jobFromCompany.id != job.id;
    return hasSameTitle && hasSameDescription && hasDifferentIDs;
  });

  job.duplicates = duplicatedJobs;
  return job;
}

function mapToJob(
  job: LinkedInJob,
  searchData: SearchData | undefined,
  jobsByCompanyMap: Map<string, Job[]>,
): Job {
  // Why can't I just do replaceAll in the object below?
  const sanitizedJobDescription = job.description.replaceAll('\n', ' ');
  job.description = sanitizedJobDescription;

  const { coursesNames, educationalLevels } = findEducationalData(job);

  const mappedJob: Job = {
    companyName: job.company_name,
    companyUrl: job.company_url,
    country: 'Brasil',
    description: sanitizedJobDescription,
    educationalLevelTerms: educationalLevels,
    educationTerms: coursesNames,
    id: job.id,
    jobUrl: job.url,
    /*
      Prevents the date from getting one day subtracted
      https://www.tabnews.com.br/kht/lidando-com-datas-em-javascript-ou-criei-uma-data-mas-mostra-um-dia-a-menos
    */
    publishedDate: new Date(job.created_at + 'T00:00:00'),
    title: job.title,
    city: findJobCity(job),
    contractTypes: findJobContractTypes(job),
    experienceLevels: findExperienceLevels(job),
    inclusionTypes: findInclusionTypes(job),
    keywords: findJobKeywords(job),
    languages: findJobLanguages(job),
    state: findJobState(job),
    workplaceTypes: getJobWorkplaceType(job),
    certificationStatuses: findCertificationStatuses(job),
    duplicates: [],
  };

  const jobsByCompany = jobsByCompanyMap.get(mappedJob.companyName) || [];
  jobsByCompany.push(mappedJob);
  jobsByCompanyMap.set(mappedJob.companyName, jobsByCompany);

  mappedJob.matchPercentage = getJobMatchPercentage(mappedJob, searchData);
  return mappedJob;
}

function findCertificationStatuses(job: LinkedInJob): CertificationStatus[] {
  return matchCertificationStatus({ description: job.description });
}

function findInclusionTypes(job: LinkedInJob): InclusionTypes[] {
  return matchInclusionTypes({ title: job.title, description: job.description });
}

function getJobWorkplaceType(job: LinkedInJob): WorkplaceTypes[] {
  return matchWorkplaceTypes({ title: job.title, description: job.description });
}

function findJobState(job: LinkedInJob): string {
  /*
      Expected job.location
      - "Maceió, Alagoas, Brazil"
      - "Alagoas, Brazil"
      - "Maceió, Alagoas"
      - "Greater Alagoas Area"
      - "Brazil"
    */

  const splittedLocation = job.location.split(',');
  if (splittedLocation.length == 3) {
    return splittedLocation[1].trim();
  }

  if (splittedLocation.length == 2) {
    const possibleStateName = removeAccents(splittedLocation[0]).toLowerCase();
    const possibleStateName2 = removeAccents(splittedLocation[1]).toLowerCase();
    if (statesNames.includes(possibleStateName)) return splittedLocation[0];
    if (statesNames.includes(possibleStateName2)) return splittedLocation[1];
  }

  if (splittedLocation.length == 0) {
    const matchedLocation = statesNames.find((cityName) => cityName == job.location);
    if (matchedLocation) return matchedLocation;
  }

  return 'Desconhecido';
}

function findJobCity(job: LinkedInJob): string {
  const splittedLocation = job.location.split(',');
  if (splittedLocation.length == 3) {
    return splittedLocation[0].trim();
  }

  if (splittedLocation.length == 2) {
    const possibleCityName = removeAccents(splittedLocation[0]).toLowerCase();
    if (!statesNames.includes(possibleCityName)) return splittedLocation[0];
  }

  return 'Desconhecido';
}

function findJobContractTypes(job: LinkedInJob): ContractTypes[] {
  const matchedContractTypes = matchContractTypes({
    title: job.title,
    description: job.description,
  });

  if (matchedContractTypes.length == 0 && job.employment_type) {
    matchedContractTypes.push(
      linkedInEmploymentTypesMap[job.employment_type] || ContractTypes.unknown,
    );
    return matchedContractTypes;
  }

  return matchedContractTypes;
}

function findExperienceLevels(job: LinkedInJob): ExperienceLevels[] {
  return matchExperienceLevel({ title: job.title, description: job.description });
}

function findJobKeywords(job: LinkedInJob): KeywordData[] {
  return matchKeywords({ title: job.title, description: job.description });
}

function findEducationalData(job: LinkedInJob): EducationalData {
  return matchEducationalTerms(job.description);
}

function findJobLanguages(job: LinkedInJob): string[] {
  return matchLanguages({ description: job.description });
}
