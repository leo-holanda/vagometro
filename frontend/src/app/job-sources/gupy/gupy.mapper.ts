import { Job } from 'src/app/job/job.types';
import { CertificationStatus } from 'src/app/shared/keywords-matcher/certification.data';
import { ContractData } from 'src/app/shared/keywords-matcher/contract-types.data';
import { EducationalData } from 'src/app/shared/keywords-matcher/education.data';
import {
  ExperienceLevels,
  internLevelRelatedTypes,
  traineeLevelRelatedTypes,
  juniorLevelRelatedTypes,
  ExperienceData,
} from 'src/app/shared/keywords-matcher/experience-levels.data';
import { InclusionData, InclusionTypes } from 'src/app/shared/keywords-matcher/inclusion.data';
import {
  matchCertificationStatus,
  matchInclusionTypes,
  matchLanguages,
  matchExperienceLevel,
  matchTechnologies,
  matchEducationalTerms,
} from 'src/app/shared/keywords-matcher/keywords-matcher';
import { WorkplaceData, WorkplaceTypes } from 'src/app/shared/keywords-matcher/workplace.data';
import { GupyJob, gupyContractTypeMap } from './gupy.types';
import { TechnologyData } from 'src/app/shared/keywords-matcher/technologies.data';
import { SearchData } from 'src/app/job/easy-search/easy-search.types';
import { getJobMatchPercentage } from 'src/app/job/easy-search/easy-search.mapper';

export function mapGupyJobsToJobs(jobs: GupyJob[], searchData: SearchData | undefined): Job[] {
  const jobsByCompanyMap = new Map<string, Job[]>();

  return jobs
    .map((jobs) => mapToJob(jobs, searchData, jobsByCompanyMap))
    .map((jobs) => setRepostings(jobs, jobsByCompanyMap))
    .sort((a, b) => (a.publishedDate > b.publishedDate ? -1 : 1));
}

export function setRepostings(job: Job, jobsByCompanyMap: Map<string, Job[]>): Job {
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

export function mapToJob(
  job: GupyJob,
  searchData: SearchData | undefined,
  jobsByCompanyMap: Map<string, Job[]>,
): Job {
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
    keywords: getJobTechnologies(job),
    languages: findJobLanguages(job),
    workplaceTypes: getJobWorkplaceType(job),
    certificationStatuses: findCertificationStatuses(job),
    repostings: [],
    timeInDaysBetweenRepostings: 0,
    interactionStatus: { applied: false, discarded: false, viewed: false, accessed: false },
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

function findCertificationStatuses(job: GupyJob): CertificationStatus[] {
  return matchCertificationStatus({ description: job.description });
}

function findJobContractType(job: GupyJob): ContractData[] {
  const contractData: ContractData = {
    type: gupyContractTypeMap[job.type],
    matchesSearchParameters: false,
  };

  return [contractData];
}

function findJobInclusionTypes(job: GupyJob): InclusionData[] {
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

  return matchedInclusionTypes.map((inclusionType) => {
    return {
      type: inclusionType,
      matchesSearchParameters: false,
    };
  });
}

function getJobWorkplaceType(gupyJob: GupyJob): WorkplaceData[] {
  const workplaceData: WorkplaceData = {
    type: WorkplaceTypes.unknown,
    matchesSearchParameters: false,
  };

  if (gupyJob.workplaceType == 'remote') workplaceData.type = WorkplaceTypes.remote;
  if (gupyJob.workplaceType == 'on-site') workplaceData.type = WorkplaceTypes['on-site'];
  if (gupyJob.workplaceType == 'hybrid') workplaceData.type = WorkplaceTypes.hybrid;

  return [workplaceData];
}

function findJobLanguages(job: GupyJob): string[] {
  return matchLanguages({ description: job.description });
}

function findExperienceLevel(job: GupyJob): ExperienceData[] {
  const experienceData: ExperienceData = {
    name: ExperienceLevels.unknown,
    matchesSearchParameters: false,
  };

  if (internLevelRelatedTypes.includes(job.type)) {
    experienceData.name = ExperienceLevels.intern;
    return [experienceData];
  }

  if (traineeLevelRelatedTypes.includes(job.type)) {
    experienceData.name = ExperienceLevels.trainee;
    return [experienceData];
  }

  if (juniorLevelRelatedTypes.includes(job.type)) {
    experienceData.name = ExperienceLevels.junior;
    return [experienceData];
  }

  const matchedExperienceLevels = matchExperienceLevel({
    title: job.name,
    description: job.description,
  });

  return matchedExperienceLevels.map((experienceLevel) => {
    return {
      name: experienceLevel,
      matchesSearchParameters: false,
    };
  });
}

function getJobTechnologies(job: GupyJob): TechnologyData[] {
  const matchedTechnologies = matchTechnologies({ title: job.name, description: job.description });

  return matchedTechnologies.map((technology) => {
    return {
      name: technology.name,
      category: technology.category,
      matchesSearchParameters: false,
    };
  });
}

function findEducationalData(job: GupyJob): EducationalData {
  return matchEducationalTerms(job.description);
}
