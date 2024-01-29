import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonOverviewComponent } from './comparison-overview.component';

describe('ComparisonOverviewComponent', () => {
  let component: ComparisonOverviewComponent;
  let fixture: ComponentFixture<ComparisonOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ComparisonOverviewComponent],
    });
    fixture = TestBed.createComponent(ComparisonOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
