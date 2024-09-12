import { TestBed } from '@angular/core/testing';

import { BalanceCheckpointService } from './balance-checkpoint.service';

describe('BalanceCheckpointService', () => {
  let service: BalanceCheckpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BalanceCheckpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
