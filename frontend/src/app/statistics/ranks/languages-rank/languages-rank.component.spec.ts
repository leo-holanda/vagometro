import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagesRankComponent } from './languages-rank.component';

describe('LanguagesRankComponent', () => {
  let component: LanguagesRankComponent;
  let fixture: ComponentFixture<LanguagesRankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LanguagesRankComponent],
    });
    fixture = TestBed.createComponent(LanguagesRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
