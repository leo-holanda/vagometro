import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeRankComponent } from './type-rank.component';

describe('TypeRankComponent', () => {
  let component: TypeRankComponent;
  let fixture: ComponentFixture<TypeRankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TypeRankComponent],
    });
    fixture = TestBed.createComponent(TypeRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
