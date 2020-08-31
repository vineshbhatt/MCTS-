import { TestBed, async, inject } from '@angular/core/testing';

import { IsadminguardGuard } from './isadminguard.guard';

describe('IsadminguardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsadminguardGuard]
    });
  });

  it('should ...', inject([IsadminguardGuard], (guard: IsadminguardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
