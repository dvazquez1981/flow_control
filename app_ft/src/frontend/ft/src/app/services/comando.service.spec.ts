import { TestBed } from '@angular/core/testing';

import { ComandoService } from './comando.service';

describe('ComandoService', () => {
  let service: ComandoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComandoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
