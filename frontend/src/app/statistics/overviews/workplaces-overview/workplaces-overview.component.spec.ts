import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkplacesOverviewComponent } from './workplaces-overview.component';

describe('WorkplacesOverviewComponent', () => {
  let component: WorkplacesOverviewComponent;
  let fixture: ComponentFixture<WorkplacesOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WorkplacesOverviewComponent],
    });
    fixture = TestBed.createComponent(WorkplacesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
