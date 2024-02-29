import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { JobService } from 'src/app/job/job.service';
import { StatisticsService } from '../../statistics.service';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { trackByRankData } from 'src/app/shared/track-by-functions';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';
import { ExperienceLevels } from 'src/app/shared/keywords-matcher/experience-levels.data';
import { RankData, RankTypes } from '../../ranks/rank/rank.types';
import { RankComponent } from '../../ranks/rank/rank.component';

@Component({
  selector: 'vgm-experience-levels-overview',
  standalone: true,
  imports: [
    CommonModule,
    PublicationChartComponent,
    JobListComponent,
    JobPostingsComparisonComponent,
    RankComponent,
  ],
  templateUrl: './experience-levels-overview.component.html',
  styleUrls: ['./experience-levels-overview.component.scss'],
})
export class ExperienceLevelsOverviewComponent implements OnInit {
  experienceLevelsRank$!: Observable<RankData[]>;
  jobsQuantity!: number;
  selectedLevel!: string;
  jobsByExperienceLevel$!: Observable<Job[]>;

  trackByRankData = trackByRankData;
  rankTypes = RankTypes;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService,
  ) {}

  ngOnInit(): void {
    this.experienceLevelsRank$ = this.statisticsService.getExperienceLevelsRank();

    this.experienceLevelsRank$.subscribe((experienceLevelsRank) => {
      this.selectedLevel = experienceLevelsRank[0].name;
      this.jobsByExperienceLevel$ = this.jobService.getJobsByExperienceLevel(
        this.selectedLevel as ExperienceLevels,
      );
    });

    this.jobService.jobs$.subscribe((jobs) => {
      this.jobsQuantity = jobs?.length || 0;
    });
  }

  onExperienceLevelClick(experienceLevel: string): void {
    this.selectedLevel = experienceLevel;
    this.jobsByExperienceLevel$ = this.jobService.getJobsByExperienceLevel(
      this.selectedLevel as ExperienceLevels,
    );
  }
}
