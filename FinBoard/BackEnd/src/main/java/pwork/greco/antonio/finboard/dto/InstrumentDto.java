package pwork.greco.antonio.finboard.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstrumentDto {
    private Long id;
    private String name;
    private Long instrumentTypeId;
    private String currency;
    private String isin;
}
