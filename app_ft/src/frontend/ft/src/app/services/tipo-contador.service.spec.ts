import { TestBed } from '@angular/core/testing';

import { TipoContadorService } from './tipo-contador.service';

describe('TipoContadorService', () => {
  let service: TipoContadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoContadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
