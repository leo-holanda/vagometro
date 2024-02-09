import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesOverviewComponent } from './companies-overview.component';

describe('CompaniesOverviewComponent', () => {
  let component: CompaniesOverviewComponent;
  let fixture: ComponentFixture<CompaniesOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CompaniesOverviewComponent],
    });
    fixture = TestBed.createComponent(CompaniesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
