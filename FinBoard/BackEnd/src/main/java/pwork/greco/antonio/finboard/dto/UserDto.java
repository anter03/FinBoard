package pwork.greco.antonio.finboard.dto;

import lombok.*;
import pwork.greco.antonio.finboard.entity.Profile;

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
    private Profile profile;
    private Boolean deleted;
}
