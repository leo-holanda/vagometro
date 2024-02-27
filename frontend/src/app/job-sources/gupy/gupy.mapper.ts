import { Job } from 'src/app/job/job.types';
import { CertificationStatus } from 'src/app/shared/keywords-matcher/certification.data';
import { ContractTypes } from 'src/app/shared/keywords-matcher/contract-types.data';
import { EducationalData } from 'src/app/shared/keywords-matcher/education.data';
import {
  ExperienceLevels,
  internLevelRelatedTypes,
  traineeLevelRelatedTypes,
  juniorLevelRelatedTypes,
} from 'src/app/shared/keywords-matcher/experience-levels.data';
import { InclusionTypes } from 'src/app/shared/keywords-matcher/inclusion.data';
import {
  matchCertificationStatus,
  matchInclusionTypes,
  matchLanguages,
  matchExperienceLevel,
  matchKeywords,
  matchEducationalTerms,
} from 'src/app/shared/keywords-matcher/keywords-matcher';
import { WorkplaceTypes } from 'src/app/shared/keywords-matcher/workplace.data';
import { GupyJob, gupyContractTypeMap } from './gupy.types';
import { KeywordData } from 'src/app/shared/keywords-matcher/technologies.data';
import { SearchData } from 'src/app/job/easy-search/easy-search.types';
import { getJobMatchPercentage } from 'src/app/job/easy-search/easy-search.mapper';

export function mapGupyJobsToJobs(jobs: GupyJob[], searchData: SearchData | undefined): Job[] {
  return jobs
    .map((jobs) => mapToJob(jobs, searchData))
    .sort((a, b) => (a.publishedDate > b.publishedDate ? -1 : 1));
}

function mapToJob(job: GupyJob, searchData: SearchData | undefined): Job {
  const { coursesNames, educationalLevels } = findEducationalData(job);

  const mappedJob: Job = {
    companyName: job.careerPageName,
    companyUrl: job.careerPageUrl,
    description: job.description,
    educationalLevelTerms: educationalLevels,
    educationTerms: coursesNames,
    id: job.id,
    jobUrl: job.jobUrl,
    publishedDate: new Date(job.publishedDate),
    title: job.name,
    country: job.country || 'Desconhecido',
    state: job.state || 'Desconhecido',
    city: job.city || 'Desconhecido',
    contractTypes: findJobContractType(job),
    experienceLevels: findExperienceLevel(job),
    inclusionTypes: findJobInclusionTypes(job),
    keywords: getJobKeywords(job),
    languages: findJobLanguages(job),
    workplaceTypes: getJobWorkplaceType(job),
    certificationStatuses: findCertificationStatuses(job),
  };

  mappedJob.matchPercentage = getJobMatchPercentage(mappedJob, searchData);
  return mappedJob;
}

function findCertificationStatuses(job: GupyJob): CertificationStatus[] {
  return matchCertificationStatus({ description: job.description });
}

function findJobContractType(job: GupyJob): ContractTypes[] {
  return [gupyContractTypeMap[job.type]];
}

function findJobInclusionTypes(job: GupyJob): InclusionTypes[] {
  let matchedInclusionTypes = matchInclusionTypes({
    title: job.name,
    description: job.description,
  });

  if (job.disabilities) {
    if (matchedInclusionTypes.includes(InclusionTypes.unknown)) {
      matchedInclusionTypes = [InclusionTypes.alsoForPCD];
    } else {
      matchedInclusionTypes.push(InclusionTypes.alsoForPCD);
    }
  }

  return matchedInclusionTypes;
}

function getJobWorkplaceType(gupyJob: GupyJob): WorkplaceTypes[] {
  if (gupyJob.workplaceType == 'remote') return [WorkplaceTypes.remote];
  if (gupyJob.workplaceType == 'on-site') return [WorkplaceTypes['on-site']];
  if (gupyJob.workplaceType == 'hybrid') return [WorkplaceTypes.hybrid];

  return [WorkplaceTypes.unknown];
}

function findJobLanguages(job: GupyJob): string[] {
  return matchLanguages({ description: job.description });
}

function findExperienceLevel(job: GupyJob): ExperienceLevels[] {
  if (internLevelRelatedTypes.includes(job.type)) return [ExperienceLevels.intern];
  if (traineeLevelRelatedTypes.includes(job.type)) return [ExperienceLevels.trainee];
  if (juniorLevelRelatedTypes.includes(job.type)) return [ExperienceLevels.junior];

  return matchExperienceLevel({ title: job.name, description: job.description });
}

function getJobKeywords(job: GupyJob): KeywordData[] {
  return matchKeywords({ title: job.name, description: job.description });
}

function findEducationalData(job: GupyJob): EducationalData {
  return matchEducationalTerms(job.description);
}
