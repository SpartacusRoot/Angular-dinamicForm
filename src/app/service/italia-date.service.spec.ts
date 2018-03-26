import { TestBed, inject } from '@angular/core/testing';

import { ItaliaDateService } from './italia-date.service';

describe('ItaliaDateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItaliaDateService]
    });
  });

  it('should be created', inject([ItaliaDateService], (service: ItaliaDateService) => {
    expect(service).toBeTruthy();
  }));
});
