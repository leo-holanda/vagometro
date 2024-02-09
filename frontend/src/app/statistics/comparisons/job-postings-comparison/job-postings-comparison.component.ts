import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { trackByMonth } from 'src/app/shared/track-by-functions';
import { ComparisonData } from '../../ranks/months-rank/months-rank.types';
import { StatisticsService } from '../../statistics.service';

@Component({
  selector: 'vgm-job-postings-comparison',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-postings-comparison.component.html',
  styleUrls: ['./job-postings-comparison.component.scss'],
})
export class JobPostingsComparisonComponent {
  @Input() jobs$?: Observable<Job[]>;

  monthlyComparativeData$: Observable<ComparisonData[]>;
  annualComparativeData$: Observable<ComparisonData[]>;
  shouldShowMonthly = true;

  trackByMonth = trackByMonth;

  constructor(private statisticsService: StatisticsService) {
    this.monthlyComparativeData$ = this.statisticsService.getMonthlyComparison(this.jobs$);
    this.annualComparativeData$ = this.statisticsService.getAnnualComparison(this.jobs$);
  }

  ngOnChanges(): void {
    this.monthlyComparativeData$ = this.statisticsService.getMonthlyComparison(this.jobs$);
    this.annualComparativeData$ = this.statisticsService.getAnnualComparison(this.jobs$);
  }
}
