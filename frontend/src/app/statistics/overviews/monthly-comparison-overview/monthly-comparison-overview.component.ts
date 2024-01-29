import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../statistics.service';
import { Observable } from 'rxjs';
import {
  MonthData,
  MonthlyComparativeData,
} from '../../ranks/months-rank/months-rank.types';
import { trackByMonth } from 'src/app/shared/track-by-functions';

@Component({
  selector: 'vgm-monthly-comparison-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthly-comparison-overview.component.html',
  styleUrls: ['./monthly-comparison-overview.component.scss'],
})
export class MonthlyComparisonOverviewComponent {
  monthlyComparativeData$: Observable<MonthlyComparativeData[]>;
  annualComparativeData$: Observable<MonthlyComparativeData[]>;
  shouldShowMonthly = true;

  trackByMonth = trackByMonth;

  constructor(private statisticsService: StatisticsService) {
    this.monthlyComparativeData$ =
      this.statisticsService.getMonthlyComparative();
    this.annualComparativeData$ = this.statisticsService.getAnnualComparative();
  }
}
