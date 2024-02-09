import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrazilMapComponent } from './brazil-map.component';

describe('BrazilMapComponent', () => {
  let component: BrazilMapComponent;
  let fixture: ComponentFixture<BrazilMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrazilMapComponent],
    });
    fixture = TestBed.createComponent(BrazilMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
