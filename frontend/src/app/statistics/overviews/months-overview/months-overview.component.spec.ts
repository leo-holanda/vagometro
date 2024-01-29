import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthsOverviewComponent } from './months-overview.component';

describe('MonthsOverviewComponent', () => {
  let component: MonthsOverviewComponent;
  let fixture: ComponentFixture<MonthsOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MonthsOverviewComponent]
    });
    fixture = TestBed.createComponent(MonthsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
