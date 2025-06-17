package pwork.greco.antonio.finboard.dto;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyDto {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private Boolean deleted;
}
