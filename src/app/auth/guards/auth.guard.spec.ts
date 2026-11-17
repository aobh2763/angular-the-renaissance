import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const executeGuard: CanMatchFn = (...params) =>
    TestBed.runInInjectionContext(() => authGuard(...params));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
