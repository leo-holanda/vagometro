import { ContractTypes } from 'src/app/job/job.types';
import { ExperienceLevels } from 'src/app/statistics/ranks/experience-levels-rank/experience-levels-rank.model';

export type LinkedInJob = {
  _id: number;
  id: number;
  title: string;
  company_name: string;
  company_url: string;
  location: string;
  created_at: string;
  url: string;
  description: string;
  seniority_level: string | undefined;
  employment_type: string | undefined;
};

export type LinkedInSeniorityLevelMap = {
  [key: string]: ExperienceLevels;
};

export type LinkedInEmploymentTypeMap = {
  [key: string]: ContractTypes;
};

//https://www.teachndo.com/post/ways-to-make-linkedin-help-you-find-a-right-job#:~:text=LinkedIn%20has%20a%20range%20of,Company%20Industry%20are%20crucial%20factors.
export const linkedInSeniorityLevelsMap: LinkedInSeniorityLevelMap = {
  Internship: ExperienceLevels.intern,
  'Entry level': ExperienceLevels.junior,
  Associate: ExperienceLevels.junior,
  'Mid-Senior level': ExperienceLevels.mid,
  Director: ExperienceLevels.specialist,
  Executive: ExperienceLevels.specialist,
  'Not Applicable': ExperienceLevels.unknown,
};

// https://www.linkedin.com/help/linkedin/answer/a554472?lang=en-US
export const linkedInEmploymentTypesMap: LinkedInEmploymentTypeMap = {
  Contract: ContractTypes.CLT,
  'Self-employed': ContractTypes.PJ,
  'Part-time': ContractTypes.CLT,
  'Full-time': ContractTypes.CLT,
  Internship: ContractTypes.intern,
  Apprenticeship: ContractTypes.apprentice,
  Freelance: ContractTypes.freelance,
  'On-Call': ContractTypes.PJ,
  Intermitente: ContractTypes.PJ,
  Trainee: ContractTypes.trainee,
  Terceirizado: ContractTypes.outsource,
};
