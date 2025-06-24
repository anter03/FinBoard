package pwork.greco.antonio.finboard.service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pwork.greco.antonio.finboard.dto.UserDto;
import pwork.greco.antonio.finboard.entity.Profile;
import pwork.greco.antonio.finboard.entity.User;
import pwork.greco.antonio.finboard.repository.IProfileRepository;
import pwork.greco.antonio.finboard.repository.IUserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class UserService {

    private final IUserRepository userRepository;
    private final IProfileRepository profileRepository;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        return toDto(user);
    }

    public UserDto createUser(UserDto dto) {
        User entity = toEntity(dto);
        entity.setId(null);
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        entity.setDeleted(false); // nuovo utente non cancellato
        User saved = userRepository.save(entity);
        return toDto(saved);
    }

    public UserDto updateUser(Long id, UserDto dto) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        existing.setUsername(dto.getUsername());
        existing.setEmail(dto.getEmail());
        existing.setPasswordHash(dto.getPasswordHash());
        existing.setCompanyId(dto.getCompanyId());
        return toDto(userRepository.save(existing));
    }

    public void softDeleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        user.setDeleted(true);
        userRepository.save(user);
    }

    public void hardDeleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }
    private UserDto toDto(User entity) {
        Profile profile = null;
        if (entity.getProfileId() != null) {
            profile = profileRepository.findById(entity.getProfileId()).orElse(null);
        }

        return UserDto.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .username(entity.getUsername())
                .passwordHash(entity.getPasswordHash())
                .email(entity.getEmail())
                .createdAt(entity.getCreatedAt())
                .profile(profile)
                .deleted(entity.isDeleted())
                .build();
    }

    public User toEntity(UserDto dto) {
        Long profileId = null;
        if (dto.getProfile() != null) {
            profileId = dto.getProfile().getId();
        }

        return User.builder()
                .id(dto.getId())
                .companyId(dto.getCompanyId())
                .username(dto.getUsername())
                .passwordHash(dto.getPasswordHash())
                .email(dto.getEmail())
                .createdAt(dto.getCreatedAt())
                .deleted(dto.getDeleted() != null ? dto.getDeleted() : false)
                .profileId(profileId)
                .build();
    }

}
