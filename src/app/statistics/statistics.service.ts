import { Injectable } from '@angular/core';
import { JobService } from '../job/job.service';
import { Observable, filter, map } from 'rxjs';
import { CityData, StateData } from './ranks/cities-rank/cities-rank.model';
import { WorkplaceData } from './ranks/workplace-rank/workplace-rank.model';
import { TypeData } from './ranks/type-rank/type-rank.model';
import { CompanyData } from './ranks/companies-rank/companies-rank.model';
import { Job } from '../job/job.model';
import { KeywordData } from './ranks/keywords-rank/keywords-rank.model';
import { keywords } from './ranks/keywords-rank/keywords-rank.data';
import {
  ExperienceLevelData,
  ExperienceLevels,
} from './ranks/experience-levels-rank/experience-levels-rank.model';
import {
  DisabilityData,
  DisabilityStatuses,
} from './ranks/disability-rank/disability-rank.model';
import { EducationData } from './ranks/education-rank/education-rank.types';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private jobService: JobService) {}

  getCitiesRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$
  ): Observable<CityData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const citiesMap = new Map<string, number>();

        jobs.forEach((job) => {
          if (job.city == '') return;
          const currentCityCount = citiesMap.get(job.city) || 0;
          citiesMap.set(job.city, currentCityCount + 1);
        });

        const sortedEntries = Array.from(citiesMap.entries()).sort(
          (a, b) => b[1] - a[1]
        );

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          name: key,
          state: jobs.find((job) => key == job.city)?.state || 'Desconhecido',
          count: value,
        }));

        return sortedObjects;
      })
    );
  }

  getStatesRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$
  ): Observable<StateData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const statesMap = new Map<string, number>();

        jobs.forEach((job) => {
          if (job.state == '') return;
          const currentStateCount = statesMap.get(job.state) || 0;
          statesMap.set(job.state, currentStateCount + 1);
        });

        const sortedEntries = Array.from(statesMap.entries()).sort(
          (a, b) => b[1] - a[1]
        );

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          name: key,
          count: value,
        }));

        return sortedObjects;
      })
    );
  }

  getJobsCount(): Observable<number> {
    return this.jobService.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => jobs.length)
    );
  }

  getWorkplaceRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$
  ): Observable<WorkplaceData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),

      map((jobs) => {
        const workplaceMap = new Map<string, number>();

        jobs.forEach((job) => {
          if (job.workplaceType == '') return;
          if (job.workplaceType == 'remote') job.workplaceType = 'remoto';
          if (job.workplaceType == 'on-site') job.workplaceType = 'presencial';
          if (job.workplaceType == 'hybrid') job.workplaceType = 'híbrido';

          const currentWorkplaceCount =
            workplaceMap.get(job.workplaceType) || 0;
          workplaceMap.set(job.workplaceType, currentWorkplaceCount + 1);
        });

        const sortedEntries = Array.from(workplaceMap.entries()).sort(
          (a, b) => b[1] - a[1]
        );

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          type: key,
          count: value,
        }));

        return sortedObjects;
      })
    );
  }

  getTypesRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$
  ): Observable<TypeData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),

      map((jobs) => {
        const typeMap = new Map<string, number>();

        jobs.forEach((job) => {
          if (job.type == '') return;

          const currentWorkplaceCount = typeMap.get(job.type) || 0;
          typeMap.set(job.type, currentWorkplaceCount + 1);
        });

        const sortedEntries = Array.from(typeMap.entries()).sort(
          (a, b) => b[1] - a[1]
        );

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          name: key,
          count: value,
        }));

        return sortedObjects;
      })
    );
  }

  getCompanyRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$
  ): Observable<CompanyData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),

      map((jobs) => {
        const companyMap = new Map<string, number>();

        jobs.forEach((job) => {
          if (job.careerPageName == '') return;

          const currentCompanyCount = companyMap.get(job.careerPageName) || 0;
          companyMap.set(job.careerPageName, currentCompanyCount + 1);
        });

        const sortedEntries = Array.from(companyMap.entries()).sort(
          (a, b) => b[1] - a[1]
        );

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          name: key,
          count: value,
          link:
            jobs.find((job) => job.careerPageName == key)?.careerPageUrl ||
            'https://portal.gupy.io/en',
        }));

        return sortedObjects;
      })
    );
  }

  getKeywordsRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$
  ): Observable<KeywordData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const keywordsMap = new Map<string, number>();

        jobs.forEach((job) => {
          job.keywords.forEach((keyword) => {
            const currentKeywordCount = keywordsMap.get(keyword)! | 0;
            keywordsMap.set(keyword, currentKeywordCount + 1);
          });
        });

        const sortedEntries = Array.from(keywordsMap.entries())
          .filter((keyword) => keyword[1] != 0)
          .sort((a, b) => b[1] - a[1]);

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          word: key,
          count: value,
        }));

        return sortedObjects;
      })
    );
  }

  getExperienceLevelsRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$
  ): Observable<ExperienceLevelData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const experienceLevelsMap = new Map<string, number>();

        jobs.forEach((job) => {
          const experienceLevel = this.jobService.findExperienceLevel(job);

          const currentExperienceLevelCount =
            experienceLevelsMap.get(experienceLevel) || 0;

          experienceLevelsMap.set(
            experienceLevel,
            currentExperienceLevelCount + 1
          );
        });

        const sortedEntries = Array.from(experienceLevelsMap.entries()).sort(
          (a, b) => b[1] - a[1]
        );

        const sortedObjects = sortedEntries.map(
          ([key, value]): ExperienceLevelData => ({
            level: key as ExperienceLevels,
            count: value,
          })
        );

        return sortedObjects;
      })
    );
  }

  getDisabilityStatusesRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$
  ): Observable<DisabilityData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const disabilitiesMap = new Map<DisabilityStatuses, number>();

        jobs.forEach((job) => {
          const jobDisabilityStatus = job.disabilities
            ? DisabilityStatuses.PCD
            : DisabilityStatuses.nonPCD;

          const currentDisabilityCount =
            disabilitiesMap.get(jobDisabilityStatus) || 0;
          disabilitiesMap.set(jobDisabilityStatus, currentDisabilityCount + 1);
        });

        const sortedEntries = Array.from(disabilitiesMap.entries()).sort(
          (a, b) => b[1] - a[1]
        );

        const sortedObjects = sortedEntries.map(
          ([key, value]): DisabilityData => ({
            name: key,
            count: value,
          })
        );

        return sortedObjects;
      })
    );
  }

  getEducationRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$
  ): Observable<EducationData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const educationMap = new Map<string, number>();

        jobs.forEach((job) => {
          const mentionsHigherEducation =
            this.jobService.doesJobMentionsHigherEducation(job);

          if (mentionsHigherEducation.length == 0) {
            const currentEducationCount = educationMap.get('Não menciona') || 0;
            educationMap.set('Não menciona', currentEducationCount + 1);
          }

          mentionsHigherEducation.forEach((mention) => {
            const currentEducationCount = educationMap.get(mention) || 0;
            educationMap.set(mention, currentEducationCount + 1);
          });
        });

        const sortedEntries = Array.from(educationMap.entries()).sort(
          (a, b) => b[1] - a[1]
        );

        const sortedObjects = sortedEntries.map(
          ([key, value]): EducationData => ({
            name: key,
            count: value,
          })
        );

        return sortedObjects;
      })
    );
  }
}
