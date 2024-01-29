import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../statistics.service';
import { Observable } from 'rxjs';
import { MonthlyComparativeData } from '../../ranks/months-rank/months-rank.types';
import { trackByMonth } from 'src/app/shared/track-by-functions';
import { Job } from 'src/app/job/job.types';

@Component({
  selector: 'vgm-monthly-comparison-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthly-comparison-overview.component.html',
  styleUrls: ['./monthly-comparison-overview.component.scss'],
})
export class MonthlyComparisonOverviewComponent implements OnChanges {
  @Input() jobs$?: Observable<Job[]>;

  monthlyComparativeData$: Observable<MonthlyComparativeData[]>;
  annualComparativeData$: Observable<MonthlyComparativeData[]>;
  shouldShowMonthly = true;

  trackByMonth = trackByMonth;

  constructor(private statisticsService: StatisticsService) {
    this.monthlyComparativeData$ = this.statisticsService.getMonthlyComparison(
      this.jobs$
    );
    this.annualComparativeData$ = this.statisticsService.getAnnualComparison(
      this.jobs$
    );
  }

  ngOnChanges(): void {
    this.monthlyComparativeData$ = this.statisticsService.getMonthlyComparison(
      this.jobs$
    );
    this.annualComparativeData$ = this.statisticsService.getAnnualComparison(
      this.jobs$
    );
  }
}
