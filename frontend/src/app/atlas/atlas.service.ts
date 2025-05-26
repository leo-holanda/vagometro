import { Injectable } from '@angular/core';
import * as Realm from 'realm-web';
import { Observable, defer, shareReplay, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GupyJob } from '../job-sources/gupy/gupy.types';
import { LinkedInJob } from '../job-sources/linkedin/linked-in.types';
import { JobCollections } from '../job-sources/job-sources.types';

@Injectable({
  providedIn: 'root',
})
export class AtlasService {
  private connectionObservable$: any;
  //TODO: Remove this service and implement another API
  private collectionsMap: Record<any, any> = {};

  constructor() {
    this.connectionObservable$ = defer(() => this.openConnection()).pipe(shareReplay());
  }

  private async openConnection(): Promise<void> {
    const app = new Realm.App({ id: environment.ATLAS_APP_ID });
    const credentials = Realm.Credentials.anonymous();
    await app.logIn(credentials);

    if (app.currentUser) {
      const mongoDB = app.currentUser.mongoClient(environment.DATA_SOURCE_NAME);

      this.collectionsMap[JobCollections.gupyMobile] = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_MOBILE_COLLECTION_NAME);

      this.collectionsMap[JobCollections.gupyDevops] = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_DEVOPS_COLLECTION_NAME);

      this.collectionsMap[JobCollections.gupyUIUX] = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_UIUX_COLLECTION_NAME);

      this.collectionsMap[JobCollections.gupyDev] = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_WEBDEV_COLLECTION_NAME);

      this.collectionsMap[JobCollections.gupyDados] = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_DATA_COLLECTION_NAME);

      this.collectionsMap[JobCollections.gupyQA] = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_QA_COLLECTION_NAME);

      this.collectionsMap[JobCollections.gupyIA] = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_AI_COLLECTION_NAME);

      this.collectionsMap[JobCollections.gupyProductManager] = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_PRODUCT_MANAGER_COLLECTION_NAME);

      this.collectionsMap[JobCollections.gupyAgileRelated] = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_AGILE_COLLECTION_NAME);

      this.collectionsMap[JobCollections.gupyRecruitment] = mongoDB
        .db(environment.GUPY_DATABASE_NAME)
        .collection(environment.GUPY_RECRUITMENT_COLLECTION_NAME);

      this.collectionsMap[JobCollections.linkedinDev] = mongoDB
        .db(environment.LINKEDIN_DATABASE_NAME)
        .collection(environment.LINKEDIN_DEV_COLLECTION_NAME);
    }
  }

  getGupyJobs(collectionName: JobCollections): Observable<GupyJob[]> {
    return this.connectionObservable$.pipe(
      switchMap(() => this.collectionsMap[collectionName].find() as Observable<GupyJob[]>),
      tap(() => this.sendEventToUmami(`${collectionName.toString()}`)),
    );
  }

  getLinkedInJobs(): Observable<LinkedInJob[]> {
    return this.connectionObservable$.pipe(
      switchMap(
        () => this.collectionsMap[JobCollections.linkedinDev].find() as Observable<LinkedInJob[]>,
      ),
      tap(() => this.sendEventToUmami(`${JobCollections.linkedinDev.toString()}`)),
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
