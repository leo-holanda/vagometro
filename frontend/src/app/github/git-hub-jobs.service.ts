import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GitHubJob } from './git-hub-jobs.types';
import { environment } from 'src/environments/environment';
import { Observable, first, map } from 'rxjs';
import {
  Job,
  WorkplaceTypes,
  workplaceTypeRelatedTerms,
} from '../job/job.types';
import { ExperienceLevels } from '../statistics/ranks/experience-levels-rank/experience-levels-rank.model';
import { MapDataService } from '../statistics/maps/map-data.service';
import {
  seniorLevelRelatedTerms,
  midLevelRelatedTerms,
  juniorLevelRelatedTerms,
  traineeLevelRelatedTerms,
  internLevelRelatedTerms,
} from '../statistics/ranks/experience-levels-rank/experience-levels-rank.data';
import { keywords } from '../statistics/ranks/keywords-rank/keywords-rank.data';

@Injectable({
  providedIn: 'root',
})
export class GitHubJobsService {
  jobs$: Observable<Job[]>;

  private citiesNames: string[];

  constructor(
    private httpClient: HttpClient,
    private mapDataService: MapDataService
  ) {
    this.jobs$ = this.getJobsObservable();
    this.citiesNames = this.mapDataService
      .getCitiesNames()
      .map((cityName) => this.removeAccents(cityName).toLowerCase());
  }

  getJobsObservable(): Observable<Job[]> {
    return this.httpClient.get<GitHubJob[]>(environment.GITHUB_WORKER_URL).pipe(
      first(),
      map((jobs) => jobs.map((job) => this.mapToJob(job)))
    );
  }

  private mapToJob(githubJob: GitHubJob): Job {
    return {
      companyUrl: '',
      jobUrl: githubJob.html_url,
      workplaceType: this.findJobWorkplaceTypes(githubJob)[0],
      country: '',
      title: githubJob.title,
      state: '',
      city: '',
      isOpenToPCD: false,
      companyName: '',
      description: githubJob.body,
      id: githubJob.id,
      publishedDate: githubJob.created_at,
      contractType: '',
      experienceLevel: this.findJobExperienceLevel(githubJob),
      keywords: this.findJobKeywords(githubJob),
      educationTerms: this.findCitedCoursesInJob(githubJob),
      educationalLevelTerms: this.findEducationalLevelsCitedInJob(githubJob),
      languages: this.findLanguagesCitedInJob(githubJob),
    };
  }

  private findJobWorkplaceTypes(githubJob: GitHubJob): WorkplaceTypes[] {
    const matchedWorkplaceTypes: WorkplaceTypes[] = [];

    githubJob.labels.forEach((label) => {
      const labelContent = this.removeAccents(label).toLowerCase();

      const matchedWorkplaceType = workplaceTypeRelatedTerms[labelContent];

      if (matchedWorkplaceType)
        matchedWorkplaceTypes.push(matchedWorkplaceType);
    });

    Object.keys(workplaceTypeRelatedTerms).forEach((term) => {
      const titleHasTerm = this.removeAccents(githubJob.title)
        .toLowerCase()
        .includes(term);

      if (titleHasTerm)
        matchedWorkplaceTypes.push(workplaceTypeRelatedTerms[term]);
    });

    if (matchedWorkplaceTypes.length == 0) {
      const hasMatchedLabelWithCityName = githubJob.labels.some((label) => {
        const labelContent = this.removeAccents(label).toLowerCase();
        return this.citiesNames.includes(labelContent);
      });

      if (hasMatchedLabelWithCityName)
        matchedWorkplaceTypes.push(WorkplaceTypes['on-site']);

      const titleContent = this.removeAccents(githubJob.title).toLowerCase();

      const hasMatchedTitleWithCityName = this.citiesNames.some((cityName) =>
        titleContent.includes(cityName)
      );
      if (hasMatchedTitleWithCityName)
        matchedWorkplaceTypes.push(WorkplaceTypes['on-site']);
    }

    if (matchedWorkplaceTypes.length == 0) return [WorkplaceTypes.unknown];
    return this.getUniqueStrings(matchedWorkplaceTypes) as WorkplaceTypes[];
  }

  private findJobExperienceLevel(githubJob: GitHubJob): ExperienceLevels {
    const experienceLevelFromLabel = this.matchExperienceLevelTermsWithLabel(
      githubJob.labels
    );

    if (experienceLevelFromLabel) return experienceLevelFromLabel;
    const experienceLevelFromTitle = this.matchExperienceLevelTermsWithTitle(
      githubJob.title
    );

    if (experienceLevelFromTitle) return experienceLevelFromTitle;

    return ExperienceLevels.unknown;
  }

  private matchExperienceLevelTermsWithLabel(
    labels: string[]
  ): ExperienceLevels | undefined {
    const labelContent = labels.map((label) =>
      this.removeAccents(label).toLowerCase()
    );

    const hasSeniorLevelRelatedTerms = seniorLevelRelatedTerms.some((term) =>
      labelContent.includes(term)
    );
    if (hasSeniorLevelRelatedTerms) return ExperienceLevels.senior;

    const hasMidLevelRelatedTerms = midLevelRelatedTerms.some((term) =>
      labelContent.includes(term)
    );
    if (hasMidLevelRelatedTerms) return ExperienceLevels.mid;

    const hasJuniorLevelRelatedTerms = juniorLevelRelatedTerms.some((term) =>
      labelContent.includes(term)
    );
    if (hasJuniorLevelRelatedTerms) return ExperienceLevels.junior;

    const hasTraineeLevelRelatedTerms = traineeLevelRelatedTerms.some((term) =>
      labelContent.includes(term)
    );
    if (hasTraineeLevelRelatedTerms) return ExperienceLevels.intern;

    const hasInternLevelRelatedTerms = internLevelRelatedTerms.some((term) =>
      labelContent.includes(term)
    );
    if (hasInternLevelRelatedTerms) return ExperienceLevels.intern;

    return undefined;
  }

  private matchExperienceLevelTermsWithTitle(
    title: string
  ): ExperienceLevels | undefined {
    const titleContent = this.removeAccents(title).toLowerCase();

    const hasSeniorLevelRelatedTerms = seniorLevelRelatedTerms.some((term) =>
      titleContent.includes(term)
    );
    if (hasSeniorLevelRelatedTerms) return ExperienceLevels.senior;

    const hasMidLevelRelatedTerms = midLevelRelatedTerms.some((term) =>
      titleContent.includes(term)
    );
    if (hasMidLevelRelatedTerms) return ExperienceLevels.mid;

    const hasJuniorLevelRelatedTerms = juniorLevelRelatedTerms.some((term) =>
      titleContent.includes(term)
    );
    if (hasJuniorLevelRelatedTerms) return ExperienceLevels.junior;

    const hasTraineeLevelRelatedTerms = traineeLevelRelatedTerms.some((term) =>
      titleContent.includes(term)
    );
    if (hasTraineeLevelRelatedTerms) return ExperienceLevels.intern;

    const hasInternLevelRelatedTerms = internLevelRelatedTerms.some((term) =>
      titleContent.includes(term)
    );
    if (hasInternLevelRelatedTerms) return ExperienceLevels.intern;

    return undefined;
  }

  private findJobKeywords(githubJob: GitHubJob): string[] {
    const jobKeywords: string[] = [];

    //TODO: Apparently there are some jobs without title or body. Investigate this.
    //TODO: Consider replace replaceAll with Regex
    if (githubJob.title) {
      const splittedTitle = githubJob.title
        .replaceAll('/', ' ')
        .replaceAll(',', ' ')
        .replaceAll('(', ' ')
        .replaceAll(')', ' ')
        .replaceAll(';', ' ')
        .split(' ')
        .map((substring) => substring.toLowerCase());

      splittedTitle.forEach((substring: string) => {
        if (keywords[substring]) jobKeywords.push(keywords[substring]);
      });
    }

    if (githubJob.body) {
      const splittedDescription = githubJob.body
        .replaceAll('/', ' ')
        .replaceAll(',', ' ')
        .replaceAll('(', ' ')
        .replaceAll(')', ' ')
        .replaceAll(';', ' ')
        .split(' ')
        .map((substring) => substring.toLowerCase());

      splittedDescription.forEach((substring: string) => {
        if (keywords[substring]) jobKeywords.push(keywords[substring]);
      });
    }

    return this.getUniqueStrings(jobKeywords);
  }

  private findCitedCoursesInJob(githubJob: GitHubJob): string[] {
    return [];
  }

  private findEducationalLevelsCitedInJob(githubJob: GitHubJob): string[] {
    return [];
  }

  private findLanguagesCitedInJob(githubJob: GitHubJob): string[] {
    return [];
  }

  private removeAccents(string: string) {
    //TODO Understand how it works
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  private getUniqueStrings(strings: string[]): string[] {
    const uniqueSet = new Set(strings);
    const uniqueArray = Array.from(uniqueSet);
    return uniqueArray;
  }
}
