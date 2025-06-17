package pwork.greco.antonio.finboard.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pwork.greco.antonio.finboard.dto.CompanyDto;
import pwork.greco.antonio.finboard.service.CompanyService;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    // GET /api/companies
    @GetMapping
    public ResponseEntity<List<CompanyDto>> getAllCompanies() {
        List<CompanyDto> companies = companyService.getAllCompanies();
        return ResponseEntity.ok(companies);
    }

    // GET /api/companies/{id}
    @GetMapping("/{id}")
    public ResponseEntity<CompanyDto> getCompanyById(@PathVariable Long id) {
        CompanyDto dto = companyService.getCompanyById(id);
        return ResponseEntity.ok(dto);
    }

    // POST /api/companies
    @PostMapping
    public ResponseEntity<CompanyDto> createCompany(@RequestBody CompanyDto dto) {
        CompanyDto created = companyService.createCompany(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // PUT /api/companies/{id}
    @PutMapping("/{id}")
    public ResponseEntity<CompanyDto> updateCompany(@PathVariable Long id, @RequestBody CompanyDto dto) {
        CompanyDto updated = companyService.updateCompany(id, dto);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/companies/{id} (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDeleteCompany(@PathVariable Long id) {
        companyService.softDeleteCompany(id);
        return ResponseEntity.noContent().build();
    }
}

