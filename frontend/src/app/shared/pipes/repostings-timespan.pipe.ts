import { Pipe, PipeTransform } from '@angular/core';
import { Job } from 'src/app/job/job.types';

@Pipe({
  name: 'repostingsTimespan',
  standalone: true,
})
export class RepostingsTimespanPipe implements PipeTransform {
  transform(job: Job): number {
    const jobsToConsider = [job, ...job.repostings];
    const startDate = this.findEarliestDate(jobsToConsider);
    const endDate = this.findLatestDate(jobsToConsider);
    const differenceInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    return differenceInDays;
  }

  private findEarliestDate(jobs: Job[]): Date {
    return jobs.reduce((acc, job) => {
      if (job.publishedDate < acc) return job.publishedDate;
      return acc;
    }, new Date());
  }

  private findLatestDate(jobs: Job[]): Date {
    const latestDate = jobs[0].publishedDate;
    return jobs.reduce((acc, job) => {
      if (job.publishedDate > acc) return job.publishedDate;
      return acc;
    }, latestDate);
  }
}
