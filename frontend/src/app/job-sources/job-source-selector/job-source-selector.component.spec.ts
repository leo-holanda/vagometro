import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSourceSelectorComponent } from './job-source-selector.component';

describe('JobSourceSelectorComponent', () => {
  let component: JobSourceSelectorComponent;
  let fixture: ComponentFixture<JobSourceSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JobSourceSelectorComponent]
    });
    fixture = TestBed.createComponent(JobSourceSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
