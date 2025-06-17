package pwork.greco.antonio.finboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pwork.greco.antonio.finboard.dto.PortfolioDto;
import pwork.greco.antonio.finboard.entity.Company;
import pwork.greco.antonio.finboard.entity.Portfolio;
import pwork.greco.antonio.finboard.entity.User;
import pwork.greco.antonio.finboard.repository.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PortfolioService {

    private final IPortfolioRepository portfolioRepository;
    private final IUserRepository userRepository;
    private final ICompanyRepository companyRepository;

    public List<PortfolioDto> getAll() {
        return portfolioRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public PortfolioDto getById(Long id) {
        return toDto(portfolioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Portfolio not found with ID: " + id)));
    }

    public PortfolioDto create(PortfolioDto dto) {
        Portfolio entity = toEntity(dto);
        entity.setId(null);
        if (entity.getCreatedAt() == null)
            entity.setCreatedAt(LocalDateTime.now());
        if (entity.getDeleted() == null)
            entity.setDeleted(false);
        return toDto(portfolioRepository.save(entity));
    }

    public PortfolioDto update(Long id, PortfolioDto dto) {
        Portfolio existing = portfolioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Portfolio not found with ID: " + id));
        existing.setName(dto.getName());
        return toDto(portfolioRepository.save(existing));
    }

    public void softDelete(Long id) {
        Portfolio portfolio = portfolioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Portfolio not found with ID: " + id));
        portfolio.setDeleted(true);
        portfolioRepository.save(portfolio);
    }

    public void hardDelete(Long id) {
        portfolioRepository.deleteById(id);
    }

    // Mapping

    private PortfolioDto toDto(Portfolio entity) {
        return PortfolioDto.builder()
                .id(entity.getId())
                .userId(entity.getUser() != null ? entity.getUser().getId() : null)
                .companyId(entity.getCompany() != null ? entity.getCompany().getId() : null)
                .name(entity.getName())
                .createdAt(entity.getCreatedAt())
                .deleted(entity.getDeleted())
                .build();
    }

    private Portfolio toEntity(PortfolioDto dto) {
        User user = dto.getUserId() != null
                ? userRepository.findById(dto.getUserId().longValue())
                .orElseThrow(() -> new RuntimeException("User not found"))
                : null;

        Company company = dto.getCompanyId() != null
                ? companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"))
                : null;

        if (user == null && company == null)
            throw new RuntimeException("Either userId or companyId must be provided");

        if (user != null && company != null)
            throw new RuntimeException("Only one of userId or companyId can be provided");

        return Portfolio.builder()
                .id(dto.getId())
                .user(user)
                .company(company)
                .name(dto.getName())
                .createdAt(dto.getCreatedAt())
                .deleted(dto.getDeleted())
                .build();
    }
}
