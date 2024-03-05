/// <reference lib="webworker" />

import { mapGitHubJobsToJobs } from './git-hub-jobs.mapper';
import { GitHubJob } from './git-hub-jobs.types';

addEventListener('message', ({ data }) => {
  const response = mapGitHubJobsToJobs(data.jobs as GitHubJob[], data.searchData);
  postMessage(response);
});
