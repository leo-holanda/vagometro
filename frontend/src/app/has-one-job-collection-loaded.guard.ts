import { CanActivateFn, Router } from '@angular/router';
import { JobSourcesService } from './job-sources/job-sources.service';
import { inject } from '@angular/core';

export const hasOneJobCollectionLoadedGuard: CanActivateFn = (route, state) => {
  const hasOneJobCollectionLoaded = inject(JobSourcesService).hasOneJobCollectionLoaded;
  const router = inject(Router);
  if (!hasOneJobCollectionLoaded) router.navigate(['/']);
  return hasOneJobCollectionLoaded;
};
