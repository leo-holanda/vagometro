/// <reference lib="webworker" />

import { mapLinkedInJobsToJobs } from './linked-in.mapper';
import { LinkedInJob } from './linked-in.types';

addEventListener('message', ({ data }) => {
  const response = mapLinkedInJobsToJobs(data as LinkedInJob[]);
  postMessage(response);
});
