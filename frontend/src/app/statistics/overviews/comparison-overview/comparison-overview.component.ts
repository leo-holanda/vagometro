import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobPostingsComparisonComponent } from '../../comparisons/job-postings-comparison/job-postings-comparison.component';

@Component({
  selector: 'vgm-comparison-overview',
  standalone: true,
  imports: [CommonModule, JobPostingsComparisonComponent],
  templateUrl: './comparison-overview.component.html',
  styleUrls: ['./comparison-overview.component.scss'],
})
export class ComparisonOverviewComponent {}
