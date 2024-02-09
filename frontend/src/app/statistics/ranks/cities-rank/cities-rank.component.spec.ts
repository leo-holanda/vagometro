import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitiesRankComponent } from './cities-rank.component';

describe('CitiesRankComponent', () => {
  let component: CitiesRankComponent;
  let fixture: ComponentFixture<CitiesRankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CitiesRankComponent],
    });
    fixture = TestBed.createComponent(CitiesRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
