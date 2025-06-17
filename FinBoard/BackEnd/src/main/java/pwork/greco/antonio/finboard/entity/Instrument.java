package pwork.greco.antonio.finboard.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "Instrument")
public class Instrument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "InstrumentTypeId", nullable = false)
    private InstrumentType instrumentType;

    @Column(length = 10, nullable = false)
    private String currency;

    @Column(length = 20, unique = true)
    private String isin;
}
