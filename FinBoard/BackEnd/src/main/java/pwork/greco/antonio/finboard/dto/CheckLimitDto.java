package pwork.greco.antonio.finboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckLimitDto {
    private Long id;
    private Long profileId;
    private Long instrumentTypeId;
    private String country;
    private String rating;
    private String limitType;
    private String actionType;
    private BigDecimal limitValue;
    private String description;
    private LocalDateTime createdAt;
}
