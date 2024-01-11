import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EducationData } from '../../ranks/education-rank/education-rank.types';
import { trackByEducationStatus } from 'src/app/shared/track-by-functions';
import { Observable } from 'rxjs';
import { Job } from 'src/app/job/job.model';
import { JobService } from 'src/app/job/job.service';
import { StatisticsService } from '../../statistics.service';
import { PublicationChartComponent } from '../../charts/publication-chart/publication-chart.component';
import { KeywordsRankComponent } from '../../ranks/keywords-rank/keywords-rank.component';
import { CompaniesRankComponent } from '../../ranks/companies-rank/companies-rank.component';
import { WorkplaceRankComponent } from '../../ranks/workplace-rank/workplace-rank.component';
import { ExperienceLevelsRankComponent } from '../../ranks/experience-levels-rank/experience-levels-rank.component';
import { JobListComponent } from 'src/app/job/job-list/job-list.component';

@Component({
  selector: 'vgm-education-overview',
  standalone: true,
  imports: [
    CommonModule,
    PublicationChartComponent,
    KeywordsRankComponent,
    CompaniesRankComponent,
    WorkplaceRankComponent,
    ExperienceLevelsRankComponent,
    JobListComponent,
  ],
  templateUrl: './education-overview.component.html',
  styleUrls: ['./education-overview.component.scss'],
})
export class EducationOverviewComponent {
  educationRank$!: Observable<EducationData[]>;
  termFrequency!: number;
  selectedEducationTerm!: string;
  jobsByEducationTerm$!: Observable<Job[]>;

  trackByEducationTerm = trackByEducationStatus;

  constructor(
    private statisticsService: StatisticsService,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.educationRank$ = this.statisticsService.getEducationRank();

    this.educationRank$.subscribe((educationRank) => {
      this.selectedEducationTerm = educationRank[0].name;

      this.jobsByEducationTerm$ = this.jobService.getJobsByEducationTerms(
        this.selectedEducationTerm
      );
    });

    this.educationRank$.subscribe((educationRank) => {
      this.termFrequency = educationRank.reduce(
        (acc, term) => acc + term.count,
        0
      );
    });
  }

  onEducationTermClick(TypeName: string): void {
    this.selectedEducationTerm = TypeName;
    this.jobsByEducationTerm$ = this.jobService.getJobsByEducationTerms(
      this.selectedEducationTerm
    );
  }
}
