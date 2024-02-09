import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkplaceRankComponent } from './workplace-rank.component';

describe('WorkplaceRankComponent', () => {
  let component: WorkplaceRankComponent;
  let fixture: ComponentFixture<WorkplaceRankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WorkplaceRankComponent],
    });
    fixture = TestBed.createComponent(WorkplaceRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
