import { Injectable } from '@angular/core';
import { JobService } from '../job/job.service';
import { Observable, first, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private jobService: JobService) { }

  getCitiesRank(): Observable<Map<string, number>> {
    return this.jobService.jobs$.pipe(map((jobs) => {
      const citiesMap = new Map<string, number>()

      jobs.forEach((job) => {
        const currentCityCount = citiesMap.get(job.city) || 0
        citiesMap.set(job.city, currentCityCount + 1)
      })

      return citiesMap
    }))
  }
}
