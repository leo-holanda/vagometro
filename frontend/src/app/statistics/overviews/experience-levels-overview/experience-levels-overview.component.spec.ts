import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceLevelsOverviewComponent } from './experience-levels-overview.component';

describe('ExperienceLevelsOverviewComponent', () => {
  let component: ExperienceLevelsOverviewComponent;
  let fixture: ComponentFixture<ExperienceLevelsOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExperienceLevelsOverviewComponent],
    });
    fixture = TestBed.createComponent(ExperienceLevelsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
