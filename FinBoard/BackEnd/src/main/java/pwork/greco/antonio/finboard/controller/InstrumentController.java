package pwork.greco.antonio.finboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import pwork.greco.antonio.finboard.dto.InstrumentDto;
import pwork.greco.antonio.finboard.service.InstrumentService;

import java.util.List;

@RestController
@RequestMapping("/api/instruments")
@RequiredArgsConstructor
public class InstrumentController {

    private final InstrumentService instrumentService;

    @GetMapping
    public List<InstrumentDto> getAll() {
        return instrumentService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InstrumentDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(instrumentService.getById(id));
    }

    @PostMapping
    public ResponseEntity<InstrumentDto> create(@RequestBody InstrumentDto dto) {
        return new ResponseEntity<>(instrumentService.create(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InstrumentDto> update(@PathVariable Long id, @RequestBody InstrumentDto dto) {
        return ResponseEntity.ok(instrumentService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        instrumentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
