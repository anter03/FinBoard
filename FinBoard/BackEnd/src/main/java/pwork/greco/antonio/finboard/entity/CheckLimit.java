package pwork.greco.antonio.finboard.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "check_limit")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckLimit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "profile_id", nullable = false)
    private Long profileId;

    @Column(name = "instrument_type_id")
    private Long instrumentTypeId;

    @Column(length = 10)
    private String country;

    @Column(length = 10)
    private String rating;

    @Column(name = "limit_type", length = 10, nullable = false)
    private String limitType; // 'DAILY' o 'TOTAL'

    @Column(name = "action_type", length = 20, nullable = false)
    private String actionType; // 'FORBIDDEN' o 'LIMIT'

    @Column(name = "limit_value", precision = 18, scale = 4)
    private BigDecimal limitValue;

    @Column(length = 200)
    private String description;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
