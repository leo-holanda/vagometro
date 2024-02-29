import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesChartComponent } from './matches-chart.component';

describe('MatchesChartComponent', () => {
  let component: MatchesChartComponent;
  let fixture: ComponentFixture<MatchesChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatchesChartComponent]
    });
    fixture = TestBed.createComponent(MatchesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
