package pwork.greco.antonio.finboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import pwork.greco.antonio.finboard.dto.PortfolioDto;
import pwork.greco.antonio.finboard.service.PortfolioService;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping
    public List<PortfolioDto> getAll() {
        return portfolioService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PortfolioDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(portfolioService.getById(id));
    }

    @PostMapping
    public ResponseEntity<PortfolioDto> create(@RequestBody PortfolioDto dto) {
        return new ResponseEntity<>(portfolioService.create(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PortfolioDto> update(@PathVariable Long id, @RequestBody PortfolioDto dto) {
        return ResponseEntity.ok(portfolioService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        portfolioService.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/hard")
    public ResponseEntity<Void> hardDelete(@PathVariable Long id) {
        portfolioService.hardDelete(id);
        return ResponseEntity.noContent().build();
    }
}
