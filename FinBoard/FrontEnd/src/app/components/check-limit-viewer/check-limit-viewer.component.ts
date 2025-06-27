// check-limit-viewer.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderValidationResponse } from '../../models/OrderValidationResponse';


@Component({
  selector: 'app-check-limit-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './check-limit-viewer.component.html',
  styleUrls: ['./check-limit-viewer.component.css']
})
export class CheckLimitViewerComponent {
  @Input() validationResponse: OrderValidationResponse | null = null;

  getPassedChecks(): number {
    if (!this.validationResponse) return 0;
    return this.validationResponse.checkResults.filter(check => check.valid).length;
  }
}