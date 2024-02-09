import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationOverviewComponent } from './education-overview.component';

describe('EducationOverviewComponent', () => {
  let component: EducationOverviewComponent;
  let fixture: ComponentFixture<EducationOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EducationOverviewComponent],
    });
    fixture = TestBed.createComponent(EducationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
