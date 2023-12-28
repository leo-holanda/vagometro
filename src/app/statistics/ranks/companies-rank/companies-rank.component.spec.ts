import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesRankComponent } from './companies-rank.component';

describe('CompaniesRankComponent', () => {
  let component: CompaniesRankComponent;
  let fixture: ComponentFixture<CompaniesRankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CompaniesRankComponent],
    });
    fixture = TestBed.createComponent(CompaniesRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
