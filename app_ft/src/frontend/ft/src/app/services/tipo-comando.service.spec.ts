import { TestBed } from '@angular/core/testing';

import { TipoComandoService } from './tipo-comando.service';

describe('TipoComandoService', () => {
  let service: TipoComandoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoComandoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
