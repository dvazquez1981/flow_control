import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogRiegoPage } from './log-riego.page';

describe('LogRiegoPage', () => {
  let component: LogRiegoPage;
  let fixture: ComponentFixture<LogRiegoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LogRiegoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
