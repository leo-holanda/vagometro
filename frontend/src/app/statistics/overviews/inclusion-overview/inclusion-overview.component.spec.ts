import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InclusionOverviewComponent } from './inclusion-overview.component';

describe('InclusionOverviewComponent', () => {
  let component: InclusionOverviewComponent;
  let fixture: ComponentFixture<InclusionOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InclusionOverviewComponent],
    });
    fixture = TestBed.createComponent(InclusionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
