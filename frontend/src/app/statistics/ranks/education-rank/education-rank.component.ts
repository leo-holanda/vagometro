import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../statistics.service';
import { Observable, map } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { EducationData } from './education-rank.types';
import { trackByEducationStatus } from 'src/app/shared/track-by-functions';

@Component({
  selector: 'vgm-education-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education-rank.component.html',
  styleUrls: ['./education-rank.component.scss'],
})
export class EducationRankComponent implements OnChanges {
  @Input() jobs$?: Observable<Job[]>;
  @Input() rankSize: number | undefined;

  educationRank$!: Observable<EducationData[]>;

  trackByEducationStatus = trackByEducationStatus;

  constructor(private statisticsService: StatisticsService) {
    this.educationRank$ = this.statisticsService.getEducationalLevelRank();

    if (this.rankSize)
      this.educationRank$ = this.educationRank$.pipe(
        map((educationRank) => educationRank.slice(0, this.rankSize))
      );
  }

  ngOnChanges(): void {
    this.educationRank$ = this.statisticsService.getEducationalLevelRank(
      this.jobs$
    );
    if (this.rankSize)
      this.educationRank$ = this.educationRank$.pipe(
        map((educationRank) => educationRank.slice(0, this.rankSize))
      );
  }
}
