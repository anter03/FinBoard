import { CheckResult } from "./CheckResult";

export interface OrderValidationResponse {
  valid: boolean;
  errorMessages: string[];
  checkResults: CheckResult[];
}