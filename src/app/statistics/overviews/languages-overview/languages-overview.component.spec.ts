import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagesOverviewComponent } from './languages-overview.component';

describe('LanguagesOverviewComponent', () => {
  let component: LanguagesOverviewComponent;
  let fixture: ComponentFixture<LanguagesOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LanguagesOverviewComponent]
    });
    fixture = TestBed.createComponent(LanguagesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
