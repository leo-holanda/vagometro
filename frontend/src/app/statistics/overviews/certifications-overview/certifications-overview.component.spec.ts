import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationsOverviewComponent } from './certifications-overview.component';

describe('CertificationsOverviewComponent', () => {
  let component: CertificationsOverviewComponent;
  let fixture: ComponentFixture<CertificationsOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CertificationsOverviewComponent],
    });
    fixture = TestBed.createComponent(CertificationsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
