import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { JobService } from 'src/app/job/job.service';
import { Job } from 'src/app/job/job.types';
import { trackByMonth } from 'src/app/shared/track-by-functions';
import { StatisticsService } from '../../statistics.service';
import { MonthData } from '../../ranks/months-rank/months-rank.types';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { KeywordsRankComponent } from '../../ranks/keywords-rank/keywords-rank.component';
import { CompaniesRankComponent } from '../../ranks/companies-rank/companies-rank.component';
import { WorkplaceRankComponent } from '../../ranks/workplace-rank/workplace-rank.component';
import { ExperienceLevelsRankComponent } from '../../ranks/experience-levels-rank/experience-levels-rank.component';
import { EducationRankComponent } from '../../ranks/education-rank/education-rank.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';

@Component({
  selector: 'vgm-months-overview',
  standalone: true,
  imports: [
    CommonModule,
    PublicationChartComponent,
    KeywordsRankComponent,
    CompaniesRankComponent,
    WorkplaceRankComponent,
    ExperienceLevelsRankComponent,
    EducationRankComponent,
    JobListComponent,
    JobPostingsComparisonComponent,
  ],
  templateUrl: './months-overview.component.html',
  styleUrls: ['./months-overview.component.scss'],
})
export class MonthsOverviewComponent {
  monthsRank$!: Observable<MonthData[]>;
  jobsQuantity!: number;
  selectedMonth!: string;
  jobsByMonth$!: Observable<Job[]>;

  trackByMonth = trackByMonth;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService,
  ) {
    this.monthsRank$ = this.statisticsService.getMonthsRank();

    this.monthsRank$.subscribe((monthsRank) => {
      this.selectedMonth = monthsRank[0].name;
      this.jobsByMonth$ = this.jobService.getJobsByMonth(this.selectedMonth);
    });

    this.monthsRank$.subscribe((monthsRank) => {
      this.jobsQuantity = monthsRank.reduce(
        (acc, month) => acc + month.count,
        0,
      );
    });
  }

  onMonthClick(month: string): void {
    this.selectedMonth = month;
    this.jobsByMonth$ = this.jobService.getJobsByMonth(this.selectedMonth);
  }
}
