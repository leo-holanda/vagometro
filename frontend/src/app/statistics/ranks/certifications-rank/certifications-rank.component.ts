import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationsData } from 'src/app/shared/keywords-matcher/certification.data';
import { trackByCertificationStatus } from 'src/app/shared/track-by-functions';
import { Observable, map } from 'rxjs';
import { Job } from 'src/app/job/job.types';
import { StatisticsService } from '../../statistics.service';

@Component({
  selector: 'vgm-certifications-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certifications-rank.component.html',
  styleUrls: ['./certifications-rank.component.scss'],
})
export class CertificationsRankComponent implements OnInit, OnChanges {
  @Input() jobs$?: Observable<Job[]>;
  @Input() rankSize: number | undefined;

  certificationsRank$!: Observable<CertificationsData[]>;

  trackByCertificationStatus = trackByCertificationStatus;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.certificationsRank$ = this.statisticsService.getCertificationsRank(this.jobs$);
    if (this.rankSize)
      this.certificationsRank$ = this.certificationsRank$.pipe(
        map((certificationsRank) => certificationsRank.slice(0, this.rankSize)),
      );
  }

  ngOnChanges(): void {
    this.certificationsRank$ = this.statisticsService.getCertificationsRank(this.jobs$);
    if (this.rankSize)
      this.certificationsRank$ = this.certificationsRank$.pipe(
        map((certificationsRank) => certificationsRank.slice(0, this.rankSize)),
      );
  }
}
