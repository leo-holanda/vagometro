import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabilityRankComponent } from './disability-rank.component';

describe('DisabilityRankComponent', () => {
  let component: DisabilityRankComponent;
  let fixture: ComponentFixture<DisabilityRankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DisabilityRankComponent]
    });
    fixture = TestBed.createComponent(DisabilityRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
