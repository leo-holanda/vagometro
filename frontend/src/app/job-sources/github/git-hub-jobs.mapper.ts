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
  matchExperienceLevel,
  matchKeywords,
  matchEducationalTerms,
  matchLanguages,
  matchContractTypes,
} from 'src/app/shared/keywords-matcher/keywords-matcher';
import { WorkplaceTypes } from 'src/app/shared/keywords-matcher/workplace.data';
import { GitHubJob } from './git-hub-jobs.types';
import { KeywordData } from 'src/app/shared/keywords-matcher/technologies.data';
import { SearchData } from 'src/app/job/easy-search/easy-search.types';
import { getJobMatchPercentage } from 'src/app/job/easy-search/easy-search.mapper';

export function mapGitHubJobsToJobs(jobs: GitHubJob[], searchData: SearchData | undefined): Job[] {
  const jobsByCompanyMap = new Map<string, Job[]>();

  return jobs
    .map((jobs) => mapToJob(jobs, searchData, jobsByCompanyMap))
    .map((jobs) => setRepostings(jobs, jobsByCompanyMap))
    .sort((a, b) => (a.publishedDate > b.publishedDate ? -1 : 1));
}

function setRepostings(job: Job, jobsByCompanyMap: Map<string, Job[]>): Job {
  const jobsByCompany = jobsByCompanyMap.get(job.companyName) || [];

  const repostings = jobsByCompany.filter((jobFromCompany) => {
    const hasSameTitle = jobFromCompany.title == job.title;
    const hasSameDescription = jobFromCompany.description == job.description;
    const hasDifferentIDs = jobFromCompany.id != job.id;
    return hasSameTitle && hasSameDescription && hasDifferentIDs;
  });

  job.repostings = repostings;
  job.timeInDaysBetweenRepostings = getTimeInDaysBetweenRepostings(job);
  return job;
}

// This function can't go to the git-hub worker file. It will not transpile
export function mapToJob(
  job: GitHubJob,
  searchData: SearchData | undefined,
  jobsByCompanyMap: Map<string, Job[]>,
): Job {
  const { coursesNames, educationalLevels } = findEducationalData(job);

  const mappedJob: Job = {
    city: 'Desconhecido',
    companyUrl: '',
    country: 'Brasil',
    description: job.body,
    educationalLevelTerms: educationalLevels,
    educationTerms: coursesNames,
    id: job.id,
    jobUrl: job.html_url,
    publishedDate: new Date(job.created_at),
    state: 'Desconhecido',
    title: job.title,
    companyName: findCompanyName(job),
    contractTypes: findContractTypesCitedInJob(job),
    experienceLevels: findJobExperienceLevel(job),
    inclusionTypes: findInclusionTypes(job),
    keywords: findJobKeywords(job),
    languages: findJobLanguages(job),
    workplaceTypes: findJobWorkplaceTypes(job),
    certificationStatuses: findCertificationStatuses(job),
    repostings: [],
    timeInDaysBetweenRepostings: 0,
  };

  const jobsByCompany = jobsByCompanyMap.get(mappedJob.companyName) || [];
  jobsByCompany.push(mappedJob);
  jobsByCompanyMap.set(mappedJob.companyName, jobsByCompany);

  mappedJob.matchPercentage = getJobMatchPercentage(mappedJob, searchData);
  return mappedJob;
}

function getTimeInDaysBetweenRepostings(job: Job): number {
  const jobsToConsider = [job, ...job.repostings];
  const { earliestDate, latestDate } = findRepostingsStartAndEndDate(jobsToConsider);
  const differenceInDays = (
    (latestDate.getTime() - earliestDate.getTime()) /
    (1000 * 3600 * 24)
  ).toFixed(0);

  return +differenceInDays;
}

function findRepostingsStartAndEndDate(jobs: Job[]): { earliestDate: Date; latestDate: Date } {
  let earliestDate = new Date();
  let latestDate = jobs[jobs.length - 1].publishedDate;

  jobs.forEach((job) => {
    if (job.publishedDate < earliestDate) earliestDate = job.publishedDate;
    if (job.publishedDate > latestDate) latestDate = job.publishedDate;
  });

  return { earliestDate, latestDate };
}

function findCertificationStatuses(job: GitHubJob): CertificationStatus[] {
  return matchCertificationStatus({ description: job.body });
}

function findCompanyName(job: GitHubJob): string {
  if (job.title.includes('@')) {
    const splittedTitle = job.title.split('@');
    return splittedTitle[splittedTitle.length - 1].trim();
  }

  if (job.title.includes('|')) {
    const splittedTitle = job.title.split('|');
    return splittedTitle[splittedTitle.length - 1].trim();
  }

  if (job.title.toLowerCase().includes('na ')) {
    const splittedTitle = job.title.toLowerCase().split('na ');
    return splittedTitle[splittedTitle.length - 1].trim();
  }

  if (job.title.toLowerCase().includes('no ')) {
    const splittedTitle = job.title.toLowerCase().split('no ');
    return splittedTitle[splittedTitle.length - 1].trim();
  }

  if (job.title.toLowerCase().includes('at ')) {
    const splittedTitle = job.title.toLowerCase().split('at ');
    return splittedTitle[splittedTitle.length - 1].trim();
  }

  if (job.title.toLowerCase().includes('in ')) {
    const splittedTitle = job.title.toLowerCase().split('at ');
    return splittedTitle[splittedTitle.length - 1].trim();
  }

  if (job.title.includes('-')) {
    const splittedTitle = job.title.split('-');
    return splittedTitle[splittedTitle.length - 1].trim();
  }

  return 'Desconhecido';
}

function findInclusionTypes(job: GitHubJob): InclusionTypes[] {
  return matchInclusionTypes({ title: job.title, description: job.body, labels: job.labels });
}

function findJobWorkplaceTypes(job: GitHubJob): WorkplaceTypes[] {
  return matchWorkplaceTypes({ title: job.title, description: job.body, labels: job.labels });
}

function findJobExperienceLevel(job: GitHubJob): ExperienceLevels[] {
  return matchExperienceLevel({ title: job.title, description: job.body, labels: job.labels });
}

function findJobKeywords(job: GitHubJob): KeywordData[] {
  return matchKeywords({ title: job.title, description: job.body, labels: job.labels });
}

function findEducationalData(job: GitHubJob): EducationalData {
  return matchEducationalTerms(job.body);
}

function findJobLanguages(job: GitHubJob): string[] {
  return matchLanguages({ description: job.body });
}

function findContractTypesCitedInJob(job: GitHubJob): ContractTypes[] {
  return matchContractTypes({ title: job.title, description: job.body, labels: job.labels });
}
