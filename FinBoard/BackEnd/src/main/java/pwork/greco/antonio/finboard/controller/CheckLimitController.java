package pwork.greco.antonio.finboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pwork.greco.antonio.finboard.dto.*;
import pwork.greco.antonio.finboard.service.CheckLimitService;

import java.util.List;

@RestController
@RequestMapping("/api/check-limits")
@RequiredArgsConstructor
public class CheckLimitController {

    private final CheckLimitService checkLimitService;

    // GET /api/check-limits
    @GetMapping
    public ResponseEntity<List<CheckLimitDto>> getAllCheckLimits() {
        List<CheckLimitDto> list = checkLimitService.getAll();
        return ResponseEntity.ok(list);
    }

    // GET /api/check-limits/{id}
    @GetMapping("/{id}")
    public ResponseEntity<CheckLimitDto> getCheckLimitById(@PathVariable Long id) {
        CheckLimitDto dto = checkLimitService.getById(id);
        return ResponseEntity.ok(dto);
    }

    // GET /api/check-limits/by-profile/{profileId}
    @GetMapping("/by-profile/{profileId}")
    public ResponseEntity<List<CheckLimitDto>> getByProfileId(@PathVariable Long profileId) {
        List<CheckLimitDto> list = checkLimitService.getByProfileId(profileId);
        return ResponseEntity.ok(list);
    }

    // POST /api/check-limits
    @PostMapping
    public ResponseEntity<CheckLimitDto> createCheckLimit(@RequestBody CheckLimitDto dto) {
        CheckLimitDto created = checkLimitService.create(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // PUT /api/check-limits/{id}
    @PutMapping("/{id}")
    public ResponseEntity<CheckLimitDto> updateCheckLimit(@PathVariable Long id, @RequestBody CheckLimitDto dto) {
        CheckLimitDto updated = checkLimitService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/check-limits/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCheckLimit(@PathVariable Long id) {
        checkLimitService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
