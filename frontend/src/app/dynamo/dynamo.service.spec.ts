import { TestBed } from '@angular/core/testing';

import { DynamoService } from './dynamo.service';

describe('DynamoService', () => {
  let service: DynamoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
