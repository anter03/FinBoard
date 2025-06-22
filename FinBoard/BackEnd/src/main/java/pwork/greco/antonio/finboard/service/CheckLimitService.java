package pwork.greco.antonio.finboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pwork.greco.antonio.finboard.dto.CheckLimitDto;
import pwork.greco.antonio.finboard.entity.CheckLimit;
import pwork.greco.antonio.finboard.repository.ICheckLimitRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CheckLimitService {

    private final ICheckLimitRepository checkLimitRepository;

    public List<CheckLimitDto> getAll() {
        return checkLimitRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public CheckLimitDto getById(Long id) {
        CheckLimit checkLimit = checkLimitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CheckLimit not found with ID: " + id));
        return toDto(checkLimit);
    }

    public List<CheckLimitDto> getByProfileId(Long profileId) {
        return checkLimitRepository.findByProfileId(profileId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public CheckLimitDto create(CheckLimitDto dto) {
        CheckLimit entity = toEntity(dto);
        entity.setId(null); // preveniamo update
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        CheckLimit saved = checkLimitRepository.save(entity);
        return toDto(saved);
    }

    public CheckLimitDto update(Long id, CheckLimitDto dto) {
        CheckLimit existing = checkLimitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CheckLimit not found with ID: " + id));

        existing.setProfileId(dto.getProfileId());
        existing.setInstrumentTypeId(dto.getInstrumentTypeId());
        existing.setCountry(dto.getCountry());
        existing.setRating(dto.getRating());
        existing.setLimitType(dto.getLimitType());
        existing.setActionType(dto.getActionType());
        existing.setLimitValue(dto.getLimitValue());
        existing.setDescription(dto.getDescription());

        return toDto(checkLimitRepository.save(existing));
    }

    public void delete(Long id) {
        checkLimitRepository.deleteById(id);
    }

    // Mapping manuale

    private CheckLimitDto toDto(CheckLimit entity) {
        return CheckLimitDto.builder()
                .id(entity.getId())
                .profileId(entity.getProfileId())
                .instrumentTypeId(entity.getInstrumentTypeId())
                .country(entity.getCountry())
                .rating(entity.getRating())
                .limitType(entity.getLimitType())
                .actionType(entity.getActionType())
                .limitValue(entity.getLimitValue())
                .description(entity.getDescription())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    private CheckLimit toEntity(CheckLimitDto dto) {
        return CheckLimit.builder()
                .id(dto.getId())
                .profileId(dto.getProfileId())
                .instrumentTypeId(dto.getInstrumentTypeId())
                .country(dto.getCountry())
                .rating(dto.getRating())
                .limitType(dto.getLimitType())
                .actionType(dto.getActionType())
                .limitValue(dto.getLimitValue())
                .description(dto.getDescription())
                .createdAt(dto.getCreatedAt())
                .build();
    }
}
