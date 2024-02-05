import { Injectable } from '@angular/core';
import * as Realm from 'realm-web';
import {
  Observable,
  defer,
  shareReplay,
  mergeMap,
  first,
  switchMap,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { GupyJob } from '../job-sources/gupy/gupy.types';

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

  private connectionObservable$: any;

  constructor() {
    this.connectionObservable$ = defer(() => this.openConnection()).pipe(
      shareReplay()
    );
  }

  private async openConnection(): Promise<void> {
    const app = new Realm.App({ id: environment.ATLAS_APP_ID });
    const credentials = Realm.Credentials.anonymous();
    await app.logIn(credentials);

    if (app.currentUser) {
      const mongoDB = app.currentUser.mongoClient(environment.DATA_SOURCE_NAME);

      this.mobileJobsCollection = mongoDB
        .db(environment.DATABASE_NAME)
        .collection(environment.MOBILE_COLLECTION_NAME);

      this.devopsJobsCollection = mongoDB
        .db(environment.DATABASE_NAME)
        .collection(environment.DEVOPS_COLLECTION_NAME);

      this.uiuxJobsCollection = mongoDB
        .db(environment.DATABASE_NAME)
        .collection(environment.UIUX_COLLECTION_NAME);

      this.webdevJobsCollection = mongoDB
        .db(environment.DATABASE_NAME)
        .collection(environment.WEBDEV_COLLECTION_NAME);

      this.dataJobsCollection = mongoDB
        .db(environment.DATABASE_NAME)
        .collection(environment.DATA_COLLECTION_NAME);
    }
  }

  getDataJobs(): Observable<GupyJob[]> {
    return this.connectionObservable$.pipe(
      switchMap(() => this.dataJobsCollection.find() as Observable<GupyJob[]>)
    );
  }

  getWebDevJobs(): Observable<GupyJob[]> {
    return this.connectionObservable$.pipe(
      switchMap(() => this.webdevJobsCollection.find() as Observable<GupyJob[]>)
    );
  }

  getUIUXJobs(): Observable<GupyJob[]> {
    return this.connectionObservable$.pipe(
      switchMap(() => this.uiuxJobsCollection.find() as Observable<GupyJob[]>)
    );
  }

  getMobileJobs(): Observable<GupyJob[]> {
    return this.connectionObservable$.pipe(
      switchMap(() => this.mobileJobsCollection.find() as Observable<GupyJob[]>)
    );
  }

  getDevOpsJobs(): Observable<GupyJob[]> {
    return this.connectionObservable$.pipe(
      switchMap(() => this.devopsJobsCollection.find() as Observable<GupyJob[]>)
    );
  }
}
