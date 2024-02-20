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

// This function can't go to the git-hub worker file. It will not transpile
export function mapGitHubJobToJob(job: GitHubJob): Job {
  const { coursesNames, educationalLevels } = findEducationalData(job);

  return {
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
  };
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
