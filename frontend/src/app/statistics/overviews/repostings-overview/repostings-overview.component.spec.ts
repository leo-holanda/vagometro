import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepostingsOverviewComponent } from './repostings-overview.component';

describe('RepostingsOverviewComponent', () => {
  let component: RepostingsOverviewComponent;
  let fixture: ComponentFixture<RepostingsOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RepostingsOverviewComponent]
    });
    fixture = TestBed.createComponent(RepostingsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
