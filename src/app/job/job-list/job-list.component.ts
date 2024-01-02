import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from '../job.service';
import { Observable } from 'rxjs';
import { Job } from '../job.model';
import { translations } from 'src/app/statistics/ranks/type-rank/type-rank.translations';
import { StateAbbreviationPipe } from 'src/app/shared/pipes/state-abbreviation.pipe';

@Component({
  selector: 'vgm-job-list',
  standalone: true,
  imports: [CommonModule, StateAbbreviationPipe],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent {
  @Input() jobs$?: Observable<Job[] | undefined>;

  typeTranslations = translations;
}
