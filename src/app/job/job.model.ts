import { ExperienceLevels } from '../statistics/ranks/experience-levels-rank/experience-levels-rank.model';

export type Job = {
  careerPageUrl: string;
  jobUrl: string;
  isRemoteWork: boolean;
  companyId: number;
  partition_key: number;
  workplaceType: string;
  sort_key: string;
  country: string;
  name: string;
  state: string;
  city: string;
  disabilities: boolean;
  careerPageId: number;
  applicationDeadline: string;
  badges: Badges;
  careerPageLogo: string;
  careerPageName: string;
  description: string;
  id: number;
  publishedDate: string;
  type: string;
  //Attributes below were added by me
  experienceLevel: ExperienceLevels;
  keywords: string[];
};

export type Badges = {
  friendlyBadge: boolean;
};

export enum TimeWindows {
  'day' = 'day',
  'week' = 'week',
  'month' = 'month',
  '6months' = '6months',
  'year' = 'year',
  'all' = 'all',
}
