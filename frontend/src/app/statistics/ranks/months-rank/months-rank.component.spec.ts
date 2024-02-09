import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthsRankComponent } from './months-rank.component';

describe('MonthsRankComponent', () => {
  let component: MonthsRankComponent;
  let fixture: ComponentFixture<MonthsRankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MonthsRankComponent],
    });
    fixture = TestBed.createComponent(MonthsRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
