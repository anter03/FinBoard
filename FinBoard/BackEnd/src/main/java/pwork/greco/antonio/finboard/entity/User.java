package pwork.greco.antonio.finboard.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "[User]", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "CompanyId", nullable = false)
    private Long companyId;

    @Column(length = 50, nullable = false)
    private String username;

    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String passwordHash;

    @Column(length = 100, nullable = false)
    private String email;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private boolean deleted = false;

    // Foreign key constraint will be handled via relation in a more advanced setup (with Company entity)
}