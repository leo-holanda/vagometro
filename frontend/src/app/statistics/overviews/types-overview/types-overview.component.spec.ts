import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesOverviewComponent } from './types-overview.component';

describe('TypesOverviewComponent', () => {
  let component: TypesOverviewComponent;
  let fixture: ComponentFixture<TypesOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TypesOverviewComponent]
    });
    fixture = TestBed.createComponent(TypesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
