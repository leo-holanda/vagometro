import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordsOverviewComponent } from './keywords-overview.component';

describe('KeywordsOverviewComponent', () => {
  let component: KeywordsOverviewComponent;
  let fixture: ComponentFixture<KeywordsOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KeywordsOverviewComponent],
    });
    fixture = TestBed.createComponent(KeywordsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
