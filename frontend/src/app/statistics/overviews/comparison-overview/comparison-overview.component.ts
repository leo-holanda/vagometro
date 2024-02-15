import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { IntervalTypes } from '../../charts/publication-chart/publication-chart.model';

@Component({
  selector: 'vgm-comparison-overview',
  standalone: true,
  imports: [CommonModule, JobPostingsComparisonComponent, PublicationChartComponent],
  templateUrl: './comparison-overview.component.html',
  styleUrls: ['./comparison-overview.component.scss'],
})
export class ComparisonOverviewComponent {
  shouldShowMonthly = true;
  chartIntervalType: IntervalTypes = 'monthly';

  onDataTypeChange(shouldShowMonthly: boolean): void {
    this.shouldShowMonthly = shouldShowMonthly;
    if (shouldShowMonthly) this.chartIntervalType = 'monthly';
    else this.chartIntervalType = 'annual';
  }

  onIntervalTypeChange(intervalType: IntervalTypes): void {
    if (intervalType == 'monthly') this.shouldShowMonthly = true;
    else this.shouldShowMonthly = false;
  }
}
