import { TestBed } from '@angular/core/testing';

import { BankSyncValidationService } from './bank-sync-validation.service';

describe('BankSyncValidationService', () => {
  let service: BankSyncValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankSyncValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
