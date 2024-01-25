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
    return ExperienceLevels.unknown;
  }

  private findJobKeywords(githubJob: GitHubJob): string[] {
    return [];
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
