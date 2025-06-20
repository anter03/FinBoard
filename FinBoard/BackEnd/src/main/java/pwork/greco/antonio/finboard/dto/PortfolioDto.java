package pwork.greco.antonio.finboard.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortfolioDto {
    private Long id;
    private Long userId;
    private Long companyId;
    private String name;
    private LocalDateTime createdAt;
    private Boolean deleted;
    private LocalDateTime operationDate;
    private LocalDateTime evaluationDate;
}
