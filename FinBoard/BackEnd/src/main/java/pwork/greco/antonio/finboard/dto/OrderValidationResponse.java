package pwork.greco.antonio.finboard.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderValidationResponse {
    private boolean valid;
    private List<String> errorMessages;
    private List<CheckResult> checkResults;
}
