import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.types';

export type RankMetaData = {
  name: string;
  icon: string;
  dataColumnName: string;
  routerLink: string;
  getRank: (jobs?: Observable<Job[]>) => any;
};

export type RankOptions = {
  [key: string]: RankMetaData;
};
