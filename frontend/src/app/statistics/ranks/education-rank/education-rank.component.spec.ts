import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationRankComponent } from './education-rank.component';

describe('EducationRankComponent', () => {
  let component: EducationRankComponent;
  let fixture: ComponentFixture<EducationRankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EducationRankComponent],
    });
    fixture = TestBed.createComponent(EducationRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
