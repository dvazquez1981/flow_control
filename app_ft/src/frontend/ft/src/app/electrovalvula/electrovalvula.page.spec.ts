import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElectrovalvulaPage } from './electrovalvula.page';

describe('ElectrovalvulaPage', () => {
  let component: ElectrovalvulaPage;
  let fixture: ComponentFixture<ElectrovalvulaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectrovalvulaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
