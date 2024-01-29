import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../statistics.service';
import { Observable } from 'rxjs';
import { ComparisonData } from '../../ranks/months-rank/months-rank.types';
import { trackByMonth } from 'src/app/shared/track-by-functions';
import { Job } from 'src/app/job/job.types';

@Component({
  selector: 'vgm-comparison-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comparison-overview.component.html',
  styleUrls: ['./comparison-overview.component.scss'],
})
export class ComparisonOverviewComponent implements OnChanges {
  @Input() jobs$?: Observable<Job[]>;

  monthlyComparativeData$: Observable<ComparisonData[]>;
  annualComparativeData$: Observable<ComparisonData[]>;
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
