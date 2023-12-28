import { Injectable } from '@angular/core';
import { DynamoService } from '../dynamo/dynamo.service';
import { Job } from './job.model';
import { BehaviorSubject, Observable, filter, first, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private _jobs$ = new BehaviorSubject<Job[] | undefined>(undefined);
  jobs$ = this._jobs$.asObservable();

  constructor(private dynamoService: DynamoService) {
    this.dynamoService
      .scanJobs()
      .pipe(
        first(),
        map((output) => output.Items as Job[])
      )
      .subscribe((jobs) => this._jobs$.next(jobs));
  }

  getJobsByState(state: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.state == state);
      })
    );
  }

  getJobsByWorkplace(workplace: string): Observable<Job[]> {
    return this.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        return jobs.filter((job) => job.workplaceType == workplace);
      })
    );
  }
}
