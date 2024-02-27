/// <reference lib="webworker" />

import { mapGupyJobsToJobs } from './gupy.mapper';
import { GupyJob } from './gupy.types';

addEventListener('message', ({ data }) => {
  const response = mapGupyJobsToJobs(data.jobs as GupyJob[], data.searchData);
  postMessage(response);
});
