import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioReportComponent } from './portfolio-report.component';

describe('PortfolioReportComponent', () => {
  let component: PortfolioReportComponent;
  let fixture: ComponentFixture<PortfolioReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
