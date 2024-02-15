import { Injectable } from '@angular/core';
import { JobService } from '../job/job.service';
import { Observable, filter, map } from 'rxjs';
import { CityData, StateData } from './ranks/cities-rank/cities-rank.model';
import { WorkplaceData } from './ranks/workplace-rank/workplace-rank.model';
import { TypeData } from './ranks/type-rank/type-rank.model';
import { CompanyData } from './ranks/companies-rank/companies-rank.model';
import { Job } from '../job/job.types';
import { KeywordData } from './ranks/keywords-rank/keywords-rank.model';
import { InclusionData, InclusionTypes } from '../shared/keywords-matcher/inclusion.data';
import { EducationData } from './ranks/education-rank/education-rank.types';
import { MonthData, ComparisonData } from './ranks/months-rank/months-rank.types';
import { ContractTypes } from '../shared/keywords-matcher/contract-types.data';
import { ExperienceLevelData, ExperienceLevels } from '../shared/keywords-matcher/experience-levels.data';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private jobService: JobService) {}

  getCitiesRank(jobs$: Observable<Job[] | undefined> = this.jobService.jobs$): Observable<CityData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const citiesMap = new Map<string, number>();

        jobs.forEach((job) => {
          const currentCityCount = citiesMap.get(job.city) || 0;
          citiesMap.set(job.city, currentCityCount + 1);
        });

        const sortedEntries = Array.from(citiesMap.entries()).sort((a, b) => b[1] - a[1]);

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          name: key,
          state: jobs.find((job) => key == job.city)?.state || 'Desconhecido',
          count: value,
        }));

        return sortedObjects;
      }),
    );
  }

  getStatesRank(jobs$: Observable<Job[] | undefined> = this.jobService.jobs$): Observable<StateData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const statesMap = new Map<string, number>();

        jobs.forEach((job) => {
          const currentStateCount = statesMap.get(job.state) || 0;
          statesMap.set(job.state, currentStateCount + 1);
        });

        const sortedEntries = Array.from(statesMap.entries()).sort((a, b) => b[1] - a[1]);

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          name: key,
          count: value,
        }));

        return sortedObjects;
      }),
    );
  }

  getJobsCount(): Observable<number> {
    return this.jobService.jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => jobs.length),
    );
  }

  getWorkplaceRank(jobs$: Observable<Job[] | undefined> = this.jobService.jobs$): Observable<WorkplaceData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),

      map((jobs) => {
        const workplaceMap = new Map<string, number>();

        jobs.forEach((job) => {
          job.workplaceTypes.forEach((workplaceType) => {
            const currentWorkplaceCount = workplaceMap.get(workplaceType) || 0;
            workplaceMap.set(workplaceType, currentWorkplaceCount + 1);
          });
        });

        const sortedEntries = Array.from(workplaceMap.entries()).sort((a, b) => b[1] - a[1]);

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          type: key,
          count: value,
        }));

        return sortedObjects;
      }),
    );
  }

  getTypesRank(jobs$: Observable<Job[] | undefined> = this.jobService.jobs$): Observable<TypeData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const contractTypesMap = new Map<ContractTypes, number>();

        jobs.forEach((job) => {
          job.contractTypes.forEach((contractType) => {
            const currentWorkplaceCount = contractTypesMap.get(contractType) || 0;
            contractTypesMap.set(contractType, currentWorkplaceCount + 1);
          });
        });

        const sortedEntries = Array.from(contractTypesMap.entries()).sort((a, b) => b[1] - a[1]);

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          name: key,
          count: value,
        }));

        return sortedObjects;
      }),
    );
  }

  getCompanyRank(jobs$: Observable<Job[] | undefined> = this.jobService.jobs$): Observable<CompanyData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),

      map((jobs) => {
        const companyMap = new Map<string, number>();

        jobs.forEach((job) => {
          if (job.companyName == '') return;

          const currentCompanyCount = companyMap.get(job.companyName) || 0;
          companyMap.set(job.companyName, currentCompanyCount + 1);
        });

        const sortedEntries = Array.from(companyMap.entries()).sort((a, b) => b[1] - a[1]);

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          name: key,
          count: value,
          link: jobs.find((job) => job.companyName == key)?.companyUrl,
        }));

        return sortedObjects;
      }),
    );
  }

  getKeywordsRank(jobs$: Observable<Job[] | undefined> = this.jobService.jobs$): Observable<KeywordData[]> {
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
      }),
    );
  }

  getExperienceLevelsRank(jobs$: Observable<Job[] | undefined> = this.jobService.jobs$): Observable<ExperienceLevelData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const experienceLevelsMap = new Map<string, number>();

        jobs.forEach((job) => {
          job.experienceLevels.forEach((experienceLevel) => {
            const currentExperienceLevelCount = experienceLevelsMap.get(experienceLevel) || 0;

            experienceLevelsMap.set(experienceLevel, currentExperienceLevelCount + 1);
          });
        });

        const sortedEntries = Array.from(experienceLevelsMap.entries()).sort((a, b) => b[1] - a[1]);

        const sortedObjects = sortedEntries.map(
          ([key, value]): ExperienceLevelData => ({
            level: key as ExperienceLevels,
            count: value,
          }),
        );

        return sortedObjects;
      }),
    );
  }

  getInclusionRank(jobs$: Observable<Job[] | undefined> = this.jobService.jobs$): Observable<InclusionData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const inclusionTypeMap = new Map<InclusionTypes, number>();

        jobs.forEach((job) => {
          job.inclusionTypes.forEach((inclusionType) => {
            const currentInclusionTypeCount = inclusionTypeMap.get(inclusionType) || 0;
            inclusionTypeMap.set(inclusionType, currentInclusionTypeCount + 1);
          });
        });

        const sortedEntries = Array.from(inclusionTypeMap.entries()).sort((a, b) => b[1] - a[1]);

        const sortedObjects = sortedEntries.map(
          ([key, value]): InclusionData => ({
            name: key,
            count: value,
          }),
        );

        return sortedObjects;
      }),
    );
  }

  getEducationRank(jobs$: Observable<Job[] | undefined> = this.jobService.jobs$): Observable<EducationData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const educationMap = new Map<string, number>();

        jobs.forEach((job) => {
          if (job.educationTerms.length == 0) {
            const currentEducationCount = educationMap.get('Desconhecido') || 0;
            educationMap.set('Desconhecido', currentEducationCount + 1);
          }

          job.educationTerms.forEach((mention) => {
            const currentEducationCount = educationMap.get(mention) || 0;
            educationMap.set(mention, currentEducationCount + 1);
          });
        });

        const sortedEntries = Array.from(educationMap.entries()).sort((a, b) => b[1] - a[1]);

        const sortedObjects = sortedEntries.map(
          ([key, value]): EducationData => ({
            name: key,
            count: value,
          }),
        );

        return sortedObjects;
      }),
    );
  }

  getEducationalLevelRank(jobs$: Observable<Job[] | undefined> = this.jobService.jobs$): Observable<EducationData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const educationMap = new Map<string, number>();

        jobs.forEach((job) => {
          if (job.educationalLevelTerms.length == 0) {
            const currentEducationCount = educationMap.get('Desconhecido') || 0;
            educationMap.set('Desconhecido', currentEducationCount + 1);
          }

          job.educationalLevelTerms.forEach((mention) => {
            const currentEducationCount = educationMap.get(mention) || 0;
            educationMap.set(mention, currentEducationCount + 1);
          });
        });

        const sortedEntries = Array.from(educationMap.entries()).sort((a, b) => b[1] - a[1]);

        const sortedObjects = sortedEntries.map(
          ([key, value]): EducationData => ({
            name: key,
            count: value,
          }),
        );

        return sortedObjects;
      }),
    );
  }

  getLanguagesRank(jobs$: Observable<Job[] | undefined> = this.jobService.jobs$): Observable<EducationData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const languageMap = new Map<string, number>();

        jobs.forEach((job) => {
          if (job.languages.length == 0) {
            const currentLanguageCount = languageMap.get('Desconhecido') || 0;
            languageMap.set('Desconhecido', currentLanguageCount + 1);
          }

          job.languages.forEach((language) => {
            const currentLanguageCount = languageMap.get(language) || 0;
            languageMap.set(language, currentLanguageCount + 1);
          });
        });

        const sortedEntries = Array.from(languageMap.entries()).sort((a, b) => b[1] - a[1]);

        const sortedObjects = sortedEntries.map(
          ([key, value]): EducationData => ({
            name: key,
            count: value,
          }),
        );

        return sortedObjects;
      }),
    );
  }

  getMonthsRank(jobs$: Observable<Job[] | undefined> = this.jobService.jobs$): Observable<MonthData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const monthsMap = new Map<string, number>();

        jobs.forEach((job) => {
          const monthWhenJobWasPublished = this.jobService.getJobMonth(job);
          const currentMonthCount = monthsMap.get(monthWhenJobWasPublished) || 0;
          monthsMap.set(monthWhenJobWasPublished, currentMonthCount + 1);
        });

        const sortedEntries = Array.from(monthsMap.entries()).sort((a, b) => b[1] - a[1]);

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          name: key,
          count: value,
        }));

        return sortedObjects;
      }),
    );
  }

  getMonthlyComparison(jobs$: Observable<Job[] | undefined> = this.jobService.jobs$): Observable<ComparisonData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const monthsMap = new Map<string, number>();

        jobs.forEach((job) => {
          const monthAndYearWhenJobWasPublished = this.jobService.getJobMonthAndYear(job);
          const currentMonthCount = monthsMap.get(monthAndYearWhenJobWasPublished) || 0;
          monthsMap.set(monthAndYearWhenJobWasPublished, currentMonthCount + 1);
        });

        const sortedObjects = Array.from(monthsMap.entries()).map(([key, value]) => ({
          name: key,
          count: value,
        }));

        return sortedObjects;
      }),
      map((data) => {
        const monthlyComparativeData: ComparisonData[] = [];

        for (let i = 0; i < data.length; i++) {
          let difference;
          let differenceAsPercentage;

          if (i + 1 == data.length) {
            difference = data[i].count;
            differenceAsPercentage = 100;
          } else {
            difference = data[i].count - data[i + 1].count;
            differenceAsPercentage = (difference / data[i + 1].count) * 100;
          }

          monthlyComparativeData.push({
            name: data[i].name,
            count: data[i].count,
            difference: difference,
            differenceAsPercentage: differenceAsPercentage,
          });
        }

        return monthlyComparativeData;
      }),
    );
  }

  getAnnualComparison(jobs$: Observable<Job[] | undefined> = this.jobService.jobs$): Observable<ComparisonData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const yearsMap = new Map<string, number>();

        jobs.forEach((job) => {
          const yearWhenJobWasPublished = this.jobService.getJobYear(job);
          const currentYearCount = yearsMap.get(yearWhenJobWasPublished) || 0;
          yearsMap.set(yearWhenJobWasPublished, currentYearCount + 1);
        });

        const sortedObjects = Array.from(yearsMap.entries()).map(([key, value]) => ({
          name: key,
          count: value,
        }));

        return sortedObjects;
      }),
      map((data) => {
        const yearlyComparativeData: ComparisonData[] = [];

        for (let i = 0; i < data.length; i++) {
          let difference;
          let differenceAsPercentage;

          if (i + 1 == data.length) {
            difference = data[i].count;
            differenceAsPercentage = 100;
          } else {
            difference = data[i].count - data[i + 1].count;
            differenceAsPercentage = (difference / data[i + 1].count) * 100;
          }

          yearlyComparativeData.push({
            name: data[i].name,
            count: data[i].count,
            difference: difference,
            differenceAsPercentage: differenceAsPercentage,
          });
        }

        return yearlyComparativeData;
      }),
    );
  }
}
