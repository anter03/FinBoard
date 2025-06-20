package pwork.greco.antonio.finboard.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private Long companyId;
    private String username;
    private String passwordHash;
    private String email;
    private LocalDateTime createdAt;
    private Boolean deleted;
}
