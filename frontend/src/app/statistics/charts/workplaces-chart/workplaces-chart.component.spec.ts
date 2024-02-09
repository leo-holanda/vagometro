import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkplacesChartComponent } from './workplaces-chart.component';

describe('WorkplacesChartComponent', () => {
  let component: WorkplacesChartComponent;
  let fixture: ComponentFixture<WorkplacesChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WorkplacesChartComponent],
    });
    fixture = TestBed.createComponent(WorkplacesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
