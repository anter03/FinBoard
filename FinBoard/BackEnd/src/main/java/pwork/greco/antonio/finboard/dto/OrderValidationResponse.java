package pwork.greco.antonio.finboard.dto;

import java.util.List;

public class OrderValidationResponse {
    private boolean valid;
    private List<String> errorMessages;
    private List<CheckResult> checkResults;

    public OrderValidationResponse(boolean valid, List<String> errorMessages, List<CheckResult> checkResults) {
        this.valid = valid;
        this.errorMessages = errorMessages;
        this.checkResults = checkResults;
    }

    // Getters
    public boolean isValid() { return valid; }
    public List<String> getErrorMessages() { return errorMessages; }
    public List<CheckResult> getCheckResults() { return checkResults; }
}
