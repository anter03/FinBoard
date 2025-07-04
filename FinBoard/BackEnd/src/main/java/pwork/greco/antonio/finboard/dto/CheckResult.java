package pwork.greco.antonio.finboard.dto;

public class CheckResult {
    private boolean valid;
    private String errorMessage;
    private CheckLimitDto appliedRule;

    private CheckResult(boolean valid, String errorMessage, CheckLimitDto appliedRule) {
        this.valid = valid;
        this.errorMessage = errorMessage;
        this.appliedRule = appliedRule;
    }

    public static CheckResult success(CheckLimitDto rule) {
        return new CheckResult(true, null, rule);
    }

    public static CheckResult failure(String errorMessage, CheckLimitDto rule) {
        return new CheckResult(false, errorMessage, rule);
    }

    public boolean isValid() {
        return valid;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public CheckLimitDto getAppliedRule() {
        return appliedRule;
    }


    public String getRuleDescription() {
        if (appliedRule == null) {
            return "Nessuna regola applicata";
        }
        return appliedRule.getDescription() != null ? appliedRule.getDescription() :
                String.format("Controllo ID: %d", appliedRule.getId());
    }

    @Override
    public String toString() {
        return String.format("CheckResult{valid=%s, rule=%s, message='%s'}",
                valid, getRuleDescription(), errorMessage);
    }
}