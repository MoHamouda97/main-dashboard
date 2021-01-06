import { TestBed } from '@angular/core/testing';

import { DatabindingService } from './databinding.service';

describe('DatabindingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatabindingService = TestBed.get(DatabindingService);
    expect(service).toBeTruthy();
  });
});
