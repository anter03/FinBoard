import { TestBed } from '@angular/core/testing';

import { InstrumentTypeService } from './instrument-type.service';

describe('InstrumentTypeService', () => {
  let service: InstrumentTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstrumentTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
