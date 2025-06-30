package pwork.greco.antonio.finboard.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "check_result_log")
@Data // Genera getter, setter, toString, equals, hashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder // (opzionale ma utile per costruzione fluida)
public class CheckResultLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean valid;

    private String errorMessage;

    private String ruleDescription;

    private Long ruleId;

    private String ruleText;

    private LocalDateTime timestamp = LocalDateTime.now();
}
