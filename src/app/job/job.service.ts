import { Injectable } from '@angular/core';
import { DynamoService } from '../dynamo/dynamo.service';
import { Job } from './job.model';
import { BehaviorSubject, Observable, first, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private _jobs$ = new BehaviorSubject<Job[]>([]);
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
}
