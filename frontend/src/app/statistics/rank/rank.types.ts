import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.types';

export type RankData = {
  name: string;
  count: number;
  percentage: number;
  link?: string;
  state?: string;
};

export type RankMetaData = {
  name: string;
  icon: string;
  dataColumnName: string;
  routerLink: string;
  getRank: (jobs?: Observable<Job[]>) => Observable<RankData[]>;
};

export enum RankTypes {
  months = 'months',
  education = 'education',
  companies = 'companies',
  experience = 'experience',
  workplace = 'workplace',
  technology = 'technology',
  contractTypes = 'contractTypes',
  inclusion = 'inclusion',
  cities = 'cities',
  languages = 'languages',
  certification = 'certification',
  repostings = 'repostings',
}

export type RanksMap = {
  [key in RankTypes]: RankMetaData;
};
