/// <reference lib="webworker" />

import { Job } from 'src/app/job/job.types';
import { mapToJob, setRepostings } from './git-hub-jobs.mapper';
import { GitHubJob } from './git-hub-jobs.types';
import { SearchData } from 'src/app/job/easy-search/easy-search.types';

type GitHubWorkerInput = { jobs: GitHubJob[]; searchData: SearchData };

addEventListener('message', ({ data }: MessageEvent<GitHubWorkerInput>) => {
  const jobsByCompanyMap = new Map<string, Job[]>();

  const mappedJobs = data.jobs.map((jobs, index) => {
    postMessage({
      loadingProgress: (index + 1) / (data.jobs.length * 2),
    });

    return mapToJob(jobs, data.searchData, jobsByCompanyMap);
  });

  mappedJobs.forEach((job, index) => {
    setRepostings(job, jobsByCompanyMap);

    postMessage({
      loadingProgress: (data.jobs.length + index + 1) / (data.jobs.length * 2),
    });
  });

  mappedJobs.sort((a, b) => (a.publishedDate > b.publishedDate ? -1 : 1));

  postMessage(mappedJobs);
});
