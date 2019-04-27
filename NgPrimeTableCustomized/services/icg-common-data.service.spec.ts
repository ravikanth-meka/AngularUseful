import { TestBed, inject } from '@angular/core/testing';

import { IcgCommonDataService } from './icg-common-data.service';

describe('IcgCommonDataServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IcgCommonDataService]
    });
  });

  it('should be created', inject([IcgCommonDataService], (service: IcgCommonDataService) => {
    expect(service).toBeTruthy();
  }));
});
