import { CheckLimitDto } from "./CheckLimitDto";

export interface CheckResult {
  valid: boolean;
  errorMessage?: string;
  appliedRule: CheckLimitDto;
}