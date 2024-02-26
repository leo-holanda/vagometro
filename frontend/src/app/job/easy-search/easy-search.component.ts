import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchData } from './easy-search.types';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { CountdownComponent } from 'src/app/shared/countdown/countdown.component';
import { JobSources } from 'src/app/job-sources/job-sources.types';

@Component({
  selector: 'vgm-easy-search',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, CountdownComponent],
  templateUrl: './easy-search.component.html',
  styleUrls: ['./easy-search.component.scss'],
})
export class EasySearchComponent {
  private searchData: SearchData | undefined;
  jobSources = JobSources;

  constructor(private router: Router) {
    const data = localStorage.getItem('searchData');
    if (data) this.searchData = JSON.parse(data);
    else this.router.navigate(['/busca-facil/dados']);
  }
}
