import { TestBed } from '@angular/core/testing';

import { FrmService } from './frm.service';

describe('FrmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FrmService = TestBed.get(FrmService);
    expect(service).toBeTruthy();
  });
});
