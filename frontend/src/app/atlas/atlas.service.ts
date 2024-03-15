import { Injectable } from '@angular/core';
import * as Realm from 'realm-web';
import { Observable, defer, shareReplay, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GupyJob } from '../job-sources/gupy/gupy.types';
import { LinkedInJob } from '../job-sources/linkedin/linked-in.types';
import { jobCollectionsMap } from '../job-sources/job-sources.types';

@Injectable({
  providedIn: 'root',
})
export class AtlasService {
  //TODO: Find where the MongoDB types are and set it here
  private mobileJobsCollection: any;
  private devopsJobsCollection: any;
  private uiuxJobsCollection: any;
  private webdevJobsCollection: any;
  private dataJobsCollection: any;
  private qaJobsCollection: any;
  private aiJobsCollection: any;
  private productManagerJobsCollection: any;
  private agileRelatedJobsCollection: any;
  private recruitmentJobsCollection: any;

  private linkedInDevJobsCollection: any;

  private connectionObservable$: any;

  constructor() {
    this.connectionObservable$ = defer(() => this.openConnection()).pipe(shareReplay());
  }

  private async openConnection(): Promise<void> {
    const app = new Realm.App({ id: environment.ATLAS_APP_ID });
    const credentials = Realm.Credentials.anonymous();
    await app.logIn(credentials);

    if (app.currentUser) {
      const mongoDB = app.currentUser.mongoClient(environment.DATA_SOURCE_NAME);

      this.mobileJobsCollection = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_MOBILE_COLLECTION_NAME);

      this.devopsJobsCollection = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_DEVOPS_COLLECTION_NAME);

      this.uiuxJobsCollection = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_UIUX_COLLECTION_NAME);

      this.webdevJobsCollection = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_WEBDEV_COLLECTION_NAME);

      this.dataJobsCollection = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_DATA_COLLECTION_NAME);

      this.qaJobsCollection = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_QA_COLLECTION_NAME);

      this.aiJobsCollection = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_AI_COLLECTION_NAME);

      this.productManagerJobsCollection = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_PRODUCT_MANAGER_COLLECTION_NAME);

      this.agileRelatedJobsCollection = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_AGILE_COLLECTION_NAME);

      this.recruitmentJobsCollection = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_RECRUITMENT_COLLECTION_NAME);

      this.linkedInDevJobsCollection = mongoDB
        .db(environment.LINKEDIN_DATABASE_NAME)
        .collection(environment.LINKEDIN_DEV_COLLECTION_NAME);
    }
  }

  getLinkedInDevJobs(): Observable<LinkedInJob[]> {
    return this.connectionObservable$.pipe(
      switchMap(() => this.linkedInDevJobsCollection.find() as Observable<LinkedInJob[]>),
      tap(() =>
        this.sendEventToUmami(
          `${jobCollectionsMap.linkedinDev.source} - ${jobCollectionsMap.linkedinDev.name}`,
        ),
      ),
    );
  }

  getRecruitmentJobs(): Observable<GupyJob[]> {
    return this.connectionObservable$.pipe(
      switchMap(() => this.recruitmentJobsCollection.find() as Observable<GupyJob[]>),
      tap(() =>
        this.sendEventToUmami(
          `${jobCollectionsMap.gupyRecruitment.source} - ${jobCollectionsMap.gupyRecruitment.name}`,
        ),
      ),
    );
  }

  getAgileRelatedJobs(): Observable<GupyJob[]> {
    return this.connectionObservable$.pipe(
      switchMap(() => this.agileRelatedJobsCollection.find() as Observable<GupyJob[]>),
      tap(() =>
        this.sendEventToUmami(
          `${jobCollectionsMap.gupyAgileRelated.source} - ${jobCollectionsMap.gupyAgileRelated.name}`,
        ),
      ),
    );
  }

  getProductManagerJobs(): Observable<GupyJob[]> {
    return this.connectionObservable$.pipe(
      switchMap(() => this.productManagerJobsCollection.find() as Observable<GupyJob[]>),
      tap(() =>
        this.sendEventToUmami(
          `${jobCollectionsMap.gupyProductManager.source} - ${jobCollectionsMap.gupyProductManager.name}`,
        ),
      ),
    );
  }

  getAIJobs(): Observable<GupyJob[]> {
    return this.connectionObservable$.pipe(
      switchMap(() => this.aiJobsCollection.find() as Observable<GupyJob[]>),
      tap(() =>
        this.sendEventToUmami(
          `${jobCollectionsMap.gupyIA.source} - ${jobCollectionsMap.gupyIA.name}`,
        ),
      ),
    );
  }

  getQAJobs(): Observable<GupyJob[]> {
    return this.connectionObservable$.pipe(
      switchMap(() => this.qaJobsCollection.find() as Observable<GupyJob[]>),
      tap(() =>
        this.sendEventToUmami(
          `${jobCollectionsMap.gupyQA.source} - ${jobCollectionsMap.gupyQA.name}`,
        ),
      ),
    );
  }

  getDataJobs(): Observable<GupyJob[]> {
    return this.connectionObservable$.pipe(
      switchMap(() => this.dataJobsCollection.find() as Observable<GupyJob[]>),
      tap(() =>
        this.sendEventToUmami(
          `${jobCollectionsMap.gupyDados.source} - ${jobCollectionsMap.gupyDados.name}`,
        ),
      ),
    );
  }

  getWebDevJobs(): Observable<GupyJob[]> {
    return this.connectionObservable$.pipe(
      switchMap(() => this.webdevJobsCollection.find() as Observable<GupyJob[]>),
      tap(() =>
        this.sendEventToUmami(
          `${jobCollectionsMap.gupyDev.source} - ${jobCollectionsMap.gupyDev.name}`,
        ),
      ),
    );
  }

  getUIUXJobs(): Observable<GupyJob[]> {
    return this.connectionObservable$.pipe(
      switchMap(() => this.uiuxJobsCollection.find() as Observable<GupyJob[]>),
      tap(() =>
        this.sendEventToUmami(
          `${jobCollectionsMap.gupyUIUX.source} - ${jobCollectionsMap.gupyUIUX.name}`,
        ),
      ),
    );
  }

  getMobileJobs(): Observable<GupyJob[]> {
    return this.connectionObservable$.pipe(
      switchMap(() => this.mobileJobsCollection.find() as Observable<GupyJob[]>),
      tap(() =>
        this.sendEventToUmami(
          `${jobCollectionsMap.gupyMobile.source} - ${jobCollectionsMap.gupyMobile.name}`,
        ),
      ),
    );
  }

  getDevOpsJobs(): Observable<GupyJob[]> {
    return this.connectionObservable$.pipe(
      switchMap(() => this.devopsJobsCollection.find() as Observable<GupyJob[]>),
      tap(() =>
        this.sendEventToUmami(
          `${jobCollectionsMap.gupyDevops.source} - ${jobCollectionsMap.gupyDevops.name}`,
        ),
      ),
    );
  }

  private sendEventToUmami(event: string): void {
    try {
      (window as any).umami.track(event);
    } catch (error) {
      console.warn('Umami not available');
    }
  }
}
