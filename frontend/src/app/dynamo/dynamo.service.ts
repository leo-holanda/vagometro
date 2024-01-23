import { Injectable, isDevMode } from '@angular/core';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  ScanCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import {
  Observable,
  asyncScheduler,
  delay,
  expand,
  of,
  scan,
  scheduled,
  takeWhile,
} from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DynamoService {
  private documentClient!: DynamoDBDocumentClient;

  constructor() {
    if (isDevMode()) this.openConnectionInDev();
    else this.openConnectionInProd();
  }

  scanJobs(): Observable<ScanCommandOutput[]> {
    const command = new ScanCommand({
      TableName: 'jobs',
    });

    return scheduled(this.documentClient.send(command), asyncScheduler).pipe(
      delay(1000),
      expand((response) => {
        if (response.LastEvaluatedKey) {
          const command = new ScanCommand({
            TableName: 'jobs',
            ExclusiveStartKey: response.LastEvaluatedKey,
          });

          return scheduled(
            this.documentClient.send(command),
            asyncScheduler
          ).pipe(delay(1000));
        }
        return of(response);
      }),
      takeWhile((response) => response.LastEvaluatedKey != undefined, true),
      scan((acc, response) => [...acc, response], [] as ScanCommandOutput[])
    );
  }

  private openConnectionInDev(): void {
    const client = new DynamoDBClient({
      region: 'localhost',
      credentials: {
        accessKeyId: 'any',
        secretAccessKey: 'any',
      },

      endpoint: 'http://localhost:8000',
    });

    this.documentClient = DynamoDBDocumentClient.from(client);
  }

  private openConnectionInProd(): void {
    const client = new DynamoDBClient({
      region: 'us-east-1',
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: 'us-east-1' },
        identityPoolId: environment.IDENTITY_POOL_ID,
      }),
    });

    this.documentClient = DynamoDBDocumentClient.from(client);
  }
}
