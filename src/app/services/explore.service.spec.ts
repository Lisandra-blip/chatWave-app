/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExploreService } from './explore.service';

describe('Service: Explore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExploreService]
    });
  });

  it('should ...', inject([ExploreService], (service: ExploreService) => {
    expect(service).toBeTruthy();
  }));
});
