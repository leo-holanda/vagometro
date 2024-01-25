import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { StatisticsService } from '../../statistics.service';
import { CompanyData } from '../companies-rank/companies-rank.model';
import { ExperienceLevelData } from './experience-levels-rank.model';
import { trackByExperienceLevel } from 'src/app/shared/track-by-functions';

@Component({
  selector: 'vgm-experience-levels-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience-levels-rank.component.html',
  styleUrls: ['./experience-levels-rank.component.scss'],
})
export class ExperienceLevelsRankComponent {
  @Input() jobs$?: Observable<Job[]>;
  @Input() rankSize: number | undefined;

  experienceLevelsRank$!: Observable<ExperienceLevelData[]>;

  trackByExperienceLevel = trackByExperienceLevel;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.experienceLevelsRank$ = this.statisticsService.getExperienceLevelsRank(
      this.jobs$
    );

    if (this.rankSize)
      this.experienceLevelsRank$ = this.experienceLevelsRank$.pipe(
        map((experienceLevelsRank) =>
          experienceLevelsRank.slice(0, this.rankSize)
        )
      );
  }

  ngOnChanges(): void {
    this.experienceLevelsRank$ = this.statisticsService.getExperienceLevelsRank(
      this.jobs$
    );

    if (this.rankSize)
      this.experienceLevelsRank$ = this.experienceLevelsRank$.pipe(
        map((experienceLevelsRank) =>
          experienceLevelsRank.slice(0, this.rankSize)
        )
      );
  }
}
