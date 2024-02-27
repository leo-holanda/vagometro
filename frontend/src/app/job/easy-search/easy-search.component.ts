import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchData } from './easy-search.types';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { CountdownComponent } from 'src/app/shared/countdown/countdown.component';
import { JobSources } from 'src/app/job-sources/job-sources.types';
import { EasySearchService } from './easy-search.service';

@Component({
  selector: 'vgm-easy-search',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, CountdownComponent],
  templateUrl: './easy-search.component.html',
  styleUrls: ['./easy-search.component.scss'],
})
export class EasySearchComponent {
  jobSources = JobSources;

  constructor(
    private router: Router,
    private easySearchService: EasySearchService,
  ) {
    const hasSearchData = this.easySearchService.hasSearchData();
    if (!hasSearchData) this.router.navigate(['/busca-facil/dados']);
  }
}
