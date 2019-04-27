import { TestBed, inject } from '@angular/core/testing';

import { TransferdataService } from './transferdata.service';

describe('TransferdataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransferdataService]
    });
  });

  it('should be created', inject([TransferdataService], (service: TransferdataService) => {
    expect(service).toBeTruthy();
  }));
});
