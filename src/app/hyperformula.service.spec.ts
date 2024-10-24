import { TestBed } from '@angular/core/testing';

import { HyperformulaService } from './hyperformula.service';

describe('HyperformulaService', () => {
  let service: HyperformulaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HyperformulaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
