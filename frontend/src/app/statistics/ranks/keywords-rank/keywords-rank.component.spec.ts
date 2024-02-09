import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordsRankComponent } from './keywords-rank.component';

describe('KeywordsRankComponent', () => {
  let component: KeywordsRankComponent;
  let fixture: ComponentFixture<KeywordsRankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KeywordsRankComponent],
    });
    fixture = TestBed.createComponent(KeywordsRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
