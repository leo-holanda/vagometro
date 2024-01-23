import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceLevelRankComponent } from './experience-levels-rank.component';

describe('ExperienceLevelRankComponent', () => {
  let component: ExperienceLevelRankComponent;
  let fixture: ComponentFixture<ExperienceLevelRankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExperienceLevelRankComponent],
    });
    fixture = TestBed.createComponent(ExperienceLevelRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
