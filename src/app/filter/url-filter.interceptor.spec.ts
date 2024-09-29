import { TestBed } from '@angular/core/testing';

import { UrlFilterInterceptor } from './url-filter.interceptor';

describe('UrlFilterInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      UrlFilterInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: UrlFilterInterceptor = TestBed.inject(UrlFilterInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
