import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { IntervalTypes } from '../../charts/publication-chart/publication-chart.model';
import { ComparisonTypes } from '../../comparisons/comparisons.types';

@Component({
  selector: 'vgm-comparison-overview',
  standalone: true,
  imports: [CommonModule, JobPostingsComparisonComponent, PublicationChartComponent],
  templateUrl: './comparison-overview.component.html',
  styleUrls: ['./comparison-overview.component.scss'],
})
export class ComparisonOverviewComponent {
  comparisonType: ComparisonTypes = ComparisonTypes.monthly;
  chartIntervalType: IntervalTypes = 'monthly';

  onComparisonTypeChange(comparisonType: ComparisonTypes): void {
    this.comparisonType = comparisonType;

    //TODO: Adapt chart interval to allow quarterly
    if (comparisonType !== ComparisonTypes.quarterly) {
      this.chartIntervalType = comparisonType;
    }
  }

  onIntervalTypeChange(intervalType: IntervalTypes): void {
    //TODO: Adapt IntervalTypes to new ComparisonTypes
    if (intervalType == 'daily') return;
    if (intervalType == 'monthly') this.comparisonType = ComparisonTypes.monthly;
    if (intervalType == 'annual') this.comparisonType = ComparisonTypes.annual;
  }
}
