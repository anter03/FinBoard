package pwork.greco.antonio.finboard.service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pwork.greco.antonio.finboard.dto.CompanyDto;
import pwork.greco.antonio.finboard.entity.Company;
import pwork.greco.antonio.finboard.repository.ICompanyRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CompanyService {

    private final ICompanyRepository companyRepository;

    public List<CompanyDto> getAllCompanies() {
        return companyRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public CompanyDto getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with ID: " + id));
        return toDto(company);
    }

    public CompanyDto createCompany(CompanyDto dto) {
        Company entity = toEntity(dto);
        entity.setId(null); // previene update
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        if (entity.getDeleted() == null) {
            entity.setDeleted(false);
        }
        Company saved = companyRepository.save(entity);
        return toDto(saved);
    }

    public CompanyDto updateCompany(Long id, CompanyDto dto) {
        Company existing = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with ID: " + id));

        existing.setName(dto.getName());
        return toDto(companyRepository.save(existing));
    }

    public void softDeleteCompany(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with ID: " + id));
        company.setDeleted(true);
        companyRepository.save(company);
    }

    // Mapping manuale

    private CompanyDto toDto(Company entity) {
        return CompanyDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .createdAt(entity.getCreatedAt())
                .deleted(entity.getDeleted())
                .build();
    }

    private Company toEntity(CompanyDto dto) {
        return Company.builder()
                .id(dto.getId())
                .name(dto.getName())
                .createdAt(dto.getCreatedAt())
                .deleted(dto.getDeleted())
                .build();
    }
}
