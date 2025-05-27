import { Injectable } from '@angular/core';
import { JobService } from '../job/job.service';
import { Observable, filter, map } from 'rxjs';
import { Job } from '../job/job.types';
import { InclusionTypes } from '../shared/keywords-matcher/inclusion.data';
import { ContractTypes } from '../shared/keywords-matcher/contract-types.data';
import { CertificationStatus } from '../shared/keywords-matcher/certification.data';
import { RankData } from './rank/rank.types';
import { ComparisonData } from './comparisons/comparisons.types';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private jobService: JobService) {}

  getCitiesRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<RankData[]> {
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
          count: value,
          percentage: value / jobs.length,
          state: jobs.find((job) => key == job.city)?.state || 'Desconhecido',
        }));

        return sortedObjects;
      }),
    );
  }

  getStatesRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<RankData[]> {
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
          percentage: value / jobs.length,
        }));

        return sortedObjects;
      }),
    );
  }

  getJobsCount(jobs$: Observable<Job[] | undefined> = this.jobService.jobs$): Observable<number> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => jobs.length),
    );
  }

  getWorkplaceRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<RankData[]> {
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
          name: key,
          count: value,
          percentage: value / jobs.length,
        }));

        return sortedObjects;
      }),
    );
  }

  getTypesRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<RankData[]> {
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
          percentage: value / jobs.length,
        }));

        return sortedObjects;
      }),
    );
  }

  getCompanyRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<RankData[]> {
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
          percentage: value / jobs.length,
          link: jobs.find((job) => job.companyName == key)?.companyUrl,
        }));

        return sortedObjects;
      }),
    );
  }

  getKeywordsRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<RankData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const keywordsMap = new Map<string, number>();

        jobs.forEach((job) => {
          job.keywords.forEach((keyword) => {
            const currentKeywordCount = keywordsMap.get(keyword.name) || 0;
            keywordsMap.set(keyword.name, currentKeywordCount + 1);
          });
        });

        const sortedEntries = Array.from(keywordsMap.entries())
          .filter((keyword) => keyword[1] != 0)
          .sort((a, b) => b[1] - a[1]);

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          name: key,
          count: value,
          percentage: value / jobs.length,
        }));

        return sortedObjects;
      }),
    );
  }

  getExperienceLevelsRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<RankData[]> {
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

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          name: key,
          count: value,
          percentage: value / jobs.length,
        }));

        return sortedObjects;
      }),
    );
  }

  getInclusionRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<RankData[]> {
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

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          name: key,
          count: value,
          percentage: value / jobs.length,
        }));

        return sortedObjects;
      }),
    );
  }

  getEducationRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<RankData[]> {
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

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          name: key,
          count: value,
          percentage: value / jobs.length,
        }));

        return sortedObjects;
      }),
    );
  }

  getEducationalLevelRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<RankData[]> {
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

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          name: key,
          count: value,
          percentage: value / jobs.length,
        }));

        return sortedObjects;
      }),
    );
  }

  getLanguagesRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<RankData[]> {
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

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          name: key,
          count: value,
          percentage: value / jobs.length,
        }));

        return sortedObjects;
      }),
    );
  }

  getMonthsRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<RankData[]> {
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
          percentage: value / jobs.length,
        }));

        return sortedObjects;
      }),
    );
  }

  getMonthlyAverageRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<RankData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const monthsAndYearMap = new Map<string, number>();

        jobs.forEach((job) => {
          const monthAndYearWhenJobWasPublished = this.jobService.getJobMonthAndYear(job);
          const currentMonthCount = monthsAndYearMap.get(monthAndYearWhenJobWasPublished) || 0;
          monthsAndYearMap.set(monthAndYearWhenJobWasPublished, currentMonthCount + 1);
        });

        const monthsMap = new Map<string, number>();
        const monthsOcurrenceMap = new Map<string, number>();

        Array.from(monthsAndYearMap.entries()).forEach(([key, value]) => {
          const monthName = key.split('/')[0];
          const currentMonthCount = monthsMap.get(monthName) || 0;
          monthsMap.set(monthName, currentMonthCount + value);

          const currentMonthOcurrenceCount = monthsOcurrenceMap.get(monthName) || 0;
          monthsOcurrenceMap.set(monthName, currentMonthOcurrenceCount + 1);
        });

        const daysPerMonth = this.getDaysPerMonth();
        const sortedRankObjects = Array.from(monthsMap.entries()).map(([key, value]) => ({
          name: key,
          count: value / (daysPerMonth[key] * (monthsOcurrenceMap.get(key) || 1)),
          percentage: value / jobs.length,
        }));

        return sortedRankObjects;
      }),
    );
  }

  getCertificationsRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<RankData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const certificationsMap = new Map<CertificationStatus, number>();

        jobs.forEach((job) => {
          job.certificationStatuses.forEach((certificationStatus) => {
            const currentCertificationStatusCount = certificationsMap.get(certificationStatus) || 0;
            certificationsMap.set(certificationStatus, currentCertificationStatusCount + 1);
          });
        });

        const sortedEntries = Array.from(certificationsMap.entries()).sort((a, b) => b[1] - a[1]);

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          name: key,
          count: value,
          percentage: value / jobs.length,
        }));

        return sortedObjects;
      }),
    );
  }

  getRepostingsRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<RankData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const repostingsMap = new Map<number, number>();

        jobs.forEach((job) => {
          const currentRepostingsCount = repostingsMap.get(job.repostings.length) || 0;
          repostingsMap.set(job.repostings.length, currentRepostingsCount + 1);
        });

        const sortedEntries = Array.from(repostingsMap.entries()).sort((a, b) => b[0] - a[0]);

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          name: key.toString(),
          count: value,
          percentage: value / jobs.length,
        }));

        return sortedObjects;
      }),
    );
  }

  getTimeBetweenRepostingsRank(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<RankData[]> {
    return jobs$.pipe(
      filter((jobs): jobs is Job[] => jobs != undefined),
      map((jobs) => {
        const timeBetweenRepostingsMap = new Map<number, number>();

        jobs.forEach((job) => {
          const currentTimeBetweenRepostings =
            timeBetweenRepostingsMap.get(job.timeInDaysBetweenRepostings) || 0;

          timeBetweenRepostingsMap.set(
            job.timeInDaysBetweenRepostings,
            currentTimeBetweenRepostings + 1,
          );
        });

        const sortedEntries = Array.from(timeBetweenRepostingsMap.entries()).sort(
          (a, b) => b[0] - a[0],
        );

        const sortedObjects = sortedEntries.map(([key, value]) => ({
          name: key.toString(),
          count: value,
          percentage: value / jobs.length,
        }));

        return sortedObjects;
      }),
    );
  }

  getMonthlyComparison(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<ComparisonData[]> {
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

  getAnnualComparison(
    jobs$: Observable<Job[] | undefined> = this.jobService.jobs$,
  ): Observable<ComparisonData[]> {
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

  private getDaysPerMonth() {
    const monthsName = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    const currentYear = new Date().getFullYear();
    const daysPerMonth: Record<string, number> = {};
    monthsName.forEach((month, index) => {
      // The zero day of the following month returns the last day of the current month
      const lastDay = new Date(currentYear, index + 1, 0).getDate();
      daysPerMonth[month] = lastDay;
    });

    return daysPerMonth;
  }
}
