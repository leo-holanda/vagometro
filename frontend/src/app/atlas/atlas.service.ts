import { Injectable } from '@angular/core';
import * as Realm from 'realm-web';
import { Observable, switchMap, defer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GupyJob } from '../job-sources/gupy/gupy.types';

@Injectable({
  providedIn: 'root',
})
export class AtlasService {
  private app = new Realm.App({ id: environment.ATLAS_APP_ID });
  private mongoDB: any;
  private mobileJobsCollection: any;
  private devopsJobsCollection: any;
  private uiuxJobsCollection: any;
  private webdevJobsCollection: any;

  constructor() {}

  private async openConnection(): Promise<void> {
    const credentials = Realm.Credentials.anonymous();
    await this.app.logIn(credentials);
    if (this.app.currentUser) {
      this.mongoDB = this.app.currentUser.mongoClient(
        environment.DATA_SOURCE_NAME
      );

      this.mobileJobsCollection = this.mongoDB
        .db(environment.DATABASE_NAME)
        .collection(environment.MOBILE_COLLECTION_NAME);

      this.devopsJobsCollection = this.mongoDB
        .db(environment.DATABASE_NAME)
        .collection(environment.DEVOPS_COLLECTION_NAME);

      this.uiuxJobsCollection = this.mongoDB
        .db(environment.DATABASE_NAME)
        .collection(environment.UIUX_COLLECTION_NAME);

      this.webdevJobsCollection = this.mongoDB
        .db(environment.DATABASE_NAME)
        .collection(environment.WEBDEV_COLLECTION_NAME);
    }
  }

  getWebDevJobs(): Observable<GupyJob[]> {
    return defer(() => this.openConnection()).pipe(
      switchMap(() =>
        defer(() => this.webdevJobsCollection.find() as Observable<GupyJob[]>)
      )
    );
  }

  getUIUXJobs(): Observable<GupyJob[]> {
    return defer(() => this.openConnection()).pipe(
      switchMap(() =>
        defer(() => this.uiuxJobsCollection.find() as Observable<GupyJob[]>)
      )
    );
  }

  getMobileJobs(): Observable<GupyJob[]> {
    return defer(() => this.openConnection()).pipe(
      switchMap(() =>
        defer(() => this.mobileJobsCollection.find() as Observable<GupyJob[]>)
      )
    );
  }

  getDevOpsJobs(): Observable<GupyJob[]> {
    return defer(() => this.openConnection()).pipe(
      switchMap(() =>
        defer(() => this.devopsJobsCollection.find() as Observable<GupyJob[]>)
      )
    );
  }
}
