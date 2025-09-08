import { TestBed } from '@angular/core/testing';

import { ElectrovalvulaService } from './electrovalvula.service';

describe('ElectrovalvulaService', () => {
  let service: ElectrovalvulaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectrovalvulaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
