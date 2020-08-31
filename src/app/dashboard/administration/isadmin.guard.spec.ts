import { TestBed, async, inject } from '@angular/core/testing';

import { IsadminGuard } from './isadmin.guard';

describe('IsadminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsadminGuard]
    });
  });

  it('should ...', inject([IsadminGuard], (guard: IsadminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
