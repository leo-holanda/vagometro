import { Injectable } from '@angular/core';
import * as zip from '@zip.js/zip.js';
import { environment } from 'src/environments/environment';
import { QuarterData, Quarters } from '../job-sources/job-sources.types';
import { GitHubJob } from '../job-sources/github/git-hub-jobs.types';
import { GupyJob } from '../job-sources/gupy/gupy.types';
import { LinkedInJob } from '../job-sources/linkedin/linked-in.types';

@Injectable({
  providedIn: 'root',
})
export class R2Service {
  async getJobs(
    //TODO: Auto generate this types
    collectionName: string,
    year: number,
    quarter: Quarters,
    quarterData: QuarterData,
  ): Promise<GitHubJob[] | GupyJob[] | LinkedInJob[]> {
    // https://gildas-lormeau.github.io/zip.js/
    // Try catch is not necessary. Errors are handled in Job Source Service.

    const key = this.buildKey(collectionName, year, quarter);
    const jobsFileResponse = await fetch(`${environment.GITHUB_WORKER_URL}/${key}.zip`);

    try {
      quarterData.canTrackDownloadProgress = true;
      return this.downloadWithProgressTracking(jobsFileResponse, quarterData);
    } catch (error) {
      console.error(error);
      console.log('Downloading jobs file without progress tracking...');
      quarterData.canTrackDownloadProgress = false;
      return this.downloadWithoutProgressTracking(jobsFileResponse);
    }
  }

  private buildKey(collectionName: string, year: number, quarter: Quarters): string {
    return `${collectionName}_${year}_${quarter}`;
  }

  private async unzipJobsFile(jobsFile: Blob): Promise<string> {
    const zipFileReader = new zip.BlobReader(jobsFile);

    const zippedJobsWriter = new zip.TextWriter();
    const zipReader = new zip.ZipReader(zipFileReader);
    const firstEntry = (await zipReader.getEntries()).shift();
    const jobs = await firstEntry!.getData!(zippedJobsWriter);
    await zipReader.close();

    return jobs;
  }

  private sanitizeJobs(jobs: string) {
    const sanitizedJobs = jobs.replace(/\bNaN\b/g, '"NaN"');
    return sanitizedJobs;
  }

  private async downloadWithProgressTracking(
    jobsFileResponse: Response,
    quarterData: QuarterData,
  ): Promise<GitHubJob[] | GupyJob[] | LinkedInJob[]> {
    const contentLengthHeader = jobsFileResponse.headers.get('Content-Length');
    const contentLength = contentLengthHeader ? +contentLengthHeader : 0;

    if (!jobsFileResponse.body || contentLength <= 0) {
      throw new Error('Unable to track download progress');
    }

    const reader = jobsFileResponse.body.getReader();
    let receivedBytes = 0;
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
      receivedBytes += value.length;
      quarterData.downloadingProgress = receivedBytes / contentLength;
    }

    const jobsZippedFileBlob = new Blob(chunks);
    const jobs = await this.unzipJobsFile(jobsZippedFileBlob);
    return JSON.parse(this.sanitizeJobs(jobs));
  }

  private async downloadWithoutProgressTracking(
    jobsFileResponse: Response,
  ): Promise<GitHubJob[] | GupyJob[] | LinkedInJob[]> {
    const jobsFileBlob = await jobsFileResponse.blob();
    const jobs = await this.unzipJobsFile(jobsFileBlob);
    return JSON.parse(this.sanitizeJobs(jobs));
  }
}
