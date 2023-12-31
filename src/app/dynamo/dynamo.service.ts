import { Injectable } from '@angular/core';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  ScanCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { Observable, asyncScheduler, scheduled } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DynamoService {
  private documentClient: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({
      region: 'us-east-1',
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: 'us-east-1' },
        identityPoolId: environment.IDENTITY_POOL_ID,
      }),
    });

    this.documentClient = DynamoDBDocumentClient.from(client);
  }

  scanJobs(): Observable<ScanCommandOutput> {
    const command = new ScanCommand({
      TableName: 'jobs',
    });

    return scheduled(this.documentClient.send(command), asyncScheduler);
  }
}
