import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankComponent } from './rank.component';

describe('RankComponent', () => {
  let component: RankComponent;
  let fixture: ComponentFixture<RankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RankComponent]
    });
    fixture = TestBed.createComponent(RankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
