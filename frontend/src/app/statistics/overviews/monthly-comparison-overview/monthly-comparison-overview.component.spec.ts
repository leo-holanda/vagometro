import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyComparisonOverviewComponent } from './monthly-comparison-overview.component';

describe('MonthlyComparisonOverviewComponent', () => {
  let component: MonthlyComparisonOverviewComponent;
  let fixture: ComponentFixture<MonthlyComparisonOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MonthlyComparisonOverviewComponent]
    });
    fixture = TestBed.createComponent(MonthlyComparisonOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
