package pwork.greco.antonio.finboard.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
//public class OrderDto {
//    private Long id;
//    private Long portfolioId;
//    private Long instrumentId;
//    private Long operatorId;
//    private String side;
//    private BigDecimal quantity;
//    private BigDecimal price;
//    private String status;
//    private LocalDateTime createdAt;
//    private LocalDateTime executedAt;
//    private Boolean deleted;
//}
public class OrderDto {
    private Long id;
    //private Long portfolioId;
    private PortfolioDto portfolio;
    //private Long instrumentId;
    private InstrumentDto instrument;
    //private Long operatorId;
    private UserDto user;
    private String side;
    private BigDecimal quantity;
    private BigDecimal price;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime executedAt;
    private Boolean deleted;
}