package pwork.greco.antonio.finboard.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderFilters {
    private String id;
    private String isin;
    private BigDecimal quantity;
    private Long  portfolio;
    private String operationDateFrom;
    private String operationDateTo;
    private String valueDateFrom;
    private String valueDateTo;
    private String status;
    private String currency;
    private String side;
}
