import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabilityStatusesOverviewComponent } from './disability-statuses-overview.component';

describe('DisabilityStatusesOverviewComponent', () => {
  let component: DisabilityStatusesOverviewComponent;
  let fixture: ComponentFixture<DisabilityStatusesOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DisabilityStatusesOverviewComponent],
    });
    fixture = TestBed.createComponent(DisabilityStatusesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
