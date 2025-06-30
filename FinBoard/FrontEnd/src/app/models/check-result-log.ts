export interface CheckResultLog {
  id: number;
  valid: boolean;
  errorMessage: string | null;
  ruleDescription: string;
  ruleId: number | null;
  ruleText: string | null;
  timestamp: Date;  // <-- cambia qui da string a Date
}
