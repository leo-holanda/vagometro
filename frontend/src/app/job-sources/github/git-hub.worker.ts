/// <reference lib="webworker" />

import { mapGitHubJobToJob } from './git-hub-jobs.mapper';
import { GitHubJob } from './git-hub-jobs.types';

addEventListener('message', ({ data }) => {
  const response = (data as GitHubJob[])
    .map((job) => mapGitHubJobToJob(job))
    .sort((a, b) => (a.publishedDate > b.publishedDate ? -1 : 1));
  postMessage(response);
});
