import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPostingsComparisonComponent } from './job-postings-comparison.component';

describe('JobPostingsComparisonComponent', () => {
  let component: JobPostingsComparisonComponent;
  let fixture: ComponentFixture<JobPostingsComparisonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JobPostingsComparisonComponent]
    });
    fixture = TestBed.createComponent(JobPostingsComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
