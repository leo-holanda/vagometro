import { Pipe, PipeTransform } from '@angular/core';
import { Job } from 'src/app/job/job.types';

@Pipe({
  name: 'repostingsTimespan',
  standalone: true,
})
export class RepostingsTimespanPipe implements PipeTransform {
  transform(value: Job[], ...args: unknown[]): unknown {
    const startDate = value[0].publishedDate;
    const endDate = value[value.length - 1].publishedDate;
    const differenceInDays = (
      (endDate.getTime() - startDate.getTime()) /
      (1000 * 3600 * 24)
    ).toFixed(0);
    return differenceInDays;
  }
}
