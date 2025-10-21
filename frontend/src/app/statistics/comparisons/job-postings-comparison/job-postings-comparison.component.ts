import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { StatisticsService } from '../../statistics.service';
import { ComparisonData, ComparisonTypes } from '../comparisons.types';
import { trackByComparisonData } from 'src/app/shared/track-by-functions';

@Component({
  selector: 'vgm-job-postings-comparison',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-postings-comparison.component.html',
  styleUrls: ['./job-postings-comparison.component.scss'],
})
export class JobPostingsComparisonComponent implements OnChanges {
  @Input() jobs$?: Observable<Job[]>;
  @Input() comparisonType: ComparisonTypes = ComparisonTypes.monthly;
  @Output() comparisonTypeChanged = new EventEmitter<ComparisonTypes>();

  monthlyComparativeData$: Observable<ComparisonData[]>;
  quarterlyComparativeData$: Observable<ComparisonData[]>;
  annualComparativeData$: Observable<ComparisonData[]>;

  trackByComparisonData = trackByComparisonData;
  comparisonTypes = ComparisonTypes;

  constructor(private statisticsService: StatisticsService) {
    this.monthlyComparativeData$ = this.statisticsService.getMonthlyComparison(this.jobs$);
    this.quarterlyComparativeData$ = this.statisticsService.getQuarterlyComparison(this.jobs$);
    this.annualComparativeData$ = this.statisticsService.getAnnualComparison(this.jobs$);
  }

  ngOnChanges(): void {
    this.monthlyComparativeData$ = this.statisticsService.getMonthlyComparison(this.jobs$);
    this.quarterlyComparativeData$ = this.statisticsService.getQuarterlyComparison(this.jobs$);
    this.annualComparativeData$ = this.statisticsService.getAnnualComparison(this.jobs$);
  }

  onComparisonTypeClick(comparisonType: ComparisonTypes): void {
    this.comparisonType = comparisonType;
    this.comparisonTypeChanged.emit(comparisonType);
  }
}
