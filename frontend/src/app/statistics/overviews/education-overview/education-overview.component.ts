import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { JobService } from 'src/app/job/job.service';
import { StatisticsService } from '../../statistics.service';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { EducationalDataTypes } from './education-overview.types';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';
import { RankData, RankTypes } from '../../rank/rank.types';
import { RankComponent } from '../../rank/rank.component';
import { trackByRankData } from 'src/app/shared/track-by-functions';
import { MatchesChartComponent } from '../../charts/matches-chart/matches-chart.component';

@Component({
  selector: 'vgm-education-overview',
  standalone: true,
  imports: [
    CommonModule,
    PublicationChartComponent,
    JobListComponent,
    JobPostingsComparisonComponent,
    RankComponent,
    MatchesChartComponent,
  ],
  templateUrl: './education-overview.component.html',
  styleUrls: ['./education-overview.component.scss'],
})
export class EducationOverviewComponent implements OnInit {
  educationRank$!: Observable<RankData[]>;
  selectedEducationTerm!: string;

  educationalLevelRank$!: Observable<RankData[]>;
  selectedEducationalLevelTerm!: string;

  jobsQuantity = 0;

  jobsByEducationTerm$!: Observable<Job[]>;
  jobsByEducationalLevel$!: Observable<Job[]>;

  trackByRankData = trackByRankData;
  rankTypes = RankTypes;

  selectedDataType = EducationalDataTypes.level;
  educationalDataTypes = EducationalDataTypes;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService,
  ) {}

  ngOnInit(): void {
    this.educationRank$ = this.statisticsService.getEducationRank();
    this.educationalLevelRank$ = this.statisticsService.getEducationalLevelRank();

    this.educationRank$.subscribe((educationRank) => {
      this.selectedEducationTerm = educationRank[0].name;
      this.jobsByEducationTerm$ = this.jobService.getJobsByEducationTerms(
        this.selectedEducationTerm,
      );
    });

    this.educationalLevelRank$.subscribe((educationalLevelRank) => {
      this.selectedEducationalLevelTerm = educationalLevelRank[0].name;
      this.jobsByEducationalLevel$ = this.jobService.getJobsByEducationalLevelTerms(
        this.selectedEducationalLevelTerm,
      );
    });

    this.jobService.jobs$.subscribe((jobs) => {
      this.jobsQuantity = jobs?.length || 0;
    });
  }

  onEducationTermClick(TypeName: string): void {
    this.selectedEducationTerm = TypeName;
    this.jobsByEducationTerm$ = this.jobService.getJobsByEducationTerms(this.selectedEducationTerm);
  }

  onEducationalLevelClick(educationalLevel: string): void {
    this.selectedEducationalLevelTerm = educationalLevel;
    this.jobsByEducationalLevel$ = this.jobService.getJobsByEducationalLevelTerms(
      this.selectedEducationalLevelTerm,
    );
  }

  setDataType(dataType: EducationalDataTypes): void {
    this.selectedDataType = dataType;
  }
}
