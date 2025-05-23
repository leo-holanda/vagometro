import { Injectable } from '@angular/core';
import { Job } from '../job/job.types';
import * as zip from '@zip.js/zip.js';
import { environment } from 'src/environments/environment';
import { Quarters } from '../job-sources/job-sources.types';
import { GitHubJob } from '../job-sources/github/git-hub-jobs.types';
import { GupyJob } from '../job-sources/gupy/gupy.types';
import { LinkedInJob } from '../job-sources/linkedin/linked-in.types';

@Injectable({
  providedIn: 'root'
})
export class R2Service {

  constructor() { }

  async getJobs(
      //TODO: Auto generate this types
      collectionName: string,
      year: number,
      quarter: Quarters,
    ): Promise<GitHubJob[] | GupyJob[] | LinkedInJob[]> {
      // https://gildas-lormeau.github.io/zip.js/
      // Try catch is not necessary. Errors are handled in Job Source Service.

      const key = this.buildKey(collectionName, year, quarter);
      const zippedJobs = await fetch(`${environment.GITHUB_WORKER_URL}/${key}`);
      const zipFileReader = new zip.BlobReader(await zippedJobs.blob());
  
      const zippedJobsWriter = new zip.TextWriter();
      const zipReader = new zip.ZipReader(zipFileReader);
      const firstEntry = (await zipReader.getEntries()).shift();
      const jobs = await firstEntry!.getData!(zippedJobsWriter);
      await zipReader.close();

      return JSON.parse(jobs);
    }

    private buildKey(collectionName: string, year: number, quarter: Quarters): string {
      return `${collectionName}_${year}_${quarter}`
    }
}
