import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasySearchComponent } from './easy-search.component';

describe('EasySearchComponent', () => {
  let component: EasySearchComponent;
  let fixture: ComponentFixture<EasySearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EasySearchComponent]
    });
    fixture = TestBed.createComponent(EasySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
