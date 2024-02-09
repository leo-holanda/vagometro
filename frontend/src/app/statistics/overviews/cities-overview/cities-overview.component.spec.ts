import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitiesOverviewComponent } from './cities-overview.component';

describe('CitiesOverviewComponent', () => {
  let component: CitiesOverviewComponent;
  let fixture: ComponentFixture<CitiesOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CitiesOverviewComponent],
    });
    fixture = TestBed.createComponent(CitiesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
