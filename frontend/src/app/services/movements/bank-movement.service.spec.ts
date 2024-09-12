import { TestBed } from '@angular/core/testing';

import { BankMovementService } from './bank-movement.service';

describe('BankMovementService', () => {
  let service: BankMovementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankMovementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
