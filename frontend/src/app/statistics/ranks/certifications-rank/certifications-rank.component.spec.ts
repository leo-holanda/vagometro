import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationsRankComponent } from './certifications-rank.component';

describe('CertificationsRankComponent', () => {
  let component: CertificationsRankComponent;
  let fixture: ComponentFixture<CertificationsRankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CertificationsRankComponent]
    });
    fixture = TestBed.createComponent(CertificationsRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
