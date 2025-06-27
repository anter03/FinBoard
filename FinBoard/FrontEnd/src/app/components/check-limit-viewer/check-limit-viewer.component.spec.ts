import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckLimitViewerComponent } from './check-limit-viewer.component';

describe('CheckLimitViewerComponent', () => {
  let component: CheckLimitViewerComponent;
  let fixture: ComponentFixture<CheckLimitViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckLimitViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckLimitViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
